import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "Is mailing my jewelry safe?",
    answer: "Yes. Every shipment is fully insured, tracked, and uses tamper-evident packaging. We document every piece with video upon arrival before any work begins."
  },
  {
    question: "How long does a repair take?",
    answer: "Most repairs are completed within 3–5 business days after you approve your quote. Complex restorations may take longer—we'll give you a clear timeline upfront."
  },
  {
    question: "Who performs the work?",
    answer: "Every piece is handled by a master jeweler with over 40 years of experience in NYC's Diamond District. No outsourcing, no shortcuts."
  },
  {
    question: "Can I drop off or pick up in person?",
    answer: "Yes. We offer in-person appointments in Manhattan and courier pickup/delivery in NYC and North Jersey."
  },
  {
    question: "How do I pay?",
    answer: "Once you approve your quote online, you'll receive a secure payment link. Payment is processed through Shopify Checkout."
  },
  {
    question: "Can I track my repair status?",
    answer: "Absolutely. You can track your repair in real-time through your account or by entering your repair ID on our tracking page."
  },
  {
    question: "What if I have questions during the process?",
    answer: "Reach out anytime via this contact form, email, or phone. We respond within 1 business day."
  },
];

interface FAQSectionProps {
  title?: string;
  faqs?: FAQItem[];
  className?: string;
}

export const FAQSection = ({ 
  title = "Frequently Asked Questions", 
  faqs = defaultFAQs,
  className = ""
}: FAQSectionProps) => {
  return (
    <section className={`py-14 sm:py-18 bg-background ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-foreground text-center mb-10 font-normal text-xl sm:text-2xl tracking-tight">
            {title}
          </h2>
          
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/40 bg-secondary/20 px-5 sm:px-6"
              >
                <AccordionTrigger className="text-left text-foreground font-medium text-sm sm:text-base hover:text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
