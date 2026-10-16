import type { Folge } from "@ddfdb/archiv/contracts";
import type { Metadata } from "next";

import { Separator } from "@base-ui/react/separator";
import {
  type FolgeWithCommunityRating,
  formatRelativeTime,
  formatReleaseDate,
  isReleasDateInThePast,
} from "@ddfdb/core";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ExternalLink } from "@/components/ui/external-link/external-link";
import { Wrapper } from "@/components/ui/wrapper";
import { FolgenBookmarkButtonForFolge } from "@/features/bookmarks/folgen-bookmark-button";
import { FolgenCover } from "@/features/folgen/folgen-images/folgen-cover";
import { FolgenStreamingLinks } from "@/features/folgen/folgen-streaming-links/folge-streaming-links";
import { FolgenListenedButtonForFolge } from "@/features/listened/folgen-listened-button";
import { FolgenRatingDisplay } from "@/features/ratings/components/folgen-rating-display";
import { FolgenUserRating } from "@/features/ratings/components/folgen-user-rating";
import { archivApi, ArchivApiError } from "@/server/archiv-api";
import { getFolgeWithCommunityRatingById } from "@/server/queries/folgen";
import { PageBackground } from "@/shell/page-background";

const getCachedPageData = cache(getFolgeWithCommunityRatingById);

export default async function FolgePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const folgeId = parseInt(id, 10);

  let folge: FolgeWithCommunityRating;
  try {
    folge = await getCachedPageData(folgeId);
  } catch (error) {
    if (error instanceof ArchivApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return <Folge folge={folge} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const folge = await getCachedPageData(parseInt(id, 10));

  const title = folge.number
    ? `Folge ${folge.number.toString()} ${folge.title}`
    : folge.title;

  return {
    description: folge.description
      ? cutToMaxLength(folge.description, 160)
      : null,
    title,
  };
}

export async function generateStaticParams() {
  const folgen = await archivApi.getFolgen();

  return folgen.map(({ id }) => ({ id: String(id) }));
}

function cutToMaxLength(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex === -1) {
    return truncated;
  }
  return `${truncated.slice(0, lastSpaceIndex)}...`;
}

// "use cache" requires an async function
// eslint-disable-next-line @typescript-eslint/require-await
async function Folge({ folge }: { folge: FolgeWithCommunityRating }) {
  "use cache";

  cacheLife({
    expire: 31536000,
    revalidate: 3600,
    stale: 300,
  });

  const {
    artwork,
    authors,
    communityRating,
    cover,
    description,
    release_date,
    script_authors,
    streaming,
    title,
    voice_roles,
    weblink,
  } = folge;

  const isReleased = isReleasDateInThePast(release_date);

  return (
    <>
      <main>
        <Wrapper className="max-w-7xl">
          <div className="mb-24 px-0 py-8 sm:px-8 md:grid md:grid-cols-2 md:gap-10 lg:gap-x-16">
            {cover ? (
              <FolgenCover
                className="mb-4 w-full rounded-xl object-cover shadow-2xl"
                coverUrl={cover}
                folgenTitle={title}
                loading="eager"
              />
            ) : (
              <div />
            )}

            <div>
              <h1>
                <span className="mb-2 block font-serif text-2xl font-thin lg:text-3xl xl:mt-8">
                  Die drei ???&nbsp;
                </span>

                <span className="block font-serif text-4xl font-semibold lg:text-5xl">
                  {title}
                </span>
              </h1>

              {folge.number ? (
                <h2 className="mt-2 text-lg">
                  Folge {folge.number.toString()}
                </h2>
              ) : null}

              <div className="mt-4 text-neutral-300">
                {release_date && (
                  <>
                    <div>
                      {isReleased
                        ? "Veröffentlicht am"
                        : "Wird veröffentlicht am"}{" "}
                      {formatReleaseDate(release_date)}
                    </div>
                    <div>{formatRelativeTime(release_date)}</div>
                  </>
                )}
              </div>

              <div className="mt-6 flex gap-4">
                <div className="flex flex-col items-center">
                  <p className="mb-1 text-xs font-semibold">DDFDB Wertung</p>
                  <FolgenRatingDisplay
                    folgenTitle={title}
                    size="lg"
                    type="community"
                    value={communityRating?.score ?? null}
                  />
                </div>

                <div className="flex flex-col items-center">
                  <p className="mb-1 text-xs font-semibold">Deine Wertung</p>
                  <FolgenUserRating folgeId={folge.id} folgenTitle={title} />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 text-nowrap">
                <FolgenStreamingLinks streaming={streaming} />

                <Separator
                  className="stretch h-7 w-px bg-neutral-300/50"
                  orientation="vertical"
                />

                {weblink && (
                  <ExternalLink
                    ariaLabel="Öffnet die Folge auf dreifragezeichen.de in einem neuen Tab"
                    href={weblink}
                    title="dreifragezeichen.de"
                  >
                    <svg
                      className="size-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </ExternalLink>
                )}
              </div>
              <div className="mt-6 flex items-center gap-4">
                <FolgenBookmarkButtonForFolge
                  folgeId={folge.id}
                  folgeTitle={folge.title}
                />

                <FolgenListenedButtonForFolge
                  folgeId={folge.id}
                  folgeTitle={folge.title}
                />
              </div>
            </div>
          </div>

          {description && (
            <div className="mb-16 rounded-lg bg-black/30 p-8 text-lg text-neutral-200">
              <h3 className="mb-4 text-2xl font-medium">Zusammenfassung</h3>
              <p className="text-justify">{description}</p>
            </div>
          )}

          {voice_roles.length > 0 && (
            <div className="mb-16 rounded-lg bg-black/30 p-8 text-lg text-neutral-200">
              <h3 className="mb-4 text-2xl font-medium">Sprechrollen</h3>
              <ul>
                {voice_roles.map(({ role, speaker }) => (
                  <li key={`${role}-${speaker}`}>
                    {role}: {speaker}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(authors.length > 0 || script_authors.length > 0) && (
            <div className="mb-16 rounded-lg bg-black/30 p-8 text-lg text-neutral-200">
              <h3 className="mb-4 text-2xl font-medium">Autoren</h3>
              {authors.length > 0 && (
                <p className="text-justify">Autoren: {authors.join(", ")}</p>
              )}
              {script_authors.length > 0 && (
                <p className="text-justify">
                  Drehbuchautoren: {script_authors.join(", ")}
                </p>
              )}
            </div>
          )}
        </Wrapper>
      </main>

      {artwork && <PageBackground artwork={artwork} />}
    </>
  );
}
