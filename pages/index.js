import dbConnect from '../db'
import Grid from '../components/Grid'
import { getFolgen } from '../services'
import { GlobalContext } from '../context/GlobalContext'
import { useContext } from 'react'
import { parseMongo } from '../utils'

import Loader from '../components/Loader'

function Home(props) {
  // const { folgen } = useContext(GlobalContext)

  return <Grid folgen={props.folgen} />

  if (folgen.length > 0) return <Grid folgen={folgen} />

  return <Loader/>
}

export async function getStaticProps (context) {
  await dbConnect()

  const data = await getFolgen();

  const folgen = parseMongo(data);

  return {
    props: { folgen }
  }
}

export default Home
