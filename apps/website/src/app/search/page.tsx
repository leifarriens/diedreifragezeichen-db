import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { getAllFolgenSearchOptions } from "@/server/queries/search";

import { SearchBrowser } from "../../features/search/components/search-browser";

export default async function SearchPage() {
  const folgen = await getAllFolgenWithCommunityRatings();
  const searchOptions = await getAllFolgenSearchOptions();

  return <SearchBrowser availableOptions={searchOptions} folgen={folgen} />;
}
