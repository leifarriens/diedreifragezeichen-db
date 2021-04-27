import { signIn, signOut, useSession } from 'next-auth/client';

function Profile() {
  const [session, loading] = useSession();

  if (loading) return null;

  if (!loading && !session) return signIn();

  const { name, email } = session.user;

  return (
    <div>
      <div>{name}</div>
      <div>{email}</div>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}

// export async function getServerSideProps(context) {}

export default Profile;
