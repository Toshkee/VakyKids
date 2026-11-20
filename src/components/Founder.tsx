import { LoopVideo } from "./LoopVideo";
import { Wave } from "./Wave";

/* The founder's note. First person, from the story of the first film. */
export function Founder() {
  return (
    <section aria-labelledby="prica-title" className="relative bg-lilac-soft pb-24 pt-16 md:pb-32">
      <Wave fill="var(--color-lilac-soft)" />
      <div className="mx-auto grid max-w-5xl items-center gap-14 px-4 md:grid-cols-[0.9fr_1.1fr]">
        {/* Polaroid of a still from the first film. */}
        <figure className="relative mx-auto w-full max-w-sm rotate-[-3deg] bg-white p-3 pb-14 shadow-[0_18px_40px_-18px_rgba(35,26,69,0.45)]">
          <div className="relative aspect-square overflow-hidden bg-sky">
            <LoopVideo
              src="/video/founder-cake.mp4"
              poster="/video/founder-cake.jpg"
              label="Kadar iz filma: dječak sa dinosaurusima pred rođendanskom tortom sa svjećicom u obliku broja dva"
            />
          </div>
          <figcaption className="hand absolute inset-x-0 bottom-3 text-center text-2xl text-grape">
            Vlakijev 2. rođendan, u filmu
          </figcaption>
          <span className="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 rotate-[4deg] bg-sun/80" aria-hidden="true" />
        </figure>

        <div>
          <p className="eyebrow">kako je sve počelo</p>
          <h2 id="prica-title" className="mt-2 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Prvi film sam napravio za svog sestrića
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-grape-soft">
            <p>
              Za njegov drugi rođendan. Obožava dinosauruse, pa je u filmu spasio malog triceratopsa od grupice
              mrguda, smiješnih, nikad strašnih. Priču sam napisao i ispričao svojim glasom, a film je trajao tri
              minuta i deset sekundi.
            </p>
            <p>
              Tako je nastao Vaky Kids: da svako dijete dobije svoj film, sa svojim imenom i na svom jeziku. Svaki
              film pravim sam, od prve rečenice priče do odjavne špice.
            </p>
          </div>
          <p className="hand mt-6 text-4xl text-grape">Pavle</p>
          <p className="text-sm font-bold text-grape-soft">Vaky Kids · Podgorica</p>
        </div>
      </div>
    </section>
  );
}
