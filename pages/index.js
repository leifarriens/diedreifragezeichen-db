import Grid from '../components/Grid'
import { signIn, signOut, useSession } from 'next-auth/client'

import { GlobalContext } from '../context/GlobalContext'
import { useContext } from 'react'

function Home() {
  const { folgen } = useContext(GlobalContext)

  return <Grid folgen={folgen} />
}

export default Home
