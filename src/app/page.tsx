import Link from 'next/link';

export default function Home() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            Create Unforgettable Digital Invitations
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-800 md:text-xl dark:text-gray-300">
            Design and share beautiful, animated invitations for any occasion. Choose a template, customize it, and send it to your guests.
          </p>
          <Link
            href="/templates"
            className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-10 text-lg font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-950"
          >
            Browse Templates
          </Link>
        </div>
      </div>
    </section>
  );
}
