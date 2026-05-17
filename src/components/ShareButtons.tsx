import { useState } from "react";
import { Link2, Check, Twitter } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  title: string;
  url?: string;
  className?: string;
}

/**
 * A compact row of share affordances: native share (when available),
 * Twitter / X, Pinterest, and a copy-link fallback. All targets open
 * in a new tab and explicitly mark `rel="noopener noreferrer"`.
 */
const ShareButtons = ({ title, url, className }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url ?? (typeof window !== "undefined" ? window.location.href : "");

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const pinterestHref = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;

  const handleNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) return false;
    try {
      await navigator.share({ title, url: shareUrl });
      return true;
    } catch {
      // user cancelled or share failed; fall through to other options
      return false;
    }
  };

  const handleCopy = async () => {
    const tryNative = await handleNativeShare();
    if (tryNative) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy link. Try long-pressing the URL instead.");
    }
  };

  const buttonClasses =
    "inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-200";

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      aria-label="Share this article"
    >
      <span className="text-[11px] sm-590:text-[13px] font-sans uppercase tracking-[0.1em] font-bold">
        Share
      </span>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className={buttonClasses}
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={pinterestHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Pinterest"
        className={buttonClasses}
      >
        {/* Lucide doesn't include Pinterest; render a compact "P" glyph. */}
        <span aria-hidden="true" className="font-sans font-extrabold text-sm">
          P
        </span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Link copied" : "Copy link to article"}
        className={buttonClasses}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ShareButtons;
