import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useSeo } from "@/hooks/useSeo";
import { SITE_EMAIL, SITE_NAME } from "@/lib/site";

const About = () => {
  useSeo({
    title: `About ${SITE_NAME} — A Fashion Editorial for Considered Style`,
    description: `${SITE_NAME} is a small editorial publishing slow-fashion essays on capsule wardrobes, sustainability, color, tailoring, materials, and the designers shaping the next decade.`,
    ogType: "website",
    keywords: [
      "vesper editorial",
      "slow fashion",
      "sustainable fashion",
      "fashion magazine",
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: `About ${SITE_NAME}`,
      description: `About the ${SITE_NAME} editorial — slow fashion essays on capsule wardrobes, sustainability, tailoring, materials, and emerging designers.`,
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        email: SITE_EMAIL,
      },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-content">
        <section className="px-5 md:px-20 pt-12 md:pt-20 pb-8 md:pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-[120px] font-extrabold uppercase text-center mb-10 max-[700px]:mb-[30px] leading-[0.72] tracking-[-2px] max-[700px]:tracking-[-1px]">
              ABOUT
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-foreground/80 max-w-3xl mx-auto mb-8 font-serif">
              Vesper is a small, independent editorial about clothing worn
              deliberately. We write about timeless silhouettes, the materials
              they're made from, the people who make them, and the rituals that
              keep them in our lives for decades, not seasons.
            </p>
          </div>
        </section>

        <section className="px-5 md:px-20 pb-12 md:pb-20">
          <div className="max-w-3xl mx-auto space-y-10 font-serif text-lg md:text-xl leading-[1.75]">
            <div>
              <h2 className="font-sans font-bold uppercase text-2xl md:text-3xl tracking-tight mb-4">
                Our editorial principles
              </h2>
              <p>
                We publish slowly because we read carefully. Every essay is
                researched, fact-checked, and edited for clarity before it goes
                out. We don't run sponsored content, and we disclose affiliate
                relationships when they exist.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-bold uppercase text-2xl md:text-3xl tracking-tight mb-4">
                What we cover
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Capsule wardrobes and slow buying</li>
                <li>Sustainable production and material innovation</li>
                <li>Color, styling, and silhouette fundamentals</li>
                <li>Tailoring, fit, and garment care</li>
                <li>Textile quality and how to read a label</li>
                <li>Emerging independent designers and the houses behind them</li>
              </ul>
            </div>

            <div>
              <h2 className="font-sans font-bold uppercase text-2xl md:text-3xl tracking-tight mb-4">
                Get in touch
              </h2>
              <p>
                Pitches, corrections, and conversation are always welcome.
                Email{" "}
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="underline decoration-2 hover:opacity-70 transition-opacity"
                >
                  {SITE_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 md:px-20 pb-16 md:pb-24 text-center">
          <Link to="/" aria-label="Browse the latest essays">
            <Button variant="filled" className="text-sm py-3 px-6">
              READ THE LATEST
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
