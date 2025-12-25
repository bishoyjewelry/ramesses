interface SEOContentBlockProps {
  title?: string;
  content?: string;
  className?: string;
}

const defaultTitle = "Nationwide Jewelry Repair | Ramesses 47th Street Jewelers";

const defaultContent = `Ramesses provides insured, nationwide jewelry repair performed by a 47th Street master jeweler with over 30 years of experience. Our services include ring resizing, prong repair, chain soldering, rhodium plating, polishing, stone replacement, antique restoration, and engagement ring refurbishment. Every item is documented with high-resolution photography and video intake. Customers can ship their jewelry, visit our NYC location, or schedule a local courier pickup. Repairs are quoted digitally, approved online, and completed within 3–5 days. Trusted nationwide for precision craftsmanship and transparent service.`;

export const SEOContentBlock = ({
  title = defaultTitle,
  content = defaultContent,
  className = ""
}: SEOContentBlockProps) => {
  return (
    <section className={`py-12 bg-service-neutral ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium text-luxury-text/70 mb-3 uppercase tracking-wide">
            {title}
          </h2>
          <p className="text-sm text-luxury-text-muted leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </section>
  );
};
