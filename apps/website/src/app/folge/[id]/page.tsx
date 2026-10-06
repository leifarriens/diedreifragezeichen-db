import type { Folge } from "@ddfdb/archiv/contracts";
import type { CommunityRating } from "@ddfdb/user-api";

import {
  formatRelativeTime,
  formatReleaseDate,
  isReleasDateInThePast,
} from "@ddfdb/core";

import { ExternalLink } from "@/components/external-link/external-link";
import { FolgenRatingInput } from "@/components/folgen-rating-input/folgen-rating-input";
import { FolgenStreamingLinks } from "@/components/folgen-streaming-links/folge-streaming-links";
import { PageBackground } from "@/components/layout/page-background";
import { Wrapper } from "@/components/layout/wrapper";
import { archivApi } from "@/lib/archiv-api";
import { caller } from "@/trpc/server";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export default async function FolgePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const folgeId = parseInt(id, 10);

  const [folge, communityRating] = await Promise.all([
    archivApi.getFolgeById(folgeId),
    caller.ratings.getCommunityForFolge({
      folgeId,
    }),
  ]);

  return <Folge communityRating={communityRating} folge={folge} />;
}

export async function generateStaticParams() {
  const folgen = await archivApi.getFolgen();
  return folgen.map(({ id }) => ({ id: String(id) }));
}

function Folge({
  communityRating,
  folge,
}: {
  communityRating: CommunityRating | null;
  folge: Folge;
}) {
  const { artwork, cover, description, links, release_date, title, weblink } =
    folge;

  const isReleased = isReleasDateInThePast(release_date);

  return (
    <>
      <main>
        <Wrapper className="max-w-7xl">
          <div className="mb-24 p-8 md:grid md:grid-cols-2 md:gap-10 lg:gap-x-16">
            {cover ? (
              <img
                alt={`${title} Cover`}
                className="mb-4 w-full rounded-sm object-cover shadow-2xl"
                height={512}
                src={cover}
                width={512}
              />
            ) : (
              <div />
            )}

            <div>
              <h2 className="mb-2 font-serif text-2xl font-thin lg:text-3xl">
                Die drei ???
              </h2>

              <h1 className="font-serif text-4xl font-semibold lg:text-5xl">
                {title}
              </h1>

              <div className="mt-2 text-lg text-neutral-300">
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

              {communityRating && (
                <div className="mt-4 text-lg text-neutral-300">
                  Community Rating: {String(communityRating.score / 2)} (
                  {communityRating.numberOfRatings.toString()} rating(s))
                </div>
              )}

              <FolgenRatingInput folgeId={folge.id} />

              <div className="mt-6 flex items-center gap-4">
                <FolgenStreamingLinks links={links} />

                {weblink && (
                  <ExternalLink
                    aria-label="Öffnet die Folge auf dreifragezeichen.de in einem neuen Tab (externer Link)"
                    href={weblink}
                    title="dreifragezeichen.de"
                  >
                    <svg
                      className="size-6"
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
            </div>
          </div>

          {description && (
            <div className="mb-16 rounded-lg bg-black/30 p-8 text-lg text-neutral-200">
              <h3 className="mb-4 text-2xl font-medium">Zusammenfassung</h3>
              <p className="text-justify">{description}</p>
            </div>
          )}
        </Wrapper>
      </main>

      {artwork && <PageBackground artwork={artwork} />}
    </>
  );
}
