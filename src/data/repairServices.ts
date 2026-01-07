export interface RepairService {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: "ring" | "necklace" | "bracelet" | "earring" | "watch" | "other";
  serviceType: string;
  basePrice: number;
  priceVaries: boolean;
  priceNote?: string;
  turnaroundDays: string;
  popular?: boolean;
}

export const repairServices: RepairService[] = [
  // RING SIZING
  { id: "ring-size-down", slug: "ring-sizing-down", name: "Ring Sizing Down", shortDescription: "Make your ring smaller", category: "ring", serviceType: "sizing", basePrice: 40, priceVaries: true, priceNote: "Varies by metal type", turnaroundDays: "3-5", popular: true },
  { id: "ring-size-up", slug: "ring-sizing-up", name: "Ring Sizing Up", shortDescription: "Make your ring larger", category: "ring", serviceType: "sizing", basePrice: 45, priceVaries: true, priceNote: "Varies by metal type", turnaroundDays: "3-5", popular: true },
  { id: "ring-sizing-beads", slug: "ring-sizing-beads", name: "Ring Sizing Beads/Bar", shortDescription: "Alternative sizing for large knuckles", category: "ring", serviceType: "sizing", basePrice: 35, priceVaries: false, turnaroundDays: "3-5" },
  
  // RING REPAIR
  { id: "ring-unsoldering", slug: "ring-unsoldering", name: "Ring Unsoldering", shortDescription: "Separate soldered rings", category: "ring", serviceType: "ring-repair", basePrice: 50, priceVaries: true, turnaroundDays: "3-5" },
  { id: "ring-soldering", slug: "ring-soldering", name: "Ring Soldering", shortDescription: "Join two or more rings together", category: "ring", serviceType: "ring-repair", basePrice: 55, priceVaries: true, turnaroundDays: "3-5" },
  { id: "ring-reshaping", slug: "ring-reshaping", name: "Ring Reshaping", shortDescription: "Fix bent or misshapen rings", category: "ring", serviceType: "ring-repair", basePrice: 48, priceVaries: true, turnaroundDays: "3-5" },
  { id: "ring-shank-repair", slug: "ring-shank-repair", name: "Ring Shank Repair", shortDescription: "Repair thin or cracked bands", category: "ring", serviceType: "ring-repair", basePrice: 40, priceVaries: true, turnaroundDays: "5-7" },
  
  // PRONG REPAIR
  { id: "prong-rebuilding", slug: "prong-rebuilding", name: "Prong Rebuilding", shortDescription: "Replace broken prongs", category: "ring", serviceType: "prong", basePrice: 25, priceVaries: true, priceNote: "Per prong", turnaroundDays: "3-5" },
  { id: "prong-retipping", slug: "prong-retipping", name: "Prong Retipping", shortDescription: "Reinforce worn prongs", category: "ring", serviceType: "prong", basePrice: 25, priceVaries: true, priceNote: "Per prong", turnaroundDays: "3-5" },
  
  // CHAIN/NECKLACE
  { id: "chain-repair", slug: "chain-repair", name: "Chain Repair / Soldering", shortDescription: "Fix broken chains", category: "necklace", serviceType: "soldering", basePrice: 25, priceVaries: true, turnaroundDays: "2-3", popular: true },
  { id: "clasp-repair", slug: "clasp-repair", name: "Clasp Repair / Replacement", shortDescription: "Fix or replace broken clasps", category: "necklace", serviceType: "soldering", basePrice: 43, priceVaries: true, turnaroundDays: "2-3" },
  { id: "chain-lengthening", slug: "chain-lengthening", name: "Chain Lengthening", shortDescription: "Add length to your chain", category: "necklace", serviceType: "soldering", basePrice: 49, priceVaries: true, turnaroundDays: "3-5" },
  { id: "chain-shortening", slug: "chain-shortening", name: "Chain Shortening", shortDescription: "Remove length from your chain", category: "necklace", serviceType: "soldering", basePrice: 39, priceVaries: true, turnaroundDays: "2-3" },
  { id: "bail-repair", slug: "bail-repair", name: "Bail Repair / Replacement", shortDescription: "Fix or replace pendant bails", category: "necklace", serviceType: "replacement", basePrice: 34, priceVaries: true, turnaroundDays: "2-3" },
  { id: "jump-ring-repair", slug: "jump-ring-repair", name: "Jump Ring Repair", shortDescription: "Fix or replace jump rings", category: "necklace", serviceType: "replacement", basePrice: 15, priceVaries: false, turnaroundDays: "1-2" },
  { id: "pearl-restringing", slug: "pearl-restringing", name: "Pearl / Bead Restringing", shortDescription: "Restring pearl or bead jewelry", category: "necklace", serviceType: "cleaning", basePrice: 12, priceVaries: true, priceNote: "Per inch", turnaroundDays: "5-7" },
  { id: "necklace-engraving", slug: "necklace-engraving", name: "Necklace / Pendant Engraving", shortDescription: "Engrave pendants and dog tags", category: "necklace", serviceType: "engraving", basePrice: 30, priceVaries: true, turnaroundDays: "2-3" },
  
  // BRACELET
  { id: "bracelet-repair", slug: "bracelet-repair", name: "Bracelet Repair", shortDescription: "Fix broken bracelets", category: "bracelet", serviceType: "soldering", basePrice: 30, priceVaries: true, turnaroundDays: "3-5" },
  { id: "bracelet-sizing", slug: "bracelet-sizing", name: "Bracelet Sizing", shortDescription: "Add or remove links", category: "bracelet", serviceType: "sizing", basePrice: 25, priceVaries: true, turnaroundDays: "2-3" },
  { id: "hinge-repair", slug: "hinge-repair", name: "Hinge Repair", shortDescription: "Fix broken hinges", category: "bracelet", serviceType: "replacement", basePrice: 40, priceVaries: true, turnaroundDays: "3-5" },
  { id: "bracelet-engraving", slug: "bracelet-engraving", name: "Bracelet / Anklet Engraving", shortDescription: "Engrave bracelets and bangles", category: "bracelet", serviceType: "engraving", basePrice: 30, priceVaries: true, turnaroundDays: "2-3" },
  
  // EARRING
  { id: "earring-post-repair", slug: "earring-post-repair", name: "Earring Post Soldering", shortDescription: "Repair or replace earring posts", category: "earring", serviceType: "soldering", basePrice: 25, priceVaries: false, turnaroundDays: "2-3" },
  { id: "earring-back-conversion", slug: "earring-back-conversion", name: "Earring Back Conversion", shortDescription: "Change earring back style", category: "earring", serviceType: "soldering", basePrice: 35, priceVaries: true, priceNote: "Per earring", turnaroundDays: "3-5" },
  
  // WATCH
  { id: "watch-battery", slug: "watch-battery", name: "Watch Battery Replacement", shortDescription: "Replace dead watch batteries", category: "watch", serviceType: "replacement", basePrice: 25, priceVaries: true, turnaroundDays: "1-2", popular: true },
  { id: "watch-crystal", slug: "watch-crystal", name: "Watch Crystal Replacement", shortDescription: "Replace scratched or cracked crystal", category: "watch", serviceType: "replacement", basePrice: 70, priceVaries: true, turnaroundDays: "5-7", popular: true },
  { id: "watch-stem-crown", slug: "watch-stem-crown", name: "Watch Stem & Crown Replacement", shortDescription: "Replace watch crown mechanism", category: "watch", serviceType: "replacement", basePrice: 70, priceVaries: true, turnaroundDays: "5-7" },
  { id: "watch-band-repair", slug: "watch-band-repair", name: "Watch Band / Strap Repair", shortDescription: "Repair or replace watch bands", category: "watch", serviceType: "replacement", basePrice: 40, priceVaries: true, turnaroundDays: "3-5" },
  { id: "watch-link-removal", slug: "watch-link-removal", name: "Watch Link Removal", shortDescription: "Shorten watch band", category: "watch", serviceType: "cleaning", basePrice: 5, priceVaries: false, turnaroundDays: "1" },
  { id: "watch-cleaning", slug: "watch-cleaning", name: "Watch Cleaning & Polishing", shortDescription: "Professional watch cleaning", category: "watch", serviceType: "cleaning", basePrice: 115, priceVaries: true, turnaroundDays: "7-14" },
  { id: "watch-overhaul", slug: "watch-overhaul", name: "Watch Overhaul Service", shortDescription: "Complete watch restoration", category: "watch", serviceType: "cleaning", basePrice: 185, priceVaries: true, turnaroundDays: "14-21", popular: true },
  { id: "watch-pressure-test", slug: "watch-pressure-test", name: "Watch Pressure Test", shortDescription: "Test water resistance", category: "watch", serviceType: "appraisal", basePrice: 165, priceVaries: false, turnaroundDays: "3-5" },
  { id: "watch-appraisal", slug: "watch-appraisal", name: "Watch Appraisal", shortDescription: "Professional watch valuation", category: "watch", serviceType: "appraisal", basePrice: 105, priceVaries: true, turnaroundDays: "5-7" },
  { id: "watch-engraving", slug: "watch-engraving", name: "Watch Engraving", shortDescription: "Engrave watch caseback", category: "watch", serviceType: "engraving", basePrice: 35, priceVaries: true, turnaroundDays: "2-3" },
  
  // CLEANING & RESTORATION
  { id: "jewelry-polishing", slug: "jewelry-polishing", name: "Jewelry Polishing", shortDescription: "Restore original shine", category: "other", serviceType: "cleaning", basePrice: 25, priceVaries: false, turnaroundDays: "1-2" },
  { id: "jewelry-spa", slug: "jewelry-spa", name: "Jewelry Spa Service", shortDescription: "Complete cleaning & inspection", category: "other", serviceType: "cleaning", basePrice: 39, priceVaries: false, turnaroundDays: "2-3", popular: true },
  { id: "gold-plating", slug: "gold-plating", name: "Gold Plating (Electroplating)", shortDescription: "Restore or add gold finish", category: "other", serviceType: "cleaning", basePrice: 55, priceVaries: true, turnaroundDays: "5-7", popular: true },
  { id: "rhodium-plating", slug: "rhodium-plating", name: "Rhodium Plating", shortDescription: "Restore white gold brightness", category: "other", serviceType: "cleaning", basePrice: 64, priceVaries: true, turnaroundDays: "3-5" },
  { id: "enamel-repair", slug: "enamel-repair", name: "Enamel Repair", shortDescription: "Repair or restore enamel", category: "other", serviceType: "cleaning", basePrice: 30, priceVaries: true, turnaroundDays: "5-7" },
  { id: "gemstone-polishing", slug: "gemstone-polishing", name: "Gemstone Polishing", shortDescription: "Polish scratched stones", category: "other", serviceType: "cleaning", basePrice: 60, priceVaries: true, turnaroundDays: "7-14" },
  
  // ENGRAVING
  { id: "ring-engraving", slug: "ring-engraving", name: "Ring Engraving", shortDescription: "Personalize your ring", category: "ring", serviceType: "engraving", basePrice: 35, priceVaries: true, turnaroundDays: "2-3", popular: true },
  { id: "hand-engraving", slug: "hand-engraving", name: "Hand Engraving", shortDescription: "Premium hand-carved engraving", category: "other", serviceType: "engraving", basePrice: 225, priceVaries: true, turnaroundDays: "7-14" },
  { id: "engraving-removal", slug: "engraving-removal", name: "Engraving Removal", shortDescription: "Remove existing engraving", category: "other", serviceType: "engraving", basePrice: 20, priceVaries: false, turnaroundDays: "2-3" },
  
  // STONES & SETTINGS
  { id: "stone-setting", slug: "stone-setting", name: "Stone Setting", shortDescription: "Set a loose stone", category: "other", serviceType: "stones", basePrice: 5, priceVaries: true, turnaroundDays: "3-5" },
  { id: "stone-replacement", slug: "stone-replacement", name: "Gemstone Replacement", shortDescription: "Source and set replacement stones", category: "other", serviceType: "stones", basePrice: 5, priceVaries: true, priceNote: "Stone cost additional", turnaroundDays: "5-10" },
  { id: "stone-tightening", slug: "stone-tightening", name: "Stone Tightening", shortDescription: "Secure loose stones", category: "other", serviceType: "stones", basePrice: 45, priceVaries: true, turnaroundDays: "3-5" },
  
  // APPRAISALS
  { id: "jewelry-appraisal", slug: "jewelry-appraisal", name: "Jewelry Appraisal", shortDescription: "Professional valuation document", category: "other", serviceType: "appraisal", basePrice: 95, priceVaries: true, turnaroundDays: "5-7" },
  { id: "metal-testing", slug: "metal-testing", name: "Metal Testing", shortDescription: "Identify metal content", category: "other", serviceType: "appraisal", basePrice: 10, priceVaries: false, turnaroundDays: "1-2" },
  
  // OTHER
  { id: "custom-order", slug: "custom-order", name: "Custom Order", shortDescription: "Special requests and quotes", category: "other", serviceType: "other", basePrice: 0, priceVaries: true, priceNote: "Quote after review", turnaroundDays: "Varies" },
  { id: "cad-rendering", slug: "cad-rendering", name: "3D Design Rendering (CAD)", shortDescription: "Computer-aided jewelry design", category: "other", serviceType: "other", basePrice: 125, priceVaries: true, turnaroundDays: "5-7" },
];

export const categories = [
  { id: "ring", label: "Rings", icon: "💍" },
  { id: "necklace", label: "Necklaces & Chains", icon: "📿" },
  { id: "bracelet", label: "Bracelets", icon: "⌚" },
  { id: "earring", label: "Earrings", icon: "✨" },
  { id: "watch", label: "Watches", icon: "⌚" },
  { id: "other", label: "Other Services", icon: "🔧" },
] as const;

export const serviceTypes = [
  { id: "sizing", label: "Sizing" },
  { id: "ring-repair", label: "Ring Repair" },
  { id: "prong", label: "Prong Repair" },
  { id: "soldering", label: "Soldering" },
  { id: "replacement", label: "Replacement Parts" },
  { id: "cleaning", label: "Cleaning & Restoration" },
  { id: "engraving", label: "Engraving" },
  { id: "stones", label: "Stones & Settings" },
  { id: "appraisal", label: "Appraisals" },
  { id: "other", label: "Other" },
] as const;

export const getPopularServices = () => repairServices.filter((s) => s.popular);

export const searchServices = (query: string) => {
  const q = query.toLowerCase();
  return repairServices.filter((s) => s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q));
};

export const getServicesByCategory = (category: string) => repairServices.filter((s) => s.category === category);
