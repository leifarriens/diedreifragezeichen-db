export default function ProfilePage() {
  return (
    <section className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Your profile</h1>
          <p className="text-zinc-600">
            You are signed in and can now access your personal account.
          </p>
        </div>
      </div>

      <div>
        <section>
          <h2>Bewertet</h2>
        </section>
        <section>
          <h2>Gehört</h2>
        </section>
        <section>
          <h2>Gespeichert</h2>
        </section>
      </div>
    </section>
  );
}
