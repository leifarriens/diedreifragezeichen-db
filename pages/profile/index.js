import { signIn, signOut, useSession } from 'next-auth/client'

function Profile() {
  const [session, loading] = useSession()

  if (loading) return null

  if (!loading && !session) return <p>Access Denied</p>

  const { name, email } = session.user

  return (
    <div>
      <div>{name}</div>
      <div>{email}</div>
    </div>
  )
}

// export async function getServerSideProps(context) {}

export default Profile
