import NewsletterForm from "./NewsletterForm";
import { SITE_EMAIL, SITE_NAME, getActiveSocialLinks } from "@/lib/site";

const Footer = () => {
  const helpLinks = [
    { label: "CONTACT", href: `mailto:${SITE_EMAIL}` },
  ];

  // Templates ship with brand-homepage placeholder URLs (instagram.com,
  // twitter.com, pinterest.com) that point at the platform's marketing
  // page rather than a Vesper profile — they're worse than nothing. We
  // only render social links when a real URL is configured in site.ts.
  const socialLinks = getActiveSocialLinks();
  const hasSocialLinks = socialLinks.length > 0;

  return (
    <footer className="bg-accent-red text-foreground">
      <div className="px-5 md:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-x-12 lg:gap-x-16 items-start">
          {/* Logo Section */}
          <div className="md:col-span-1">
            <div className="font-serif text-3xl md:text-4xl font-bold italic">
              {SITE_NAME.toUpperCase()}
            </div>
          </div>

          {/* Connect */}
          <div className="md:col-span-1">
            <h3 className="footer-header">CONNECT</h3>
            <nav className="flex flex-col gap-2" aria-label="Contact">
              {helpLinks.map((link) => (
                <a key={link.label} href={link.href} className="footer-link">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social (only rendered when at least one real profile exists) */}
          {hasSocialLinks ? (
            <div className="md:col-span-1">
              <h3 className="footer-header">FOLLOW</h3>
              <nav className="flex flex-col gap-2" aria-label="Social media">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="footer-link"
                  >
                    {link.label.toUpperCase()}
                  </a>
                ))}
              </nav>
            </div>
          ) : (
            // Preserve the four-column grid rhythm without rendering empty
            // labels: an invisible spacer keeps the newsletter column aligned
            // with the other footers in the rotation.
            <div className="hidden md:block md:col-span-1" aria-hidden="true" />
          )}

          {/* Newsletter */}
          <div id="newsletter" className="md:col-span-1">
            <NewsletterForm inputClassName="min-w-72" />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-foreground/20">
          <p className="text-sm text-center md:text-left uppercase">
            © {new Date().getFullYear()} {SITE_NAME.toUpperCase()}. ALL RIGHTS
            RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
