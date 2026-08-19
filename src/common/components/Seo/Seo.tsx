import type { NextSeoProps } from 'next-seo/pages';
import { generateNextSeo } from 'next-seo/pages';

interface SeoProps extends NextSeoProps {
  canonicalpath?: string;
}

export function Seo({ canonicalpath = '', description, ...rest }: SeoProps) {
  return (
    <>
      {generateNextSeo({
        canonical: `https://www.ddfdb.de${canonicalpath}`,
        twitter: { cardType: 'summary' },
        openGraph: {
          images: [
            {
              url: 'https://i.scdn.co/image/1f3f79447fff9572a397f49477696330714cb36b',
            },
          ],
        },
        ...rest,
        description: cutString(description, 185),
      })}
    </>
  );
}

function cutString(string: string | undefined, maxLength: number) {
  if (!string) return undefined;
  const trimmed = string.substring(0, maxLength);
  const lastIndex = getLastIndexOfPunctuation(trimmed);

  return trimmed.substring(0, Math.min(trimmed.length, lastIndex)) + '...';
}

function getLastIndexOfPunctuation(string: string) {
  if (string.lastIndexOf('.') !== -1) {
    return string.lastIndexOf('.');
  }

  if (string.lastIndexOf('?') !== -1) {
    return string.lastIndexOf('?');
  }

  if (string.lastIndexOf('!') !== -1) {
    return string.lastIndexOf('!');
  }

  return -1;
}
