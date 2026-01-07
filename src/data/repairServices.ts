export interface RepairService {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: "ring" | "necklace" | "bracelet" | "earring" | "watch" | "other";
  serviceType: "sizing" | "soldering" | "stone-setting" | "cleaning" | "engraving" | "other";
  basePrice: number;
  priceVaries: boolean;
  priceNote?: string;
  turnaroundDays: string;
  icon: string;
}

export const repairServices: RepairService[] = [
  // RING SERVICES
  {
    id: "ring-size-up",
    slug: "ring-sizing-up",
    name: "Ring Sizing Up",
    shortDescription: "Make your ring larger",
    fullDescription: "Our expert jewelers can size your ring up to any size you need, including half and quarter sizes. We work with gold, platinum, silver, and alternative metals.",
    category: "ring",
    serviceType: "sizing",
    basePrice: 45,
    priceVaries: true,
    priceNote: "Price varies by metal type and size change",
    turnaroundDays: "3-5",
    icon: "💍"
  },
  {
    id: "ring-size-down",
    slug: "ring-sizing-down",
    name: "Ring Sizing Down",
    shortDescription: "Make your ring smaller",
    fullDescription: "We can size your ring down while maintaining its integrity and finish. Works with most metals and ring styles.",
    category: "ring",
    serviceType: "sizing",
    basePrice: 45,
    priceVaries: true,
    priceNote: "Price varies by metal type and size change",
    turnaroundDays: "3-5",
    icon: "💍"
  },
  {
    id: "prong-retipping",
    slug: "prong-retipping",
    name: "Prong Retipping",
    shortDescription: "Secure loose stones",
    fullDescription: "Worn prongs can cause stones to fall out. We rebuild and reinforce prongs to keep your stones secure.",
    category: "ring",
    serviceType: "stone-setting",
    basePrice: 35,
    priceVaries: true,
    priceNote: "Per prong, minimum 4 prongs",
    turnaroundDays: "3-5",
    icon: "💎"
  },
  {
    id: "ring-polishing",
    slug: "ring-polishing",
    name: "Ring Polishing & Cleaning",
    shortDescription: "Restore original shine",
    fullDescription: "Professional cleaning and polishing to make your ring look like new. Includes inspection for loose stones.",
    category: "ring",
    serviceType: "cleaning",
    basePrice: 30,
    priceVaries: false,
    turnaroundDays: "1-2",
    icon: "✨"
  },
  {
    id: "ring-engraving",
    slug: "ring-engraving",
    name: "Ring Engraving",
    shortDescription: "Add a personal inscription",
    fullDescription: "Laser engraving for precise, permanent inscriptions inside or outside your ring. Custom fonts available.",
    category: "ring",
    serviceType: "engraving",
    basePrice: 40,
    priceVaries: true,
    priceNote: "Based on character count",
    turnaroundDays: "2-3",
    icon: "✍️"
  },
  
  // CHAIN/NECKLACE SERVICES
  {
    id: "chain-repair",
    slug: "chain-repair",
    name: "Chain Repair / Soldering",
    shortDescription: "Fix broken chains",
    fullDescription: "Expert soldering to repair broken chains. We match the original finish so repairs are invisible.",
    category: "necklace",
    serviceType: "soldering",
    basePrice: 30,
    priceVaries: true,
    priceNote: "Complex chains may cost more",
    turnaroundDays: "2-3",
    icon: "⛓️"
  },
  {
    id: "chain-lengthening",
    slug: "chain-lengthening",
    name: "Chain Lengthening",
    shortDescription: "Add length to your chain",
    fullDescription: "We can add matching links to extend your chain to the perfect length.",
    category: "necklace",
    serviceType: "soldering",
    basePrice: 40,
    priceVaries: true,
    priceNote: "Depends on chain type and length added",
    turnaroundDays: "3-5",
    icon: "📏"
  },
  {
    id: "clasp-replacement",
    slug: "clasp-replacement",
    name: "Clasp Replacement",
    shortDescription: "Replace broken or worn clasps",
    fullDescription: "We replace broken clasps with high-quality replacements that match your piece.",
    category: "necklace",
    serviceType: "soldering",
    basePrice: 35,
    priceVaries: true,
    priceNote: "Includes standard clasp, upgrades available",
    turnaroundDays: "2-3",
    icon: "🔗"
  },
  {
    id: "pearl-restringing",
    slug: "pearl-restringing",
    name: "Pearl Restringing",
    shortDescription: "Restring pearl necklaces",
    fullDescription: "Professional restringing with silk thread and knots between each pearl to prevent damage.",
    category: "necklace",
    serviceType: "other",
    basePrice: 75,
    priceVaries: true,
    priceNote: "Based on strand length",
    turnaroundDays: "5-7",
    icon: "📿"
  },
  
  // BRACELET SERVICES
  {
    id: "bracelet-repair",
    slug: "bracelet-repair",
    name: "Bracelet Repair",
    shortDescription: "Fix broken bracelets",
    fullDescription: "Soldering, link replacement, and clasp repair for all bracelet types.",
    category: "bracelet",
    serviceType: "soldering",
    basePrice: 35,
    priceVaries: true,
    turnaroundDays: "3-5",
    icon: "⌚"
  },
  {
    id: "bracelet-sizing",
    slug: "bracelet-sizing",
    name: "Bracelet Sizing",
    shortDescription: "Add or remove links",
    fullDescription: "Adjust your bracelet length by adding or removing links for the perfect fit.",
    category: "bracelet",
    serviceType: "sizing",
    basePrice: 30,
    priceVaries: true,
    turnaroundDays: "2-3",
    icon: "📐"
  },
  
  // EARRING SERVICES
  {
    id: "earring-post-repair",
    slug: "earring-post-repair",
    name: "Earring Post Repair",
    shortDescription: "Fix or replace posts",
    fullDescription: "Repair bent posts or replace broken ones. Includes backs.",
    category: "earring",
    serviceType: "soldering",
    basePrice: 25,
    priceVaries: false,
    turnaroundDays: "2-3",
    icon: "✨"
  },
  {
    id: "earring-back-replacement",
    slug: "earring-back-replacement",
    name: "Earring Back Conversion",
    shortDescription: "Change earring back style",
    fullDescription: "Convert between post, lever-back, screw-back, or clip-on styles.",
    category: "earring",
    serviceType: "soldering",
    basePrice: 40,
    priceVaries: true,
    priceNote: "Per earring",
    turnaroundDays: "3-5",
    icon: "🔄"
  },
  
  // WATCH SERVICES  
  {
    id: "watch-battery",
    slug: "watch-battery-replacement",
    name: "Watch Battery Replacement",
    shortDescription: "Replace dead batteries",
    fullDescription: "Quick battery replacement for most watch brands. Water resistance tested after service.",
    category: "watch",
    serviceType: "other",
    basePrice: 25,
    priceVaries: true,
    priceNote: "Luxury brands may cost more",
    turnaroundDays: "1-2",
    icon: "🔋"
  },
  {
    id: "watch-crystal",
    slug: "watch-crystal-replacement",
    name: "Watch Crystal Replacement",
    shortDescription: "Replace scratched or cracked crystal",
    fullDescription: "We replace mineral and sapphire crystals to restore your watch face.",
    category: "watch",
    serviceType: "other",
    basePrice: 75,
    priceVaries: true,
    priceNote: "Sapphire crystals cost more",
    turnaroundDays: "5-7",
    icon: "💠"
  },
  {
    id: "watch-band-repair",
    slug: "watch-band-repair",
    name: "Watch Band Repair",
    shortDescription: "Fix or replace watch bands",
    fullDescription: "Link removal, clasp repair, or full band replacement.",
    category: "watch",
    serviceType: "other",
    basePrice: 30,
    priceVaries: true,
    turnaroundDays: "2-5",
    icon: "⌚"
  },
  
  // GENERAL SERVICES
  {
    id: "gold-plating",
    slug: "gold-plating",
    name: "Gold Plating",
    shortDescription: "Restore or add gold finish",
    fullDescription: "Professional electroplating in yellow, white, or rose gold. Restores worn plating or changes color.",
    category: "other",
    serviceType: "other",
    basePrice: 60,
    priceVaries: true,
    priceNote: "Based on item size",
    turnaroundDays: "5-7",
    icon: "🌟"
  },
  {
    id: "rhodium-plating",
    slug: "rhodium-plating",
    name: "Rhodium Plating",
    shortDescription: "Restore white gold brightness",
    fullDescription: "Rhodium plating restores the bright white finish on white gold jewelry.",
    category: "other",
    serviceType: "other",
    basePrice: 50,
    priceVaries: true,
    priceNote: "Based on item size",
    turnaroundDays: "3-5",
    icon: "💫"
  },
  {
    id: "stone-replacement",
    slug: "stone-replacement",
    name: "Stone Replacement",
    shortDescription: "Replace missing or damaged stones",
    fullDescription: "We source and set replacement stones to match your existing jewelry.",
    category: "other",
    serviceType: "stone-setting",
    basePrice: 25,
    priceVaries: true,
    priceNote: "Stone cost additional",
    turnaroundDays: "5-10",
    icon: "💎"
  }
];

// Helper functions
export const getServicesByCategory = (category: RepairService["category"]) => 
  repairServices.filter(s => s.category === category);

export const getServiceBySlug = (slug: string) => 
  repairServices.find(s => s.slug === slug);

export const categories = [
  { id: "ring", label: "Rings", icon: "💍" },
  { id: "necklace", label: "Necklaces & Chains", icon: "📿" },
  { id: "bracelet", label: "Bracelets", icon: "⌚" },
  { id: "earring", label: "Earrings", icon: "✨" },
  { id: "watch", label: "Watches", icon: "⌚" },
  { id: "other", label: "Other Services", icon: "🔧" },
] as const;