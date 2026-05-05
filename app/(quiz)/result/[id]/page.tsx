interface ResultPageProps {
  params: { id: string };
}

export default function ResultPage({ params }: ResultPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-4xl text-brand-midnight">Result Screen Placeholder</h1>
      <p className="mt-4 text-brand-muted">Result ID: {params.id}</p>
    </main>
  );
}
