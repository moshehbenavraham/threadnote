import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Button from "@/components/Button";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import { articles } from "@/data/articles";
import { useSeo } from "@/hooks/useSeo";
import { toIsoDateTime } from "@/lib/dates";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const Article = () => {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  // Compute related articles (or empty array) BEFORE early-return so hook order is stable
  const relatedArticles = article
    ? articles
        .filter((a) => a.id !== article.id)
        // Prefer overlapping tags, then fall back to recency
        .sort((a, b) => {
          const aShared = a.tags.filter((t) => article.tags.includes(t)).length;
          const bShared = b.tags.filter((t) => article.tags.includes(t)).length;
          return bShared - aShared;
        })
        .slice(0, 3)
    : [];

  const publishedIso = article ? toIsoDateTime(article.date) : undefined;
  const canonical =
    typeof window !== "undefined" ? window.location.href : undefined;

  const siteOrigin =
    typeof window !== "undefined" ? window.location.origin : SITE_URL;

  useSeo(
    article
      ? {
          title: article.title,
          description: article.excerpt,
          image: article.image,
          ogType: "article",
          authorName: article.author.name,
          publishedTime: publishedIso,
          keywords: article.tags,
          canonical,
          jsonLd: {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                headline: article.title,
                description: article.excerpt,
                image: [article.image],
                datePublished: publishedIso,
                dateModified: publishedIso,
                author: {
                  "@type": "Person",
                  name: article.author.name,
                },
                publisher: {
                  "@type": "Organization",
                  name: SITE_NAME,
                  url: siteOrigin,
                },
                articleSection: article.tags[0],
                keywords: article.tags.join(", "),
                mainEntityOfPage: canonical,
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: SITE_NAME,
                    item: siteOrigin,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: article.title,
                    item: canonical,
                  },
                ],
              },
            ],
          },
        }
      : {
          title: "Article Not Found",
          description:
            "The article you're looking for couldn't be found. Browse the latest fashion editorial on Vesper.",
          index: false,
        },
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="px-5 md:px-20 py-20 text-center">
          <h1 className="heading-lg mb-6 font-sans">ARTICLE NOT FOUND</h1>
          <Link to="/">
            <Button variant="transparent" showArrow={false}>
              Return to Homepage
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Header />

      <main id="main-content">
        {/* Article Content - New Layout Structure */}
        <div className="pt-[30px] pb-[30px] sm-590:pt-[60px] sm-590:pb-[60px]">
          <div className="px-5 sm-590:px-10 max-w-[1300px] mx-auto">
            <div className="list-none p-0 m-0 -ml-[30px]">
              <div className="float-left pl-[30px] w-full min-h-[1px] relative sm-590:left-[16.66667%] sm-590:w-2/3">
                {/* Article Header */}
                <header className="mb-[30px] sm-590:mb-[50px]">
                  <h1 className="text-6xl md:text-[120px] font-extrabold uppercase text-center mb-10 max-[700px]:mb-[30px] leading-[0.72] tracking-[-2px] max-[700px]:tracking-[-1px]">
                    {article.title}
                  </h1>

                  {/* Tag chips */}
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="uppercase font-bold text-[10px] sm-590:text-xs tracking-[1.8px] py-1 px-3 rounded-full border border-foreground/40 text-foreground/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-4 mb-[5px] sm-590:mb-2.5 text-center">
                    <time
                      dateTime={publishedIso}
                      className="text-[11px] sm-590:text-[13px] font-light tracking-[0.025em] leading-[1.6]"
                    >
                      {article.date}
                    </time>
                    <span className="text-[11px] sm-590:text-[13px] font-light tracking-[0.025em] leading-[1.6]">
                      {article.readTime}
                    </span>
                    <div className="flex items-center gap-2">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        loading="lazy"
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-[11px] sm-590:text-[13px] font-light tracking-[0.025em] leading-[1.6]">
                        {article.author.name}
                      </span>
                    </div>
                  </div>
                </header>

                {/* Featured Image */}
                <div className="block mb-10">
                  <div className="bg-card overflow-hidden rounded-3xl">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="block w-full mx-auto opacity-100 transition-opacity duration-500 ease-in-out border-none outline-none object-cover aspect-[3/4]"
                    />
                  </div>
                </div>

                {/* Article Content */}
                {article.content ? (
                  <div
                    className="prose prose-lg max-w-none font-serif
                               prose-headings:font-sans prose-headings:font-bold
                               prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-6
                               prose-p:text-lg md:prose-p:text-xl prose-p:leading-[1.75] prose-p:mb-6
                               prose-img:rounded-2xl prose-img:my-8"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                ) : (
                  <div className="space-y-6 font-serif">
                    <p className="text-lg md:text-xl leading-[1.75]">
                      {article.excerpt}
                    </p>
                    <p className="text-lg md:text-xl leading-[1.75]">
                      This article explores the themes of mindful living,
                      personal growth, and intentional practices that enrich our
                      daily experiences.
                    </p>
                  </div>
                )}

                {/* Share row */}
                <ShareButtons
                  title={article.title}
                  className="mt-10 sm-590:mt-[60px] justify-center flex-wrap"
                />

                {/* Horizontal Rule */}
                <hr className="my-10 sm-590:my-[60px] mx-auto h-px border-0 border-t border-foreground w-full" />
              </div>
            </div>

            {/* Back to Blog Link */}
            <div className="text-center clear-both">
              <Link
                to="/"
                className="text-lg sm-590:text-xl text-center no-underline font-sans font-bold uppercase tracking-[0.0em] leading-[1.2] inline-block hover:opacity-70 transition-opacity"
              >
                ← BACK TO BLOG
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <section className="border-t border-foreground/10">
          <div className="px-5 md:px-20 pt-12 md:pt-16 pb-8 md:pb-12">
            <h2 className="heading-md mb-8 text-center font-sans">
              YOU MIGHT ALSO LIKE
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-5 gap-x-5 gap-y-8 md:pt-0 md:px-20 md:pb-8 md:gap-x-16 md:gap-y-8">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.id} {...relatedArticle} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Article;
