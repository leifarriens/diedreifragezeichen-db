import {
  type AnySchema,
  create,
  type DefaultTokenizer,
  insertMultiple,
  type SchemaTypes,
  search,
} from "@orama/orama";
import { tokenizer as oramaTokenizer } from "@orama/orama/components";

export interface SearchableFolge {
  authors: string[];
  collection: string;
  communityRating: null | {
    score: number;
  };
  id: number;
  number: null | number;
  releaseDate: null | string;
  scriptAuthors: string[];
  title: string;
  voiceRoles: { role: string; speaker: string }[];
}

export interface SearchCriteria {
  filters?: {
    authors?: string[];
    collections?: string[];
    roles?: string[];
    scriptAuthors?: string[];
    speakers?: string[];
    yearRange?: {
      max: number;
      min: number;
    };
  };
  limit?: number;
  sort?: SortOption;
  term?: string;
}

export interface SearchEngine<T extends SearchableFolge> {
  search(options: SearchCriteria): Promise<{
    count: number;
    results: T[];
  }>;
}

export type SortOption =
  | {
      by: "communityRating";
      order: "DESC";
    }
  | {
      by: "releaseDate";
      order: "ASC" | "DESC";
    };

const searchSchema = {
  authors: "enum[]",
  collection: "enum",
  communityRating: "number",
  id: "string",
  number: "string",
  releaseDate: "string",
  releaseYear: "number",
  roles: "enum[]",
  scriptAuthors: "enum[]",
  speakers: "enum[]",
  title: "string",
} as const satisfies AnySchema;

type DocumentFrom<S extends AnySchema> = {
  [K in keyof S]: SchemaTypes<S[K]>;
};

type OptionalSearchFields =
  "communityRating" | "number" | "releaseDate" | "releaseYear";

type SearchDocument = DocumentFrom<typeof searchSchema>;

type SearchDocumentInput = Omit<SearchDocument, OptionalSearchFields> &
  Partial<
    Pick<SearchDocument, Extract<keyof SearchDocument, OptionalSearchFields>>
  >;

export async function createSearchEngine<T extends SearchableFolge>(
  folgen: T[],
): Promise<SearchEngine<T>> {
  const tokenizer = createSubstringTokenizer();

  const db = create({
    components: { tokenizer },
    schema: searchSchema,
    sort: {
      // By default, Orama allows the sort on all properties defined in the schema.
      // This would create an in-memory sort index for each property.
      unsortableProperties: [
        "authors",
        "collection",
        "id",
        "number",
        "releaseYear", // We already have releaseDate
        "roles",
        "scriptAuthors",
        "speakers",
        "title",
      ],
    },
  });

  await insertMultiple(db, folgen.map(toSearchDocument));

  const folgenById = new Map(
    folgen.map((folge) => [folge.id.toString(), folge]),
  );

  return {
    search: async ({ filters, limit, sort, term }: SearchCriteria) => {
      const params = {
        ...(sort && { sortBy: { order: sort.order, property: sort.by } }),
        term: term ?? "",
        ...(filters && {
          where: {
            ...(filters.authors &&
              filters.authors.length > 0 && {
                authors: { containsAny: filters.authors },
              }),
            ...(filters.roles &&
              filters.roles.length > 0 && {
                roles: { containsAny: filters.roles },
              }),
            ...(filters.scriptAuthors &&
              filters.scriptAuthors.length > 0 && {
                scriptAuthors: { containsAny: filters.scriptAuthors },
              }),
            ...(filters.speakers &&
              filters.speakers.length > 0 && {
                speakers: { containsAny: filters.speakers },
              }),
            ...(filters.collections &&
              filters.collections.length > 0 && {
                collection: { in: filters.collections },
              }),
            ...(filters.yearRange && {
              releaseYear: {
                between: [filters.yearRange.min, filters.yearRange.max] as [
                  number,
                  number,
                ],
              },
            }),
          },
        }),
      };

      const results = await search(db, {
        boost: {
          title: 1,
        },
        limit: limit ?? folgen.length, // set the default limit to the total number of folgen
        properties: ["title", "number", "releaseDate"],
        ...params,
      });

      const foundFolgen = results.hits.flatMap((hit) => {
        const folge = folgenById.get(hit.document.id);
        return folge ? [folge] : [];
      });

      return {
        count: foundFolgen.length,
        results: foundFolgen,
      };
    },
  };
}

/**
 * A tokenizer that generates all possible substrings of each token in the title property.
 */
function createSubstringTokenizer(): DefaultTokenizer {
  const tokenizer = oramaTokenizer.createTokenizer({ language: "german" });
  const tokenize = tokenizer.tokenize;
  tokenizer.tokenize = (raw, language, property, withCache) => {
    const tokens = tokenize(raw, language, property, withCache);
    if (property !== "title") {
      return tokens;
    }

    const suffixes = new Set<string>();
    for (const token of tokens) {
      for (let index = 0; index < token.length; index++) {
        suffixes.add(token.slice(index));
      }
    }
    return [...suffixes];
  };

  return tokenizer;
}

function toSearchDocument(folge: SearchableFolge): SearchDocumentInput {
  return {
    ...(folge.communityRating !== null && {
      communityRating: folge.communityRating.score,
    }),
    collection: folge.collection,
    id: folge.id.toString(),
    scriptAuthors: folge.scriptAuthors,
    ...(folge.number !== null && { number: folge.number.toString() }),
    ...(folge.releaseDate !== null && { releaseDate: folge.releaseDate }),
    authors: folge.authors,
    roles: folge.voiceRoles.map(({ role }) => role),
    speakers: folge.voiceRoles.map(({ speaker }) => speaker),
    title: folge.title,
    ...(folge.releaseDate !== null && {
      releaseYear: Number(folge.releaseDate.slice(0, 4)),
    }),
  };
}
