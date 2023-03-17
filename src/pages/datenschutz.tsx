import fs from 'fs';
import matter from 'gray-matter';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import path from 'path';

import { Seo } from '@/components/Seo/Seo';
import Wrapper from '@/layout/Wrapper';
import markdownToHtml from '@/utils/markdownToHtml';

function Datenschutz({
  title,
  html,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
}

const directory = path.join(process.cwd(), 'src', 'content');

export const getStaticProps: GetStaticProps = async () => {
  const fullPath = path.join(directory, 'datenschutz.md');

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  const html = await markdownToHtml(content || '');

  return {
    props: {
      title: data.title,
      html,
    },
  };
};

export default Datenschutz;
