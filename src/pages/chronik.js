import React, { useContext } from 'react';
import styled from 'styled-components';

import GridFolge from '../components/Grid/GridFolge';
import { FolgenContainer, GridContainer } from '../components/Grid/StyledGrid';
import Header from '../components/Header';
import { GlobalContext } from '../context/GlobalContext';
import dbConnect from '../db';
import { getAllFolgenWithRating } from '../services';
import { parseMongo, splitArrayByProp } from '../utils';

const SectionContainer = styled.div`
  margin-bottom: 1rem;

  h3 {
    font-size: 3rem;
    margin-bottom: 2rem;
  }
`;

function ChronikPage({ folgen }) {
  return (
    <>
      <Header />
      <div className="wrapper">
        <ChronikView folgen={folgen} />
      </div>
    </>
  );
}

const ChronikView = ({ folgen }) => {
  const { searchQuery } = useContext(GlobalContext);
  const folgenSplitByReleaseDate = splitArrayByProp(
    folgen,
    'release_date',
    (val) => new Date(val).getFullYear()
  );

  return (
    <SectionContainer>
      {Object.keys(folgenSplitByReleaseDate).map((key) => {
        const folgenToDisplay = folgenSplitByReleaseDate[key].filter(
          (folge) => {
            const query = searchQuery.toLowerCase();
            const name = folge.number + folge.name.toLowerCase();

            return name.includes(query);
          }
        );

        if (folgenToDisplay.length === 0) return null;

        return (
          <GridContainer key={key}>
            <h3 style={{ marginTop: '4rem' }}>{key}</h3>
            <FolgenContainer>
              {folgenToDisplay.map((entry, index) => (
                <GridFolge key={index} folge={entry} coverOnly={false} />
              ))}
            </FolgenContainer>
          </GridContainer>
        );
      })}
    </SectionContainer>
  );
};

export async function getStaticProps() {
  await dbConnect();

  const data = await getAllFolgenWithRating();

  const folgen = parseMongo(data);

  return {
    props: { folgen },
    revalidate: 1,
  };
}

export default ChronikPage;
