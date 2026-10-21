export const l = {
  ACCOUNT: {
    DELETE_CONFIRM_TITLE: "Willst du dein Konto wirklich löschen?",
  },
  ACTIONS: {
    ADD_BOOKMARK: "Als Lesezeichen merken",
    MARK_LISTENED: "Als gehört markieren",
    MARK_UNLISTENED: "Als ungehört markieren",
    REMOVE_BOOKMARK: "Lesezeichen entfernen",
  },
  ARCHIVE: {
    SEARCH_LABEL: "Folgen Archiv durchsuchen",
    SEARCH_PLACEHOLDER: "Name, Nummer oder Erscheinungsjahr",
    SORTING: {
      HIGHEST_RATED_FIRST: "Beste",
      LABEL: "Sortierung des Archivs",
      NEWEST_FIRST: "Neueste",
      OLDEST_FIRST: "Älteste",
      SHOW_SPECIALS: "Specials anzeigen",
      YEAR_MAX_LABEL: "Spätestes Erscheinungsjahr",
      YEAR_MIN_LABEL: "Frühestes Erscheinungsjahr",
    },
  },
  BOOKMARKS: {
    EMPTY_PLACEHOLDER: "Du hast noch keine Folgen gespeichert",
    NAME: "Gespeichert",
    SEARCH_PLACEHOLDER: "Suche in deinen gespeicherten Folgen",
    SORTING: {
      LABEL: "Sortierung der bewerteten Folgen",
      NEWEST_FIRST: "Neueste zuerst",
      OLDEST_FIRST: "Älteste zuerst",
    },
    TITLE: "Gespeicherte Folgen",
    UNAUTHENTICATED_MESSAGE: "Melde dich an, um Folgen zu speichern.",
  } satisfies CollectionLabels,
  LISTENED: {
    EMPTY_PLACEHOLDER: "Du hast noch keine Folgen als gehört markiert",
    NAME: "Gehört",
    SEARCH_PLACEHOLDER: "Suche in deinen gehörten Folgen",
    SORTING: {
      LABEL: "Sortierung der gehörten Folgen",
      NEWEST_FIRST: "Neueste zuerst",
      OLDEST_FIRST: "Älteste zuerst",
    },
    TITLE: "Gehörte Folgen",
    UNAUTHENTICATED_MESSAGE: "Melde dich an um Folgen als gehört zu markieren.",
  } satisfies CollectionLabels,
  MISC: {
    ACCOUNT: "Konto",
    LOGOUT: "Abmelden",
    NO_FOLGEN_FOUND: "Keine Folgen gefunden",
    PROFILE: "Profil",
  },
  RATING: {
    COMMUNITY_RATING_LABEL: "DDFDB Wertung",
    RATING_LABEL: "Deine Bewertung",
  },
  RATINGS: {
    EMPTY_PLACEHOLDER: "Du hast noch keine Folgen bewertet",
    NAME: "Bewertet",
    SEARCH_PLACEHOLDER: "Suche in deinen bewerteten Folgen",
    SORTING: {
      HIGHEST_RATED_FIRST: "Deine beste Wertung",
      LABEL: "Sortierung der bewerteten Folgen",
      LOWEST_RATED_FIRST: "Deine schlechteste Wertung",
      NEWEST_FIRST: "Neueste Wertungen",
    },
    TITLE: "Bewertete Folgen",
    UNAUTHENTICATED_MESSAGE: "Melde dich an, um Folgen zu bewerten.",
  } satisfies CollectionLabels,
} as const;

export interface CollectionLabels {
  EMPTY_PLACEHOLDER: string;
  NAME: string;
  SEARCH_PLACEHOLDER: string;
  SORTING: Record<string, string> & {
    LABEL: string;
  };
  TITLE: string;
  UNAUTHENTICATED_MESSAGE: string;
}
