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
    question: "Is mailing jewelry safe?",
    answer: "Yes. We use insured labels, tamper-evident packaging, and full video intake before work begins."
  },
  {
    question: "How long does a repair take?",
    answer: "Most repairs are completed within 3–5 business days after quote approval."
  },
  {
    question: "Who performs the repairs?",
    answer: "A master jeweler with 30+ years of experience on NYC's Diamond District."
  },
  {
    question: "Do you offer drop-off or pickup?",
    answer: "Yes. We offer Manhattan + North Jersey courier pickup and NYC in-person drop-off."
  },
  {
    question: "How do I pay for the repair?",
    answer: "You approve your quote online and pay securely through Shopify Checkout."
  },
  {
    question: "Can I track my repair?",
    answer: "Yes. Your account shows real-time status: received, inspected, quoted, in progress, completed, shipped."
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
    <section className={`py-16 md:py-20 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-text text-center mb-4">
          {title}
        </h2>
        <div className="w-20 h-1 bg-service-gold mx-auto mb-12"></div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-luxury-divider rounded-lg px-6 bg-white shadow-soft"
              >
                <AccordionTrigger className="text-left text-luxury-text font-medium hover:text-service-gold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-luxury-text-muted pb-5">
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
