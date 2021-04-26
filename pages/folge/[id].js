import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import FolgeComponent from '../../components/Folge/'
import { parseMongo } from '../../utils'

import { getFolgeById } from '../../services/'

import { GlobalContext } from '../../context/GlobalContext'
import { GridContainer, FolgenContainer } from '../../components/Grid/StyledGrid'
import GridFolge from '../../components/Grid/GridFolge'

function Folge(props) {
  const { folgen } = useContext(GlobalContext)

  const rel = getRelatedFolgen(props.folge, folgen);

  return (
    <GridContainer>
      <FolgeComponent folge={props.folge} />
      
      <FolgenContainer>
        {rel.map((folge) => (
          <GridFolge key={folge._id} folge={folge} />
        ))}
      </FolgenContainer>
    </GridContainer>
  )
}

export async function getServerSideProps(context) {

  const id = context.params.id
  const data = await getFolgeById(id)

  const folge = parseMongo(data)

  return {
    props: {
      folge,
    },
  }
}

// helpers

const getRelatedFolgen = (folge, folgen) => {
  const index = folgen.findIndex((f) => f._id === folge._id)

  return folgen.slice(index - 10, index + 10)
}

export default Folge
