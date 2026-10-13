import {
  type AnySchema,
  create,
  insertMultiple,
  type SchemaTypes,
  search,
} from "@orama/orama";

export interface SearchableFolge {
  authors: string[];
  collection: string;
  communityRating: null | {
    score: number;
  };
  description: null | string;
  id: number;
  number: null | number;
  release_date: null | string;
  script_authors: string[];
  title: string;
  voice_roles: { role: string; speaker: string }[];
}

export interface SearchCriteria {
  filters?: {
    authors?: string[];
    collections?: string[];
    roles?: string[];
    script_authors?: string[];
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
      by: "release_date";
      order: "ASC" | "DESC";
    };

const searchSchema = {
  authors: "enum[]",
  collection: "enum",
  communityRating: "number",
  id: "string",
  number: "string",
  release_date: "string",
  release_year: "number",
  roles: "enum[]",
  script_authors: "enum[]",
  speakers: "enum[]",
  title: "string",
} as const satisfies AnySchema;

type DocumentFrom<S extends AnySchema> = {
  [K in keyof S]: SchemaTypes<S[K]>;
};

type OptionalSearchFields =
  | "communityRating"
  | "description"
  | "number"
  | "release_date"
  | "release_year";

type SearchDocument = DocumentFrom<typeof searchSchema>;

type SearchDocumentInput = Omit<SearchDocument, OptionalSearchFields> &
  Partial<
    Pick<SearchDocument, Extract<keyof SearchDocument, OptionalSearchFields>>
  >;

export async function createSearchEngine<T extends SearchableFolge>(
  folgen: T[],
): Promise<SearchEngine<T>> {
  console.debug("Creating search engine with folgen:", folgen.length);
  const db = create({
    language: "german",
    schema: searchSchema,
    sort: {
      // By default, Orama allows the sort on all properties defined in the schema.
      // This would create an in-memory sort index for each property.
      unsortableProperties: [
        "authors",
        "collection",
        "id",
        "number",
        "release_year", // We already have release_date
        "roles",
        "script_authors",
        "speakers",
        "title",
      ],
    },
  });

  await insertMultiple(db, folgen.map(toSearchDocument));

  return {
    search: async ({ filters, limit, sort, term }: SearchCriteria) => {
      console.debug("Search criteria:", { filters, sort, term });
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
            ...(filters.script_authors &&
              filters.script_authors.length > 0 && {
                script_authors: { containsAny: filters.script_authors },
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
              release_year: {
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
        properties: ["title", "number", "release_date"],
        ...params,
      });

      console.debug("Search results:", results);
      console.debug(results.elapsed);

      const folgenById = new Map(
        folgen.map((folge) => [folge.id.toString(), folge]),
      );

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

function toSearchDocument(folge: SearchableFolge): SearchDocumentInput {
  return {
    ...(folge.communityRating !== null && {
      communityRating: folge.communityRating.score,
    }),
    collection: folge.collection,
    id: folge.id.toString(),
    script_authors: folge.script_authors,
    ...(folge.number !== null && { number: folge.number.toString() }),
    ...(folge.release_date !== null && { release_date: folge.release_date }),
    authors: folge.authors,
    roles: folge.voice_roles.map(({ role }) => role),
    speakers: folge.voice_roles.map(({ speaker }) => speaker),
    title: folge.title,
    ...(folge.release_date !== null && {
      release_year: Number(folge.release_date.slice(0, 4)),
    }),
  };
}
