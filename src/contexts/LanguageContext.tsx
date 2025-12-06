import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.repairs': 'Repairs',
    'nav.custom': 'Custom Jewelry',
    'nav.shop': 'Shop',
    'nav.contact': 'Contact',
    'nav.language': 'Español',
    
    // Hero
    'hero.title': "NYC's Trusted Jewelry Repair & Custom Design Studio",
    'hero.subtitle': '30+ Years on 47th Street • Master Craftsman • Same-Day Repairs Available',
    'hero.cta.quote': 'Get a Free Repair Quote',
    'hero.cta.shop': 'Shop Gold & Silver Jewelry',
    
    // Watch Us Work
    'video.title': 'Watch Our Master Jeweler Bring Your Jewelry Back to Life',
    'video.placeholder': 'Video coming soon',
    
    // Services
    'services.repairs.title': 'Jewelry Repairs',
    'services.repairs.text': 'Ring resizing, prong and stone repair, chain soldering, laser welding, polishing, rhodium, engraving.',
    'services.repairs.button': 'View Repair Services',
    'services.custom.title': 'Custom Jewelry & Engagement Rings',
    'services.custom.text': 'Custom engagement rings, pendants, nameplates and more, designed and crafted in NYC.',
    'services.custom.button': 'Start a Custom Design',
    'services.shop.title': 'Gold & Silver Jewelry For Sale',
    'services.shop.text': 'Shop our curated selection of gold and silver jewelry, ready to wear or gift.',
    'services.shop.button': 'Shop Jewelry',
    
    // Before/After
    'gallery.title': 'Real Transformations – Real Craftsmanship',
    'gallery.placeholder': 'Before/After photos coming soon',
    
    // About
    'about.title': 'Meet Sam — 30 Years on 47th Street',
    'about.text': "Sam has spent over 30 years working in the heart of NYC's Diamond District, trusted by top jewelers and thousands of customers for precision repairs and custom work. Now, we bring that same level of craftsmanship directly to you.",
    'about.placeholder': 'Photo coming soon',
    
    // Testimonials
    'testimonials.title': 'What Our Clients Say',
    'testimonials.1': '"He fixed my engagement ring better than new."',
    'testimonials.2': '"Fast, honest, and the best prices in NYC."',
    'testimonials.3': '"Sam is the only one I trust with my jewelry."',
    
    // Spanish CTA
    'spanish.title': 'Hablamos Español',
    'spanish.text': 'Ofrecemos servicios de reparación y joyería personalizada para la comunidad hispana en Nueva York y alrededores.',
    'spanish.button': 'Ver Sitio en Español',
    
    // Footer
    'footer.tagline': 'Expert jewelry repair and custom design, serving NYC for over 30 years.',
    'footer.hours': 'Mon–Sat 10am–6pm',
    'footer.rights': 'All rights reserved.',
    
    // Repairs Page
    'repairs.title': 'Jewelry Repair Services',
    'repairs.subtitle': 'From simple resizing to complex laser repairs, we handle your pieces with care and precision.',
    'repairs.services.title': 'Our Services & Pricing',
    'repairs.form.title': 'Request a Free Quote',
    'repairs.form.name': 'Name',
    'repairs.form.email': 'Email',
    'repairs.form.phone': 'Phone',
    'repairs.form.contact': 'Preferred Contact Method',
    'repairs.form.contact.email': 'Email',
    'repairs.form.contact.phone': 'Phone',
    'repairs.form.contact.whatsapp': 'WhatsApp',
    'repairs.form.description': 'Describe the issue',
    'repairs.form.photos': 'Upload Photos',
    'repairs.form.submit': 'Request Free Quote',
    'repairs.form.success': 'Quote request submitted! We\'ll contact you soon.',
    
    // Custom Page
    'custom.title': 'Custom Jewelry & Engagement Rings',
    'custom.subtitle': 'From engagement rings to pendants and nameplates, we design and handcraft custom pieces that tell your story.',
    'custom.process.title': 'Our Process',
    'custom.step1': 'Share your idea or upload inspiration photos.',
    'custom.step2': 'We discuss budget, stones, and metal options.',
    'custom.step3': 'Optional CAD design for approval.',
    'custom.step4': 'Your piece is crafted in NYC and delivered.',
    'custom.form.title': 'Start Your Custom Design',
    'custom.form.type': 'Type of Piece',
    'custom.form.type.ring': 'Engagement Ring',
    'custom.form.type.pendant': 'Pendant',
    'custom.form.type.nameplate': 'Nameplate',
    'custom.form.type.other': 'Other',
    'custom.form.budget': 'Budget Range',
    'custom.form.description': 'Describe your vision',
    'custom.form.photos': 'Upload Inspiration Photos',
    'custom.form.submit': 'Start Custom Design',
    'custom.form.success': 'Custom inquiry submitted! We\'ll be in touch soon.',
    'custom.gallery.title': 'Our Custom Work',
    
    // Shop Page
    'shop.title': 'Shop Gold & Silver Jewelry',
    'shop.subtitle': 'Curated collection of fine jewelry, ready to wear or gift.',
    'shop.empty': 'No products found',
    'shop.addToCart': 'Add to Cart',
    'shop.viewDetails': 'View Details',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Visit us in NYC or reach out online.',
    'contact.form.title': 'Send a Message',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Message',
    'contact.form.success': 'Message sent! We\'ll get back to you soon.',
    'contact.info.title': 'Visit Us',
    'contact.whatsapp': 'WhatsApp Us',
    'contact.instagram': 'Follow on Instagram',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout with Shopify',
    'cart.creating': 'Creating Checkout...',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.repairs': 'Reparaciones',
    'nav.custom': 'Joyería Personalizada',
    'nav.shop': 'Tienda',
    'nav.contact': 'Contacto',
    'nav.language': 'English',
    
    // Hero
    'hero.title': 'Estudio de Reparación y Diseño de Joyería de Confianza en NYC',
    'hero.subtitle': '30+ Años en la Calle 47 • Maestro Artesano • Reparaciones el Mismo Día',
    'hero.cta.quote': 'Obtener Cotización Gratis',
    'hero.cta.shop': 'Comprar Joyería de Oro y Plata',
    
    // Watch Us Work
    'video.title': 'Mira a Nuestro Maestro Joyero Dar Vida a Tu Joyería',
    'video.placeholder': 'Video próximamente',
    
    // Services
    'services.repairs.title': 'Reparación de Joyería',
    'services.repairs.text': 'Ajuste de anillos, reparación de puntas y piedras, soldadura de cadenas, soldadura láser, pulido, rodio, grabado.',
    'services.repairs.button': 'Ver Servicios de Reparación',
    'services.custom.title': 'Joyería Personalizada y Anillos de Compromiso',
    'services.custom.text': 'Anillos de compromiso personalizados, colgantes, placas con nombre y más, diseñados y elaborados en NYC.',
    'services.custom.button': 'Iniciar Diseño Personalizado',
    'services.shop.title': 'Joyería de Oro y Plata en Venta',
    'services.shop.text': 'Compra nuestra selección curada de joyería de oro y plata, lista para usar o regalar.',
    'services.shop.button': 'Comprar Joyería',
    
    // Before/After
    'gallery.title': 'Transformaciones Reales – Artesanía Real',
    'gallery.placeholder': 'Fotos de antes/después próximamente',
    
    // About
    'about.title': 'Conoce a Sam — 30 Años en la Calle 47',
    'about.text': 'Sam ha pasado más de 30 años trabajando en el corazón del Distrito de Diamantes de NYC, de confianza por los mejores joyeros y miles de clientes para reparaciones de precisión y trabajo personalizado. Ahora, traemos ese mismo nivel de artesanía directamente a ti.',
    'about.placeholder': 'Foto próximamente',
    
    // Testimonials
    'testimonials.title': 'Lo Que Dicen Nuestros Clientes',
    'testimonials.1': '"Arregló mi anillo de compromiso mejor que nuevo."',
    'testimonials.2': '"Rápido, honesto, y los mejores precios en NYC."',
    'testimonials.3': '"Sam es el único en quien confío con mi joyería."',
    
    // Spanish CTA
    'spanish.title': 'Hablamos Español',
    'spanish.text': 'Ofrecemos servicios de reparación y joyería personalizada para la comunidad hispana en Nueva York y alrededores.',
    'spanish.button': 'Ver en Inglés',
    
    // Footer
    'footer.tagline': 'Reparación experta de joyería y diseño personalizado, sirviendo a NYC por más de 30 años.',
    'footer.hours': 'Lun–Sáb 10am–6pm',
    'footer.rights': 'Todos los derechos reservados.',
    
    // Repairs Page
    'repairs.title': 'Servicios de Reparación de Joyería',
    'repairs.subtitle': 'Desde ajustes simples hasta reparaciones láser complejas, manejamos tus piezas con cuidado y precisión.',
    'repairs.services.title': 'Nuestros Servicios y Precios',
    'repairs.form.title': 'Solicitar Cotización Gratis',
    'repairs.form.name': 'Nombre',
    'repairs.form.email': 'Correo Electrónico',
    'repairs.form.phone': 'Teléfono',
    'repairs.form.contact': 'Método de Contacto Preferido',
    'repairs.form.contact.email': 'Correo Electrónico',
    'repairs.form.contact.phone': 'Teléfono',
    'repairs.form.contact.whatsapp': 'WhatsApp',
    'repairs.form.description': 'Describe el problema',
    'repairs.form.photos': 'Subir Fotos',
    'repairs.form.submit': 'Solicitar Cotización Gratis',
    'repairs.form.success': '¡Solicitud de cotización enviada! Te contactaremos pronto.',
    
    // Custom Page
    'custom.title': 'Joyería Personalizada y Anillos de Compromiso',
    'custom.subtitle': 'Desde anillos de compromiso hasta colgantes y placas con nombre, diseñamos y elaboramos piezas personalizadas que cuentan tu historia.',
    'custom.process.title': 'Nuestro Proceso',
    'custom.step1': 'Comparte tu idea o sube fotos de inspiración.',
    'custom.step2': 'Discutimos presupuesto, piedras y opciones de metal.',
    'custom.step3': 'Diseño CAD opcional para aprobación.',
    'custom.step4': 'Tu pieza es elaborada en NYC y entregada.',
    'custom.form.title': 'Inicia Tu Diseño Personalizado',
    'custom.form.type': 'Tipo de Pieza',
    'custom.form.type.ring': 'Anillo de Compromiso',
    'custom.form.type.pendant': 'Colgante',
    'custom.form.type.nameplate': 'Placa con Nombre',
    'custom.form.type.other': 'Otro',
    'custom.form.budget': 'Rango de Presupuesto',
    'custom.form.description': 'Describe tu visión',
    'custom.form.photos': 'Subir Fotos de Inspiración',
    'custom.form.submit': 'Iniciar Diseño Personalizado',
    'custom.form.success': '¡Consulta personalizada enviada! Te contactaremos pronto.',
    'custom.gallery.title': 'Nuestro Trabajo Personalizado',
    
    // Shop Page
    'shop.title': 'Tienda de Joyería de Oro y Plata',
    'shop.subtitle': 'Colección curada de joyería fina, lista para usar o regalar.',
    'shop.empty': 'No se encontraron productos',
    'shop.addToCart': 'Agregar al Carrito',
    'shop.viewDetails': 'Ver Detalles',
    
    // Contact Page
    'contact.title': 'Contáctanos',
    'contact.subtitle': 'Visítanos en NYC o comunícate en línea.',
    'contact.form.title': 'Enviar un Mensaje',
    'contact.form.message': 'Mensaje',
    'contact.form.submit': 'Enviar Mensaje',
    'contact.form.success': '¡Mensaje enviado! Te responderemos pronto.',
    'contact.info.title': 'Visítanos',
    'contact.whatsapp': 'Escríbenos por WhatsApp',
    'contact.instagram': 'Síguenos en Instagram',
    
    // Cart
    'cart.title': 'Carrito de Compras',
    'cart.empty': 'Tu carrito está vacío',
    'cart.total': 'Total',
    'cart.checkout': 'Pagar con Shopify',
    'cart.creating': 'Creando Pago...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
