import Grid from '../components/Grid'
import { signIn, signOut, useSession } from 'next-auth/client'

import { GlobalContext } from '../context/GlobalContext'
import { useContext } from 'react'

import { getFolgen }  from '../services'

function Home() {
  const { folgen } = useContext(GlobalContext)

  return <Grid folgen={folgen} />
}

// export async function getStaticProps(context) {
//   // const res = await fetch(`http://localhost:3000/api/folgen`)
//   // const folgen = await res.json()
  
//   const folgen = await getFolgen();
//   // const folgen = JSON.parse(JSON.stringify(data))

//   if (!folgen) {
//     return {
//       notFound: true,
//     }
//   }

//   return {
//     props: {
//       folgen
//     }, // will be passed to the page component as props
//   }
// }


export default Home
