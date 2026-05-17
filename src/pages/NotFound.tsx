import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useSeo } from "@/hooks/useSeo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  useSeo({
    title: "Page Not Found",
    description:
      "The page you're looking for couldn't be found. Browse the latest fashion editorial on Vesper.",
    index: false,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center px-5 md:px-20 py-20"
      >
        <div className="max-w-2xl mx-auto text-center">
          <p className="uppercase font-bold text-xs tracking-[1.8px] mb-6 text-foreground/60 font-sans">
            Error 404
          </p>
          <h1 className="text-6xl md:text-[120px] font-extrabold uppercase mb-8 leading-[0.72] tracking-[-2px] max-[700px]:tracking-[-1px] font-sans">
            LOST IN THE WARDROBE
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-foreground/80 max-w-xl mx-auto mb-10 font-serif">
            The page you were looking for has gone out of style — or maybe it
            was never in the closet to begin with. Let's get you back to the
            latest stories.
          </p>
          <Link to="/">
            <Button variant="filled">RETURN HOME</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
