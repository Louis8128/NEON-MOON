import PageHeader from "@/components/PageHeader";

const mediaItems = [
  {
    title: "Interstellar",
    category: "Movie",
    rating: "9.5/10",
    note: "A science fiction film about time, love, space, and survival.",
  },
  {
    title: "The Legend of Zelda: Breath of the Wild",
    category: "Game",
    rating: "10/10",
    note: "An open-world game that rewards curiosity and exploration.",
  },
  {
    title: "Norwegian Wood",
    category: "Book",
    rating: "8.5/10",
    note: "A quiet and emotional novel about memory, youth, and loss.",
  },
  {
    title: "Attack on Titan",
    category: "Anime",
    rating: "9/10",
    note: "A dark anime series about freedom, conflict, and human nature.",
  },
  {
    title: "Random Access Memories",
    category: "Music",
    rating: "9/10",
    note: "An album with a polished electronic, funk, and disco sound.",
  },
];

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <PageHeader
          eyebrow="Media Library"
          title="My Media Collection"
          description="A personal collection of music, books, movies, anime, and games that I like. Later, this page will be connected to a MySQL database and support category filtering."
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {mediaItems.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="mb-3 inline-flex rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                {item.category}
              </p>

              <h2 className="text-2xl font-semibold">{item.title}</h2>

              <p className="mt-3 text-sm font-medium text-slate-400">
                Rating: {item.rating}
              </p>

              <p className="mt-4 text-slate-400">{item.note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
