import fs from 'fs';
import matter from 'gray-matter';
import { InferGetStaticPropsType } from 'next';
import path from 'path';
import styled from 'styled-components';

import Seo from '@/components/Seo/Seo';
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
        <h1>{title}</h1>
        <Content dangerouslySetInnerHTML={{ __html: html }} />
      </Wrapper>
    </>
  );
}

const Content = styled.div`
  h1,
  h2,
  h3,
  h4,
  h5 {
    margin-top: 1em;
  }

  p {
    padding: 18px 0;
    line-height: 1.5;
  }

  ul {
    padding-left: 1em;

    li + li {
      margin-top: 1em;
    }
  }
`;

const directory = path.join(process.cwd(), 'src', 'content');

export const getStaticProps = async () => {
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
