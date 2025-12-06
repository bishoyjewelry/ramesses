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
    'nav.repairs': 'Mail-In Repairs',
    'nav.custom': 'Custom Jewelry',
    'nav.shop': 'Shop',
    'nav.contact': 'Contact',
    'nav.language': 'Español',
    
    // Hero
    'hero.title': 'Nationwide Mail-In Jewelry Repair by a 47th Street Master Jeweler',
    'hero.subtitle': 'Ship your jewelry from anywhere in the U.S. 30+ years of experience on NYC\'s Diamond District.',
    'hero.cta.primary': 'Start Mail-In Repair',
    'hero.cta.secondary': 'NYC In-Person Appointments',
    
    // Mail-In Steps
    'mailin.title': 'How Mail-In Repairs Work',
    'mailin.step1.title': 'Request a Quote',
    'mailin.step1.text': 'Upload photos and describe the issue for a free estimate.',
    'mailin.step2.title': 'Shipping Instructions',
    'mailin.step2.text': 'Receive shipping instructions and an optional prepaid label.',
    'mailin.step3.title': 'Expert Repair',
    'mailin.step3.text': 'We repair your jewelry and send progress updates.',
    'mailin.step4.title': 'Insured Return',
    'mailin.step4.text': 'You approve the work, and we ship it back insured.',
    'mailin.spanish.note': 'Hablamos Español – también ofrecemos servicio de reparación por correo para clientes hispanohablantes.',
    
    // Watch Us Work
    'video.title': 'Watch Our Master Jeweler Bring Your Jewelry Back to Life',
    'video.placeholder': 'Video coming soon',
    
    // Services
    'services.repairs.title': 'Mail-In Jewelry Repairs',
    'services.repairs.text': 'Ship from anywhere in the U.S. Ring resizing, prong repair, chain soldering, laser welding, polishing, and more.',
    'services.repairs.button': 'Start Mail-In Repair',
    'services.custom.title': 'Custom Jewelry & Engagement Rings',
    'services.custom.text': 'Custom engagement rings, pendants, nameplates and more. We work with clients nationwide by mail.',
    'services.custom.button': 'Start a Custom Design',
    'services.shop.title': 'Gold & Silver Jewelry For Sale',
    'services.shop.text': 'Shop our curated selection of gold and silver jewelry, shipped nationwide.',
    'services.shop.button': 'Shop Jewelry',
    
    // Before/After
    'gallery.title': 'Real Transformations – Real Craftsmanship',
    'gallery.placeholder': 'Before/After photos coming soon',
    
    // About
    'about.title': 'Meet Sam — 30 Years on 47th Street',
    'about.text': "Sam has spent over 30 years working in the heart of NYC's Diamond District, trusted by top jewelers and thousands of customers for precision repairs and custom work. Now, we bring that same level of craftsmanship directly to you—no matter where you live.",
    'about.placeholder': 'Photo coming soon',
    
    // Testimonials
    'testimonials.title': 'What Our Clients Say',
    'testimonials.1': '"Mailed my grandmother\'s ring from Texas. Came back perfect!"',
    'testimonials.2': '"Fast, honest, and the best prices. Shipping was easy."',
    'testimonials.3': '"Sam is the only one I trust with my jewelry—even from across the country."',
    
    // Spanish CTA
    'spanish.title': 'Hablamos Español',
    'spanish.text': 'Ofrecemos servicios de reparación por correo y joyería personalizada para la comunidad hispana en todo Estados Unidos.',
    'spanish.button': 'Ver Sitio en Español',
    
    // Footer
    'footer.tagline': 'Nationwide mail-in jewelry repair and custom design by a 47th Street master jeweler.',
    'footer.hours': 'Mon–Sat 10am–6pm',
    'footer.rights': 'All rights reserved.',
    
    // Repairs Page
    'repairs.title': 'Mail-In Jewelry Repair Services',
    'repairs.subtitle': 'Send your jewelry from anywhere in the U.S. for expert repair, resizing, and restoration.',
    'repairs.howitworks': 'How It Works',
    'repairs.services.title': 'Our Services',
    'repairs.form.title': 'Request Mail-In Repair Quote',
    'repairs.form.name': 'Name',
    'repairs.form.email': 'Email',
    'repairs.form.phone': 'Phone',
    'repairs.form.contact': 'Preferred Contact Method',
    'repairs.form.contact.email': 'Email',
    'repairs.form.contact.phone': 'Phone',
    'repairs.form.contact.whatsapp': 'WhatsApp',
    'repairs.form.repairType': 'Repair Type',
    'repairs.form.repairType.mailin': 'Mail-In Repair (Nationwide)',
    'repairs.form.repairType.inperson': 'In-Person Repair (NYC)',
    'repairs.form.description': 'Describe the issue',
    'repairs.form.photos': 'Upload Photos',
    'repairs.form.submit': 'Request Mail-In Repair Quote',
    'repairs.form.success': 'Quote request submitted! We\'ll contact you with shipping instructions.',
    
    // In-Person Section
    'repairs.inperson.title': 'In-Person Repairs in NYC',
    'repairs.inperson.text': 'If you\'re local to NYC/NJ and prefer to visit in person, you can book an appointment on 47th Street.',
    'repairs.inperson.button': 'Book In-Person Visit',
    
    // Custom Page
    'custom.title': 'Custom Jewelry & Engagement Rings',
    'custom.subtitle': 'From engagement rings to pendants and nameplates, we design and handcraft custom pieces that tell your story.',
    'custom.mailin.note': 'We work with clients nationwide by mail—not just local NYC customers.',
    'custom.process.title': 'Our Process',
    'custom.step1': 'Share your idea or upload inspiration photos.',
    'custom.step2': 'We discuss budget, stones, and metal options.',
    'custom.step3': 'Optional CAD design for approval.',
    'custom.step4': 'Your piece is crafted in NYC and shipped to you.',
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
    'shop.subtitle': 'Curated collection of fine jewelry, shipped nationwide.',
    'shop.mailin.note': 'We also offer mail-in repairs and custom work for clients across the U.S.',
    'shop.empty': 'No products found',
    'shop.addToCart': 'Add to Cart',
    'shop.viewDetails': 'View Details',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Visit us in NYC or reach out online for mail-in repairs.',
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
    'nav.repairs': 'Reparaciones por Correo',
    'nav.custom': 'Joyería Personalizada',
    'nav.shop': 'Tienda',
    'nav.contact': 'Contacto',
    'nav.language': 'English',
    
    // Hero
    'hero.title': 'Reparación de Joyas por Correo en Todo EE.UU.',
    'hero.subtitle': 'Puedes enviarnos tus joyas desde cualquier parte de Estados Unidos para reparación profesional. 30+ años de experiencia en el Distrito de Diamantes de NYC.',
    'hero.cta.primary': 'Iniciar Reparación por Correo',
    'hero.cta.secondary': 'Cita en Persona en NYC',
    
    // Mail-In Steps
    'mailin.title': 'Cómo Funcionan las Reparaciones por Correo',
    'mailin.step1.title': 'Solicita Cotización',
    'mailin.step1.text': 'Sube fotos y describe el problema para una estimación gratis.',
    'mailin.step2.title': 'Instrucciones de Envío',
    'mailin.step2.text': 'Recibe instrucciones de envío y una etiqueta prepagada opcional.',
    'mailin.step3.title': 'Reparación Experta',
    'mailin.step3.text': 'Reparamos tu joyería y enviamos actualizaciones de progreso.',
    'mailin.step4.title': 'Devolución Asegurada',
    'mailin.step4.text': 'Apruebas el trabajo y lo enviamos de vuelta asegurado.',
    'mailin.spanish.note': 'Hablamos Español – ofrecemos servicio completo en español para todos nuestros clientes.',
    
    // Watch Us Work
    'video.title': 'Mira a Nuestro Maestro Joyero Dar Vida a Tu Joyería',
    'video.placeholder': 'Video próximamente',
    
    // Services
    'services.repairs.title': 'Reparaciones por Correo',
    'services.repairs.text': 'Envía desde cualquier lugar de EE.UU. Ajuste de anillos, reparación de puntas, soldadura de cadenas, soldadura láser, pulido, y más.',
    'services.repairs.button': 'Iniciar Reparación por Correo',
    'services.custom.title': 'Joyería Personalizada y Anillos de Compromiso',
    'services.custom.text': 'Anillos de compromiso, colgantes, placas con nombre y más. Trabajamos con clientes en todo el país por correo.',
    'services.custom.button': 'Iniciar Diseño Personalizado',
    'services.shop.title': 'Joyería de Oro y Plata en Venta',
    'services.shop.text': 'Nuestra selección curada de joyería, enviada a todo el país.',
    'services.shop.button': 'Comprar Joyería',
    
    // Before/After
    'gallery.title': 'Transformaciones Reales – Artesanía Real',
    'gallery.placeholder': 'Fotos de antes/después próximamente',
    
    // About
    'about.title': 'Conoce a Sam — 30 Años en la Calle 47',
    'about.text': 'Sam ha pasado más de 30 años trabajando en el corazón del Distrito de Diamantes de NYC, de confianza por los mejores joyeros y miles de clientes para reparaciones de precisión y trabajo personalizado. Ahora, traemos ese mismo nivel de artesanía directamente a ti—sin importar dónde vivas.',
    'about.placeholder': 'Foto próximamente',
    
    // Testimonials
    'testimonials.title': 'Lo Que Dicen Nuestros Clientes',
    'testimonials.1': '"Envié el anillo de mi abuela desde Texas. ¡Regresó perfecto!"',
    'testimonials.2': '"Rápido, honesto, y los mejores precios. El envío fue fácil."',
    'testimonials.3': '"Sam es el único en quien confío con mi joyería—incluso desde el otro lado del país."',
    
    // Spanish CTA
    'spanish.title': 'Hablamos Español',
    'spanish.text': 'Ofrecemos servicios de reparación por correo y joyería personalizada para la comunidad hispana en todo Estados Unidos.',
    'spanish.button': 'Ver en Inglés',
    
    // Footer
    'footer.tagline': 'Reparación de joyería por correo en todo el país y diseño personalizado por un maestro joyero de la Calle 47.',
    'footer.hours': 'Lun–Sáb 10am–6pm',
    'footer.rights': 'Todos los derechos reservados.',
    
    // Repairs Page
    'repairs.title': 'Servicios de Reparación de Joyería por Correo',
    'repairs.subtitle': 'Envía tu joyería desde cualquier lugar de EE.UU. para reparación experta, ajuste y restauración.',
    'repairs.howitworks': 'Cómo Funciona',
    'repairs.services.title': 'Nuestros Servicios',
    'repairs.form.title': 'Solicitar Cotización de Reparación por Correo',
    'repairs.form.name': 'Nombre',
    'repairs.form.email': 'Correo Electrónico',
    'repairs.form.phone': 'Teléfono',
    'repairs.form.contact': 'Método de Contacto Preferido',
    'repairs.form.contact.email': 'Correo Electrónico',
    'repairs.form.contact.phone': 'Teléfono',
    'repairs.form.contact.whatsapp': 'WhatsApp',
    'repairs.form.repairType': 'Tipo de Reparación',
    'repairs.form.repairType.mailin': 'Reparación por Correo (Nacional)',
    'repairs.form.repairType.inperson': 'Reparación en Persona (NYC)',
    'repairs.form.description': 'Describe el problema',
    'repairs.form.photos': 'Subir Fotos',
    'repairs.form.submit': 'Solicitar Cotización por Correo',
    'repairs.form.success': '¡Solicitud enviada! Te contactaremos con instrucciones de envío.',
    
    // In-Person Section
    'repairs.inperson.title': 'Reparaciones en Persona en NYC',
    'repairs.inperson.text': 'Si estás cerca de NYC/NJ y prefieres visitar en persona, puedes reservar una cita en la Calle 47.',
    'repairs.inperson.button': 'Reservar Visita en Persona',
    
    // Custom Page
    'custom.title': 'Joyería Personalizada y Anillos de Compromiso',
    'custom.subtitle': 'Desde anillos de compromiso hasta colgantes y placas con nombre, diseñamos y elaboramos piezas personalizadas que cuentan tu historia.',
    'custom.mailin.note': 'Trabajamos con clientes en todo el país por correo—no solo clientes locales de NYC.',
    'custom.process.title': 'Nuestro Proceso',
    'custom.step1': 'Comparte tu idea o sube fotos de inspiración.',
    'custom.step2': 'Discutimos presupuesto, piedras y opciones de metal.',
    'custom.step3': 'Diseño CAD opcional para aprobación.',
    'custom.step4': 'Tu pieza es elaborada en NYC y enviada a ti.',
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
    'shop.subtitle': 'Colección curada de joyería fina, enviada a todo el país.',
    'shop.mailin.note': 'También ofrecemos reparaciones por correo y trabajo personalizado para clientes en todo EE.UU.',
    'shop.empty': 'No se encontraron productos',
    'shop.addToCart': 'Agregar al Carrito',
    'shop.viewDetails': 'Ver Detalles',
    
    // Contact Page
    'contact.title': 'Contáctanos',
    'contact.subtitle': 'Visítanos en NYC o comunícate en línea para reparaciones por correo.',
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