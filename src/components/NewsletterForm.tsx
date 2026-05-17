import { useId, useMemo, useState, FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

interface NewsletterFormProps {
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

const NEWSLETTER_ENDPOINT = (
  import.meta.env.VITE_NEWSLETTER_ENDPOINT as string | undefined
)?.trim();
const NEWSLETTER_FALLBACK_EMAIL = (
  (import.meta.env.VITE_NEWSLETTER_EMAIL as string | undefined) ||
  "hello@vesper.com"
).trim();

const EmailSchema = z
  .string()
  .trim()
  .min(1, "Please enter your email address.")
  .email("Please enter a valid email address.");

/**
 * Newsletter signup with a real submission path.
 *
 * - If `VITE_NEWSLETTER_ENDPOINT` is configured, POSTs `{ email }` to it.
 * - Otherwise falls back to a prefilled `mailto:` draft so visitor intent
 *   is preserved rather than dropped into a fake setTimeout success.
 *
 * Provides zod-backed validation, `aria-live` status messaging, and the
 * appropriate `autoComplete`/`inputMode` hints for mobile keyboards.
 */
const NewsletterForm = ({
  className = "",
  inputClassName = "",
  buttonClassName = "",
}: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const inputId = useId();
  const errorId = `${inputId}-error`;
  const statusId = `${inputId}-status`;

  const hasEndpoint = Boolean(NEWSLETTER_ENDPOINT);

  const submitLabel = useMemo(() => {
    if (isSubmitting) return hasEndpoint ? "SIGNING UP..." : "OPENING EMAIL...";
    return hasEndpoint ? "SIGN UP" : "SEND VIA EMAIL";
  }, [hasEndpoint, isSubmitting]);

  const submitToEndpoint = async (trimmedEmail: string) => {
    if (!NEWSLETTER_ENDPOINT) return false;
    const response = await fetch(NEWSLETTER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: trimmedEmail, source: "vesper-newsletter" }),
    });
    if (!response.ok) {
      throw new Error(`Subscription failed (HTTP ${response.status}).`);
    }
    return true;
  };

  const openMailtoFallback = (trimmedEmail: string) => {
    const subject = encodeURIComponent("Vesper newsletter subscription");
    const body = encodeURIComponent(
      `Hi Vesper team,\n\nPlease add me to the Vesper newsletter:\n${trimmedEmail}\n\nThanks!`,
    );
    window.location.href = `mailto:${NEWSLETTER_FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);

    const parsed = EmailSchema.safeParse(email);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please enter a valid email address.";
      setError(message);
      toast.error(message);
      return;
    }

    setIsSubmitting(true);
    try {
      if (hasEndpoint) {
        await submitToEndpoint(parsed.data);
        toast.success("Thanks for subscribing!");
        setStatus("Thanks for subscribing — please check your inbox.");
        setEmail("");
      } else {
        openMailtoFallback(parsed.data);
        toast.success("Opening your email app to confirm subscription.");
        setStatus(
          "We don't have a sign-up endpoint wired up yet — your email app should open with a prefilled message.",
        );
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again later.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // We render a div wrapper so the form + below-the-form status messages
  // share a layout container; the consumer's className positions/caps the
  // whole group, while the form below preserves the flex/gap rhythm.
  const wantsCentered = /\b(justify-center|mx-auto)\b/.test(className);

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={`${statusId} ${errorId}`}
        className={`flex flex-col md:flex-row md:flex-nowrap items-stretch gap-4 w-full ${
          wantsCentered ? "md:justify-center" : ""
        }`}
      >
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="SUBSCRIBE TO THE NEWSLETTER"
          required
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          aria-invalid={error ? "true" : "false"}
          aria-errormessage={error ? errorId : undefined}
          className={`font-sans w-full md:min-w-72 min-h-full bg-transparent border-0 border-b-2 border-foreground text-foreground placeholder:text-foreground uppercase focus:outline-none focus:border-foreground pb-1 ${inputClassName}`}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-transparent font-sans whitespace-nowrap disabled:opacity-50 flex flex-row items-center justify-center ${buttonClassName}`}
        >
          {submitLabel}
          {!isSubmitting && <ArrowRight className="w-4 h-4" aria-hidden="true" />}
        </button>
      </form>
      <p
        id={errorId}
        role="alert"
        aria-live="assertive"
        className={`mt-2 text-xs md:text-sm font-sans uppercase tracking-wider ${
          error ? "" : "sr-only"
        }`}
      >
        {error ?? ""}
      </p>
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className={`mt-2 text-xs md:text-sm font-sans uppercase tracking-wider ${
          status ? "" : "sr-only"
        }`}
      >
        {status ?? ""}
      </p>
      {!hasEndpoint && !status && !error && (
        <p className="mt-2 text-[10px] md:text-xs font-sans uppercase tracking-wider opacity-60">
          Subscribing opens your email app with a prefilled draft.
        </p>
      )}
    </div>
  );
};

export default NewsletterForm;
