export interface RepairService {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: "ring" | "necklace" | "bracelet" | "earring" | "watch" | "other";
  serviceType: "sizing" | "ring-repair" | "prong" | "soldering" | "replacement" | "cleaning" | "engraving" | "stones" | "appraisal" | "other";
  basePrice: number;
  qjrPrice: number;
  priceVaries: boolean;
  priceNote?: string;
  turnaroundDays: string;
  popular?: boolean;
}

export const repairServices: RepairService[] = [
  
  // ============== RING SIZING ==============
  {
    id: "ring-size-down",
    slug: "ring-sizing-down",
    name: "Ring Sizing Down",
    shortDescription: "Make your ring smaller",
    fullDescription: "Get your ring fitting just right with our seamless mail-in resizing service. Our jewelers can size down to any size, including half and quarter sizes. Works with gold, platinum, silver, and alternative metals.",
    category: "ring",
    serviceType: "sizing",
    basePrice: 40,
    qjrPrice: 45,
    priceVaries: true,
    priceNote: "Price varies by metal type and size change",
    turnaroundDays: "3-5",
    popular: true
  },
  {
    id: "ring-size-up",
    slug: "ring-sizing-up",
    name: "Ring Sizing Up",
    shortDescription: "Make your ring larger",
    fullDescription: "Get your tight rings fitting just right. Our jewelers can increase your ring up to any size with precision, including half and quarter sizes. Works with most metals.",
    category: "ring",
    serviceType: "sizing",
    basePrice: 45,
    qjrPrice: 50,
    priceVaries: true,
    priceNote: "Price varies by metal type and size change",
    turnaroundDays: "3-5",
    popular: true
  },
  {
    id: "ring-sizing-beads",
    slug: "ring-sizing-beads",
    name: "Ring Sizing Beads/Bar",
    shortDescription: "Alternative sizing for large knuckles",
    fullDescription: "Perfect for individuals with large knuckles. We solder small beads or a bar inside your ring, allowing it to fit more snugly without altering the ring's appearance.",
    category: "ring",
    serviceType: "sizing",
    basePrice: 35,
    qjrPrice: 40,
    priceVaries: false,
    turnaroundDays: "3-5"
  },

  // ============== RING REPAIR ==============
  {
    id: "ring-unsoldering",
    slug: "ring-unsoldering",
    name: "Ring Unsoldering",
    shortDescription: "Separate soldered rings",
    fullDescription: "If two or more of your rings are soldered together and you'd rather wear them independently, we'll delicately separate them so you can mix and match.",
    category: "ring",
    serviceType: "ring-repair",
    basePrice: 50,
    qjrPrice: 55,
    priceVaries: true,
    turnaroundDays: "3-5"
  },
  {
    id: "ring-soldering",
    slug: "ring-soldering",
    name: "Ring Soldering",
    shortDescription: "Join two or more rings together",
    fullDescription: "Solder your engagement ring and wedding band together to prevent slippage, improve fit, and reduce wear and tear on both rings over time.",
    category: "ring",
    serviceType: "ring-repair",
    basePrice: 55,
    qjrPrice: 62,
    priceVaries: true,
    turnaroundDays: "3-5"
  },
  {
    id: "ring-reshaping",
    slug: "ring-reshaping",
    name: "Ring Reshaping",
    shortDescription: "Fix bent or misshapen rings",
    fullDescription: "Restore your bent ring to its original circular shape using precision tools. Improves comfort, fit, and appearance without damaging the metal.",
    category: "ring",
    serviceType: "ring-repair",
    basePrice: 48,
    qjrPrice: 53,
    priceVaries: true,
    turnaroundDays: "3-5"
  },
  {
    id: "ring-shank-repair",
    slug: "ring-shank-repair",
    name: "Ring Shank Repair",
    shortDescription: "Repair thin or cracked bands",
    fullDescription: "The shank (band) can grow thin and crack with regular wear. We restore rings by soldering metal to the existing shank or replacing it entirely.",
    category: "ring",
    serviceType: "ring-repair",
    basePrice: 40,
    qjrPrice: 45,
    priceVaries: true,
    turnaroundDays: "5-7"
  },

  // ============== PRONG REPAIR ==============
  {
    id: "prong-rebuilding",
    slug: "prong-rebuilding",
    name: "Prong Rebuilding",
    shortDescription: "Replace broken prongs",
    fullDescription: "Broken prongs dramatically increase the chance of losing a stone. We add metal to restore the original structure and secure your stones.",
    category: "ring",
    serviceType: "prong",
    basePrice: 25,
    qjrPrice: 29,
    priceVaries: true,
    priceNote: "Per prong",
    turnaroundDays: "3-5"
  },
  {
    id: "prong-retipping",
    slug: "prong-retipping",
    name: "Prong Retipping",
    shortDescription: "Reinforce worn prongs",
    fullDescription: "Friction gradually wears down prongs over time. We add metal to the tips to prevent stone loss without removing your stones.",
    category: "ring",
    serviceType: "prong",
    basePrice: 25,
    qjrPrice: 29,
    priceVaries: true,
    priceNote: "Per prong",
    turnaroundDays: "3-5"
  },

  // ============== SOLDERING WORK ==============
  {
    id: "chain-repair",
    slug: "chain-repair",
    name: "Chain Repair / Soldering",
    shortDescription: "Fix broken chains",
    fullDescription: "Expert soldering to reconnect broken chain links. We match the original finish so repairs are invisible. Works with all chain types.",
    category: "necklace",
    serviceType: "soldering",
    basePrice: 25,
    qjrPrice: 30,
    priceVaries: true,
    priceNote: "Complex chains may cost more",
    turnaroundDays: "2-3",
    popular: true
  },
  {
    id: "clasp-repair",
    slug: "clasp-repair",
    name: "Clasp Repair / Replacement",
    shortDescription: "Fix or replace broken clasps",
    fullDescription: "We repair loose clasps or replace broken ones with high-quality replacements that match your piece. Includes standard clasp.",
    category: "necklace",
    serviceType: "soldering",
    basePrice: 43,
    qjrPrice: 48,
    priceVaries: true,
    priceNote: "Upgrade clasps available",
    turnaroundDays: "2-3"
  },
  {
    id: "chain-lengthening",
    slug: "chain-lengthening",
    name: "Chain Lengthening",
    shortDescription: "Add length to your chain",
    fullDescription: "We add matching links to extend your chain to the perfect length. Great for necklaces that have become too short.",
    category: "necklace",
    serviceType: "soldering",
    basePrice: 49,
    qjrPrice: 54,
    priceVaries: true,
    priceNote: "Depends on chain type and length added",
    turnaroundDays: "3-5"
  },
  {
    id: "chain-shortening",
    slug: "chain-shortening",
    name: "Chain Shortening",
    shortDescription: "Remove length from your chain",
    fullDescription: "We remove the unwanted section and reattach the clasp to your exact specified length. Works with all chain types.",
    category: "necklace",
    serviceType: "soldering",
    basePrice: 39,
    qjrPrice: 44,
    priceVaries: true,
    turnaroundDays: "2-3"
  },
  {
    id: "earring-post-repair",
    slug: "earring-post-repair",
    name: "Earring Post Soldering",
    shortDescription: "Repair or replace earring posts",
    fullDescription: "We repair, restore, or replace missing, damaged, or worn earring posts. Includes new backs if needed.",
    category: "earring",
    serviceType: "soldering",
    basePrice: 25,
    qjrPrice: 30,
    priceVaries: false,
    turnaroundDays: "2-3"
  },
  {
    id: "earring-back-conversion",
    slug: "earring-back-conversion",
    name: "Earring Back Conversion",
    shortDescription: "Change earring back style",
    fullDescription: "Convert between post, lever-back, screw-back, or clip-on styles. Perfect if you prefer more secure backings.",
    category: "earring",
    serviceType: "soldering",
    basePrice: 35,
    qjrPrice: 40,
    priceVaries: true,
    priceNote: "Per earring",
    turnaroundDays: "3-5"
  },

  // ============== REPLACEMENT PARTS ==============
  {
    id: "bail-repair",
    slug: "bail-repair",
    name: "Bail Repair / Replacement",
    shortDescription: "Fix or replace pendant bails",
    fullDescription: "The bail is the loop that attaches a pendant to the chain. We repair broken bails or add new ones to virtually any pendant.",
    category: "necklace",
    serviceType: "replacement",
    basePrice: 34,
    qjrPrice: 39,
    priceVaries: true,
    turnaroundDays: "2-3"
  },
  {
    id: "jump-ring-repair",
    slug: "jump-ring-repair",
    name: "Jump Ring Repair / Replace",
    shortDescription: "Fix or replace jump rings",
    fullDescription: "We repair or replace broken or damaged jump rings to restore the connection between your jewelry components.",
    category: "necklace",
    serviceType: "replacement",
    basePrice: 15,
    qjrPrice: 19,
    priceVaries: false,
    turnaroundDays: "1-2"
  },
  {
    id: "hinge-repair",
    slug: "hinge-repair",
    name: "Hinge Repair",
    shortDescription: "Fix broken hinges",
    fullDescription: "Repair the hinge mechanism on bracelets, bangles, or lockets. A damaged hinge can make jewelry unwearable.",
    category: "bracelet",
    serviceType: "replacement",
    basePrice: 40,
    qjrPrice: 45,
    priceVaries: true,
    turnaroundDays: "3-5"
  },
  {
    id: "watch-band-repair",
    slug: "watch-band-repair",
    name: "Watch Band / Strap Repair",
    shortDescription: "Repair or replace watch bands",
    fullDescription: "We mend or replace any watch band or strap - leather, metal, rubber, or smart watch straps.",
    category: "watch",
    serviceType: "replacement",
    basePrice: 40,
    qjrPrice: 45,
    priceVaries: true,
    turnaroundDays: "3-5"
  },
  {
    id: "watch-battery",
    slug: "watch-battery-replacement",
    name: "Watch Battery Replacement",
    shortDescription: "Replace dead watch batteries",
    fullDescription: "Quick battery replacement for most watch brands, including vintage watches. Water resistance tested after service.",
    category: "watch",
    serviceType: "replacement",
    basePrice: 25,
    qjrPrice: 30,
    priceVaries: true,
    priceNote: "Luxury brands may cost more",
    turnaroundDays: "1-2",
    popular: true
  },
  {
    id: "watch-crystal",
    slug: "watch-crystal-replacement",
    name: "Watch Crystal Replacement",
    shortDescription: "Replace scratched or cracked crystal",
    fullDescription: "We replace mineral and sapphire crystals to restore your watch face. Both materials available.",
    category: "watch",
    serviceType: "replacement",
    basePrice: 70,
    qjrPrice: 75,
    priceVaries: true,
    priceNote: "Sapphire crystals cost more",
    turnaroundDays: "5-7",
    popular: true
  },
  {
    id: "watch-stem-crown",
    slug: "watch-stem-crown-replacement",
    name: "Watch Stem & Crown Replacement",
    shortDescription: "Replace watch crown mechanism",
    fullDescription: "The crown and stem control the watch face. We replace damaged or missing components to restore functionality.",
    category: "watch",
    serviceType: "replacement",
    basePrice: 70,
    qjrPrice: 75,
    priceVaries: true,
    turnaroundDays: "5-7"
  },

  // ============== CLEANING & RESTORATION ==============
  {
    id: "jewelry-polishing",
    slug: "jewelry-polishing",
    name: "Jewelry Polishing",
    shortDescription: "Restore original shine",
    fullDescription: "Professional polishing buffs out scratches and wear, leaving your jewelry sparkling like new. Includes inspection for loose stones.",
    category: "other",
    serviceType: "cleaning",
    basePrice: 25,
    qjrPrice: 30,
    priceVaries: false,
    turnaroundDays: "1-2"
  },
  {
    id: "jewelry-spa",
    slug: "jewelry-spa",
    name: "Jewelry Spa Service",
    shortDescription: "Complete cleaning & inspection",
    fullDescription: "Our most popular maintenance package: professional cleaning, polishing, and full inspection. Prevents expensive future repairs.",
    category: "other",
    serviceType: "cleaning",
    basePrice: 39,
    qjrPrice: 44,
    priceVaries: false,
    turnaroundDays: "2-3",
    popular: true
  },
  {
    id: "gold-plating",
    slug: "gold-plating",
    name: "Gold Plating (Electroplating)",
    shortDescription: "Restore or add gold finish",
    fullDescription: "Professional electroplating in yellow, white, or rose gold. Restores worn plating or changes the color of your piece.",
    category: "other",
    serviceType: "cleaning",
    basePrice: 55,
    qjrPrice: 60,
    priceVaries: true,
    priceNote: "Based on item size",
    turnaroundDays: "5-7",
    popular: true
  },
  {
    id: "rhodium-plating",
    slug: "rhodium-plating",
    name: "Rhodium Plating",
    shortDescription: "Restore white gold brightness",
    fullDescription: "Rhodium plating restores the bright white finish on white gold jewelry. Includes polishing.",
    category: "other",
    serviceType: "cleaning",
    basePrice: 64,
    qjrPrice: 69,
    priceVaries: true,
    priceNote: "Based on item size",
    turnaroundDays: "3-5"
  },
  {
    id: "pearl-restringing",
    slug: "pearl-restringing",
    name: "Pearl / Bead Restringing",
    shortDescription: "Restring pearl or bead jewelry",
    fullDescription: "Professional restringing with silk thread and knots between each pearl to prevent damage if the string breaks.",
    category: "necklace",
    serviceType: "cleaning",
    basePrice: 12,
    qjrPrice: 15,
    priceVaries: true,
    priceNote: "Based on strand length",
    turnaroundDays: "5-7"
  },
  {
    id: "enamel-repair",
    slug: "enamel-repair",
    name: "Enamel Repair",
    shortDescription: "Repair or restore enamel",
    fullDescription: "Restore chipped or faded enamel on jewelry. We can match existing colors or apply new enamel.",
    category: "other",
    serviceType: "cleaning",
    basePrice: 30,
    qjrPrice: 34,
    priceVaries: true,
    turnaroundDays: "5-7"
  },
  {
    id: "jewelry-untangling",
    slug: "jewelry-untangling",
    name: "Jewelry Untangling",
    shortDescription: "Untangle knotted chains",
    fullDescription: "We carefully untangle even the most stubborn knots without damaging your delicate chains.",
    category: "necklace",
    serviceType: "cleaning",
    basePrice: 0,
    qjrPrice: 0,
    priceVaries: true,
    priceNote: "Free with other services, $15 standalone per knot",
    turnaroundDays: "1-2"
  },
  {
    id: "gemstone-polishing",
    slug: "gemstone-polishing",
    name: "Gemstone Polishing",
    shortDescription: "Polish scratched stones",
    fullDescription: "Professional stone polishing removes scratches from the surface of gemstones, restoring their brilliance.",
    category: "other",
    serviceType: "cleaning",
    basePrice: 60,
    qjrPrice: 65,
    priceVaries: true,
    priceNote: "Depends on stone type",
    turnaroundDays: "7-14"
  },
  {
    id: "watch-link-removal",
    slug: "watch-link-removal",
    name: "Watch Link Removal",
    shortDescription: "Shorten watch band",
    fullDescription: "We remove extra links from your watch band for the perfect fit.",
    category: "watch",
    serviceType: "cleaning",
    basePrice: 0,
    qjrPrice: 5,
    priceVaries: false,
    priceNote: "Free with other watch service",
    turnaroundDays: "1"
  },
  {
    id: "watch-cleaning",
    slug: "watch-cleaning",
    name: "Watch Cleaning & Polishing",
    shortDescription: "Professional watch cleaning",
    fullDescription: "Complete CLA (Clean, Lube, Adjust) service. Covers band and internal mechanisms for smooth operation.",
    category: "watch",
    serviceType: "cleaning",
    basePrice: 115,
    qjrPrice: 125,
    priceVaries: true,
    turnaroundDays: "7-14"
  },
  {
    id: "watch-overhaul",
    slug: "watch-overhaul",
    name: "Watch Overhaul Service",
    shortDescription: "Complete watch restoration",
    fullDescription: "Full internal inspection, cleaning, parts replacement if needed, lubrication, and adjustment to factory standards.",
    category: "watch",
    serviceType: "cleaning",
    basePrice: 185,
    qjrPrice: 195,
    priceVaries: true,
    priceNote: "Mechanical and quartz watches",
    turnaroundDays: "14-21",
    popular: true
  },

  // ============== ENGRAVING ==============
  {
    id: "ring-engraving",
    slug: "ring-engraving",
    name: "Ring Engraving",
    shortDescription: "Personalize your ring",
    fullDescription: "Laser engraving for precise, permanent inscriptions inside or outside your ring. Custom fonts and images available.",
    category: "ring",
    serviceType: "engraving",
    basePrice: 35,
    qjrPrice: 40,
    priceVaries: true,
    priceNote: "Based on character count",
    turnaroundDays: "2-3",
    popular: true
  },
  {
    id: "necklace-engraving",
    slug: "necklace-engraving",
    name: "Necklace / Pendant Engraving",
    shortDescription: "Engrave pendants and dog tags",
    fullDescription: "Personalize your necklace, pendant, or dog tag with custom text, fonts, images, or emojis.",
    category: "necklace",
    serviceType: "engraving",
    basePrice: 30,
    qjrPrice: 35,
    priceVaries: true,
    turnaroundDays: "2-3"
  },
  {
    id: "bracelet-engraving",
    slug: "bracelet-engraving",
    name: "Bracelet / Anklet Engraving",
    shortDescription: "Engrave bracelets and bangles",
    fullDescription: "Add custom engraving to bracelets, bangles, or anklets. Great for medical ID bracelets.",
    category: "bracelet",
    serviceType: "engraving",
    basePrice: 30,
    qjrPrice: 35,
    priceVaries: true,
    turnaroundDays: "2-3"
  },
  {
    id: "watch-engraving",
    slug: "watch-engraving",
    name: "Watch Engraving",
    shortDescription: "Engrave watch caseback",
    fullDescription: "Personalize watches and other unique items with custom engraving. Great for gifts.",
    category: "watch",
    serviceType: "engraving",
    basePrice: 35,
    qjrPrice: 40,
    priceVaries: true,
    turnaroundDays: "2-3"
  },
  {
    id: "hand-engraving",
    slug: "hand-engraving",
    name: "Hand Engraving",
    shortDescription: "Premium hand-carved engraving",
    fullDescription: "Unlike laser engraving, hand engraving offers depth and authenticity. Black antiquing available for contrast.",
    category: "other",
    serviceType: "engraving",
    basePrice: 225,
    qjrPrice: 250,
    priceVaries: true,
    priceNote: "Antiquing +$45",
    turnaroundDays: "7-14"
  },
  {
    id: "engraving-removal",
    slug: "engraving-removal",
    name: "Engraving Removal",
    shortDescription: "Remove existing engraving",
    fullDescription: "We can remove unwanted engravings from rings, watches, and other jewelry without damaging the piece.",
    category: "other",
    serviceType: "engraving",
    basePrice: 20,
    qjrPrice: 25,
    priceVaries: false,
    turnaroundDays: "2-3"
  },

  // ============== STONES & SETTINGS ==============
  {
    id: "stone-setting",
    slug: "stone-setting",
    name: "Stone Setting",
    shortDescription: "Set a loose stone",
    fullDescription: "We securely set your loose stone (diamond, gemstone, etc.) into your jewelry. Price is for labor only.",
    category: "other",
    serviceType: "stones",
    basePrice: 5,
    qjrPrice: 5,
    priceVaries: true,
    priceNote: "Based on stone size and setting type",
    turnaroundDays: "3-5"
  },
  {
    id: "stone-replacement",
    slug: "stone-replacement",
    name: "Gemstone Replacement",
    shortDescription: "Source and set replacement stones",
    fullDescription: "We find matching replacement stones and set them in your jewelry. Stone cost is additional.",
    category: "other",
    serviceType: "stones",
    basePrice: 5,
    qjrPrice: 5,
    priceVaries: true,
    priceNote: "Stone cost additional",
    turnaroundDays: "5-10"
  },
  {
    id: "stone-tightening",
    slug: "stone-tightening",
    name: "Stone Tightening",
    shortDescription: "Secure loose stones",
    fullDescription: "If your stones feel wobbly, we'll inspect and tighten them before they fall out. Covers up to 8 stones.",
    category: "other",
    serviceType: "stones",
    basePrice: 45,
    qjrPrice: 50,
    priceVaries: true,
    priceNote: "Additional stones extra",
    turnaroundDays: "3-5"
  },

  // ============== APPRAISALS ==============
  {
    id: "jewelry-appraisal",
    slug: "jewelry-appraisal",
    name: "Jewelry Appraisal",
    shortDescription: "Professional valuation document",
    fullDescription: "Our licensed gemologists provide an official appraisal document with estimated retail value. Essential for insurance.",
    category: "other",
    serviceType: "appraisal",
    basePrice: 95,
    qjrPrice: 105,
    priceVaries: true,
    turnaroundDays: "5-7"
  },
  {
    id: "watch-appraisal",
    slug: "watch-appraisal",
    name: "Watch Appraisal",
    shortDescription: "Professional watch valuation",
    fullDescription: "Detailed assessment of your watch's financial and historical value by our veteran watchmakers.",
    category: "watch",
    serviceType: "appraisal",
    basePrice: 105,
    qjrPrice: 115,
    priceVaries: true,
    turnaroundDays: "5-7"
  },
  {
    id: "watch-pressure-test",
    slug: "watch-pressure-test",
    name: "Watch Pressure Test",
    shortDescription: "Test water resistance",
    fullDescription: "Professional pressure test to verify your watch's seals and water resistance are working correctly.",
    category: "watch",
    serviceType: "appraisal",
    basePrice: 165,
    qjrPrice: 175,
    priceVaries: false,
    turnaroundDays: "3-5"
  },
  {
    id: "metal-testing",
    slug: "metal-testing",
    name: "Metal Testing",
    shortDescription: "Identify metal content",
    fullDescription: "Professional acid test to determine your jewelry's metal content and purity (gold karat, silver, platinum, etc.).",
    category: "other",
    serviceType: "appraisal",
    basePrice: 10,
    qjrPrice: 15,
    priceVaries: false,
    turnaroundDays: "1-2"
  },

  // ============== OTHER SERVICES ==============
  {
    id: "custom-order",
    slug: "custom-order",
    name: "Custom Order",
    shortDescription: "Special requests and quotes",
    fullDescription: "Not sure what you need? Use this for special requests, custom quotes, or anything not listed above.",
    category: "other",
    serviceType: "other",
    basePrice: 0,
    qjrPrice: 0,
    priceVaries: true,
    priceNote: "Quote provided after review",
    turnaroundDays: "Varies"
  },
  {
    id: "cad-rendering",
    slug: "3d-cad-rendering",
    name: "3D Design Rendering (CAD)",
    shortDescription: "Computer-aided jewelry design",
    fullDescription: "Get a professional 3D CAD rendering of your jewelry idea. Can be used to create a wax replica for casting.",
    category: "other",
    serviceType: "other",
    basePrice: 125,
    qjrPrice: 150,
    priceVaries: true,
    turnaroundDays: "5-7"
  },
  {
    id: "custom-estimate",
    slug: "custom-jewelry-estimate",
    name: "Custom Jewelry Estimate",
    shortDescription: "Get a quote for custom work",
    fullDescription: "Want to create or replicate a piece? Submit your idea for a free estimate on custom jewelry creation.",
    category: "other",
    serviceType: "other",
    basePrice: 0,
    qjrPrice: 10,
    priceVaries: false,
    priceNote: "Free estimate",
    turnaroundDays: "2-3"
  }
];

