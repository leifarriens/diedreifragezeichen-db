import fs from 'fs';
import matter from 'gray-matter';
import type { InferGetStaticPropsType } from 'next';
import path from 'path';

import { Seo } from '@/components/Seo';
import { Wrapper } from '@/layout';
import { markdownToHtml } from '@/utils/markdownToHtml';

const Datenschutz = ({
  title,
  html,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Seo title={title} canonicalpath="/datenschutz" />

      <Wrapper maxWidth="960px">
        <div className="prose prose-invert">
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </Wrapper>
    </>
  );
};

const directory = path.join(process.cwd(), 'src', 'content');

export const getStaticProps = async () => {
  const fullPath = path.join(directory, 'datenschutz.md');

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const file = matter(fileContents);

  const title = file.data.title as string;

  const html = await markdownToHtml(file.content);

  return {
    props: { title, html },
  };
};

export default Datenschutz;
