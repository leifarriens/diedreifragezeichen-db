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

export interface SearchEngine<T extends SearchableFolge> {
  searchDb(options: SearchOptions): Promise<{
    count: number;
    results: T[];
  }>;
}

export interface SearchOptions {
  filters: {
    authors: SearchDocument["authors"];
    collections: string[];
    roles: SearchDocument["roles"];
    script_authors: SearchDocument["script_authors"];
    speakers: SearchDocument["speakers"];
    yearRange?: {
      max: number;
      min: number;
    };
  };
  sort: SortOption;
  term: string;
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
  authors: "string[]",
  collection: "string",
  communityRating: "number",
  id: "string",
  number: "string",
  release_date: "string",
  release_year: "number",
  roles: "string[]",
  script_authors: "string[]",
  speakers: "string[]",
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
  const db = create({
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
    searchDb: async ({ filters, sort, term }: SearchOptions) => {
      const results = await search(db, {
        boost: {
          title: 1,
        },
        limit: folgen.length, // set the limit to the total number of folgen
        properties: ["title", "number", "release_date"],
        sortBy: {
          order: sort.order,
          property: sort.by,
        },
        term,
        where: {
          ...(filters.authors.length > 0 && { authors: filters.authors }),
          ...(filters.roles.length > 0 && { roles: filters.roles }),
          ...(filters.script_authors.length > 0 && {
            script_authors: filters.script_authors,
          }),
          ...(filters.speakers.length > 0 && { speakers: filters.speakers }),
          ...(filters.collections.length > 0 && {
            collection: filters.collections,
          }),
          ...(filters.yearRange && {
            release_year: {
              between: [filters.yearRange.min, filters.yearRange.max],
            },
          }),
        },
      });

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
    ...(folge.communityRating !== null
      ? { communityRating: folge.communityRating.score }
      : {}),
    collection: folge.collection,
    id: folge.id.toString(),
    script_authors: folge.script_authors,
    ...(folge.number !== null ? { number: folge.number.toString() } : {}),
    ...(folge.release_date !== null
      ? { release_date: folge.release_date }
      : {}),
    authors: folge.authors,
    ...(folge.communityRating !== null
      ? { communityRating: folge.communityRating.score }
      : {}),
    roles: folge.voice_roles.map(({ role }) => role),
    speakers: folge.voice_roles.map(({ speaker }) => speaker),
    title: folge.title,
    ...(folge.release_date !== null
      ? { release_year: Number(folge.release_date.slice(0, 4)) }
      : {}),
  };
}