// ============== HELPER FUNCTIONS ==============

export const categories = [
  { id: "ring", label: "Rings", icon: "💍", description: "Sizing, repair, prongs & more" },
  { id: "necklace", label: "Necklaces & Chains", icon: "📿", description: "Chains, pendants, clasps" },
  { id: "bracelet", label: "Bracelets", icon: "⌚", description: "Repair, sizing, hinges" },
  { id: "earring", label: "Earrings", icon: "✨", description: "Posts, backs, conversions" },
  { id: "watch", label: "Watches", icon: "⌚", description: "Battery, crystal, overhaul" },
  { id: "other", label: "Other Services", icon: "🔧", description: "Plating, engraving, appraisals" },
] as const;

export const serviceTypes = [
  { id: "sizing", label: "Ring Sizing" },
  { id: "ring-repair", label: "Ring Repair" },
  { id: "prong", label: "Prong Repair" },
  { id: "soldering", label: "Soldering Work" },
  { id: "replacement", label: "Replacement Parts" },
  { id: "cleaning", label: "Cleaning & Restoration" },
  { id: "engraving", label: "Engraving" },
  { id: "stones", label: "Stones & Settings" },
  { id: "appraisal", label: "Appraisals" },
  { id: "other", label: "Other" },
] as const;

export const getServicesByCategory = (category: RepairService["category"]) =>
  repairServices.filter((s) => s.category === category);

export const getServicesByType = (serviceType: RepairService["serviceType"]) =>
  repairServices.filter((s) => s.serviceType === serviceType);

export const getServiceBySlug = (slug: string) =>
  repairServices.find((s) => s.slug === slug);

export const getPopularServices = () =>
  repairServices.filter((s) => s.popular);

export const searchServices = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return repairServices.filter(
    (s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.shortDescription.toLowerCase().includes(lowerQuery)
  );
};