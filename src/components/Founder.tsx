import { LoopVideo } from "./LoopVideo";
import { Wave } from "./Wave";

/* The maker's note: first person, about how every film is made. No family story on the site (Pavle's wish). */
export function Founder() {
  return (
    <section aria-labelledby="prica-title" className="relative bg-lilac-soft pb-24 pt-16 md:pb-32">
      <Wave fill="var(--color-lilac-soft)" />
      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Polaroid of a still from the first film. */}
        <figure className="relative mx-auto w-full max-w-[17rem] rotate-[-3deg] sm:max-w-sm bg-white p-3 pb-14 shadow-[0_18px_40px_-18px_rgba(35,26,69,0.45)]">
          <div className="relative aspect-square overflow-hidden bg-sky">
            <LoopVideo
              src="/video/founder-cake.mp4"
              poster="/video/founder-cake.jpg"
              label="Kadar iz crtanog: dječak sa dinosaurusima pred rođendanskom tortom sa svjećicom u obliku broja dva"
            />
          </div>
          <figcaption className="hand absolute inset-x-0 bottom-3 text-center text-2xl text-grape">
            rođendanska scena iz crtanog
          </figcaption>
          <span className="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 rotate-[4deg] bg-sun/80" aria-hidden="true" />
        </figure>

        <div>
          <p className="eyebrow">iza svakog crtanog</p>
          <h2 id="prica-title" className="mt-2 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Svaki crtani režiram sam, za jedno dijete
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-grape-soft">
            <p>
              Priču pišem po onome što vaše dijete voli i režiram svaku scenu. Likove i animaciju pravim uz pomoć
              najnovijih AI alata, a ja biram, popravljam i slažem svaki kadar dok crtani ne bude kako treba. Nijedan
              crtani nije šablon: dvoje djece nikad ne dobije istu priču.
            </p>
            <p>
              Prije animacije vam šaljem izgled likova, da se dogovorimo na vrijeme. Tek onda nastaje crtani, od prve
              rečenice priče do odjavne špice.
            </p>
          </div>
          <p className="hand mt-6 text-4xl text-grape">Pavle</p>
          <p className="text-sm font-bold text-grape-soft">Vaky Kids · Podgorica</p>
        </div>
      </div>
    </section>
  );
}
