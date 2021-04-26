import Grid from '../components/Grid'
import { signIn, signOut, useSession } from 'next-auth/client'

import { GlobalContext } from '../context/GlobalContext'
import { useContext } from 'react'

function Home(props) {
  const [session, loading] = useSession()

  const { folgen } = useContext(GlobalContext)

  return (
    <div>
      <Grid folgen={folgen} />
    </div>
  )
}

// Home.getInitialProps = async () => {
//   const res = await fetch('http://localhost:3000/api/folgen');
//   const folgen = await res.json();
//   return { folgen };
// }

// export async function getStaticProps(context) {
//   const res = await fetch('http://localhost:3000/api/folgen');
//   const folgen = await res.json()
//   console.log(folgen.length);
//   if (!folgen) {
//     return {
//       notFound: true,
//     }
//   }

//   return {
//     props: { folgen }, // will be passed to the page component as props
//   }
// }

export default Home
