import { useLanguage } from "@/contexts/LanguageContext";

export const HomeContent = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <>
      {/* Minimal spacer — content sections removed per luxury storefront strategy */}
      <div className="py-16 sm:py-24 bg-background" />

      {/* ==================== LANGUAGE SWITCHER ==================== */}
      {language !== "es" && (
        <section className="py-8 bg-secondary border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">¿Hablas español?</p>
            <button 
              onClick={() => setLanguage("es")}
              className="text-sm text-primary hover:text-primary/80 underline underline-offset-2"
            >
              Ver en español
            </button>
          </div>
        </section>
      )}
    </>
  );
};
