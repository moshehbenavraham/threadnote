import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import FeaturedCard from "@/components/FeaturedCard";
import NewsletterForm from "@/components/NewsletterForm";
import Button from "@/components/Button";
import TopicFilter from "@/components/TopicFilter";
import { articles, getActiveTopics, type Topic } from "@/data/articles";
import { useSeo } from "@/hooks/useSeo";
import {
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_NAME,
  SITE_URL,
  getSameAsUrls,
} from "@/lib/site";

const PAGE_SIZE = 6;
const PAGE_STEP = 3;

const Index = () => {
  const [activeTopic, setActiveTopic] = useState<Topic | "all">("all");
  const [visibleArticles, setVisibleArticles] = useState(PAGE_SIZE);

  const topics = useMemo(() => getActiveTopics(), []);

  const filtered = useMemo(() => {
    if (activeTopic === "all") return articles;
    return articles.filter((a) => a.tags.includes(activeTopic));
  }, [activeTopic]);

  const featured = filtered[0];
  const rest = filtered.slice(1, visibleArticles);

  const handleTopicChange = (topic: Topic | "all") => {
    setActiveTopic(topic);
    setVisibleArticles(PAGE_SIZE);
  };

  const loadMore = () => {
    setVisibleArticles((prev) => Math.min(prev + PAGE_STEP, filtered.length));
  };

  // Prefer the build-time configured origin so structured data matches the
  // canonical site identity even when the page is being prerendered. Fall
  // back to the runtime origin (covers preview deploys on a different host)
  // and finally the configured SITE_URL.
  const runtimeOrigin =
    typeof window !== "undefined" ? window.location.origin : undefined;
  const siteOrigin = runtimeOrigin ?? SITE_URL;
  const sameAs = getSameAsUrls();

  useSeo({
    title: `${SITE_NAME} — Fashion & Sustainable Style Editorial`,
    description: SITE_DESCRIPTION,
    image: "/social-card.svg",
    ogType: "website",
    keywords: [
      "fashion editorial",
      "sustainable fashion",
      "capsule wardrobe",
      "emerging designers",
      "style guide",
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${siteOrigin}/#website`,
          name: SITE_NAME,
          url: siteOrigin,
          inLanguage: "en-US",
          description:
            "Fashion editorial for timeless style, sustainable design, and mindful wardrobes.",
          publisher: { "@id": `${siteOrigin}/#organization` },
        },
        {
          "@type": "Organization",
          "@id": `${siteOrigin}/#organization`,
          name: SITE_NAME,
          url: siteOrigin,
          email: SITE_EMAIL,
          description:
            "Independent fashion editorial covering capsule wardrobes, sustainability, tailoring, materials, and emerging designers.",
          // Only emit sameAs when we have real profiles configured — empty
          // arrays look broken to validators, so omit the field entirely.
          ...(sameAs.length > 0 ? { sameAs } : {}),
        },
      ],
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-content">
        {/* Hero Section */}
        <section className="px-5 md:px-20 pt-12 md:pt-20 pb-8 md:pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-[120px] font-extrabold uppercase text-center mb-10 max-[700px]:mb-[30px] leading-[0.72] tracking-[-2px] max-[700px]:tracking-[-1px]">
              VESPER
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-foreground/80 max-w-3xl mx-auto mb-8 font-serif">
              I'm a fashion curator sharing my passion for timeless style,
              sustainable design, and the stories behind what we wear. From
              building capsule wardrobes to discovering emerging designers, this
              is where we celebrate fashion as a form of self-expression and
              mindful creativity.
            </p>

            {/* Newsletter CTA */}
            <NewsletterForm
              className="max-w-3xl mx-auto justify-center"
              inputClassName="border-b-2"
            />
          </div>
        </section>

        {/* Topic Filter */}
        <section className="px-5 md:px-20 pb-6 md:pb-10">
          <TopicFilter
            topics={topics}
            active={activeTopic}
            onChange={handleTopicChange}
          />
        </section>

        {/* Empty state */}
        {filtered.length === 0 && (
          <section className="px-5 md:px-20 py-16 text-center font-serif text-foreground/70">
            <p className="text-lg">
              No articles yet under{" "}
              <span className="font-bold">{activeTopic}</span>. Try another
              topic.
            </p>
          </section>
        )}

        {/* Featured Card */}
        {featured && (
          <section className="px-5 md:px-20 pb-8 md:pb-12">
            <FeaturedCard {...featured} />
          </section>
        )}

        {/* Articles Grid */}
        {rest.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-5 gap-x-5 gap-y-8 md:pt-16 md:px-20 md:pb-8 md:gap-x-16 md:gap-y-8">
            {rest.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </section>
        )}

        {/* Load More */}
        {visibleArticles < filtered.length && (
          <div className="text-center py-12">
            <Button onClick={loadMore} variant="transparent">
              LOAD MORE
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
