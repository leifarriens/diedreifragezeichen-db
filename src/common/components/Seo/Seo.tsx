import { NextSeo, NextSeoProps } from 'next-seo';

interface SeoProps extends NextSeoProps {
  canonicalpath?: string;
}

function Seo(props: SeoProps) {
  return (
    <NextSeo
      canonical={`https://www.ddfdb.de${props.canonicalpath}`}
      twitter={{ cardType: 'summary' }}
      openGraph={{
        images: [
          {
            url: 'https://i.scdn.co/image/1f3f79447fff9572a397f49477696330714cb36b',
          },
        ],
      }}
      {...props}
      description={cutString(props.description, 185)}
    />
  );
}

function cutString(string: string | undefined, maxLength: number) {
  if (!string) return undefined;
  let trimmed = string.substring(0, maxLength);
  const lastIndex = getLastIndexOfPunctuation(trimmed);

  return (trimmed =
    trimmed.substring(0, Math.min(trimmed.length, lastIndex)) + '...');
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

export default Seo;
