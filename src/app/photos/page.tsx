const photos = [
  {
    title: "City Night Walk",
    location: "Brisbane",
    description: "A quiet city street captured during an evening walk.",
  },
  {
    title: "Travel Memory",
    location: "Japan",
    description: "A simple travel moment that I want to keep.",
  },
  {
    title: "Coffee and Window Light",
    location: "Daily Life",
    description: "A small scene from an ordinary afternoon.",
  },
  {
    title: "Sea Breeze",
    location: "Sunshine Coast",
    description: "A calm coastal view with soft light and open space.",
  },
  {
    title: "Campus Corner",
    location: "University",
    description: "A familiar place from everyday student life.",
  },
  {
    title: "Evening Sky",
    location: "Home",
    description: "The changing color of the sky before night.",
  },
];

export default function PhotosPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
          Photo Wall
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight">
          My Photography
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-8 text-slate-300">
          A visual archive of travel, daily life, city walks, and personal
          memories. Later, this page will display real image files with titles,
          locations, and descriptions stored in the database.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <article
              key={photo.title}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
            >
              <div className="flex h-48 items-center justify-center bg-slate-800 text-slate-500">
                Image Placeholder
              </div>

              <div className="p-6">
                <p className="mb-2 text-sm text-slate-500">
                  {photo.location}
                </p>

                <h2 className="text-2xl font-semibold">{photo.title}</h2>

                <p className="mt-3 text-slate-400">{photo.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}