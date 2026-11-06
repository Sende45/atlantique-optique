export const siteConfig = {
  name: "Atlantique Optique",
  tagline: "Cabinet des yeux",
  description:
    "Opticien à Cocody Blockhaus, Abidjan : examen de vue, lunettes de vue, solaires et lentilles de contact. Livraison disponible.",

  logo: "https://res.cloudinary.com/lacnn0m0/image/upload/f_auto/q_auto/WhatsApp_Image_2026-10-01_at_15.37.02-removebg-preview.png",

  nav: [
    { href: "/", label: "Accueil" },
    { href: "/lunettes", label: "Nos lunettes" },
    { href: "/services", label: "Nos services" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ],

  address: {
    line: "Derrière l'Hôtel Ivoire, Blockhaus",
    district: "Cocody",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    mapsUrl: "https://maps.google.com/?q=Atlantique+Optique+Blockhaus+Cocody+Abidjan",
  },

  phones: [
    { label: "Fixe", display: "+225 25 22 01 93 62", tel: "+2252522019362" },
    { label: "Mobile", display: "+225 07 49 16 35 71", tel: "+2250749163571" },
  ],

  // À confirmer avec le client
  whatsapp: "2250749163571",
  email: "contact@atlantiqueoptique.ci",

  social: {
    facebook: "https://www.facebook.com/p/Atlantique-Optique-100071215642993/",
  },

  hoursSummary: "Lun - Ven : 08h00 – 19h00 | Sam : 08h00 – 17h00",

  // 0 = dimanche ... 6 = samedi ; heure d'Abidjan (UTC+0)
  hours: [
    { day: 1, label: "Lundi", open: "08:00", close: "19:00" },
    { day: 2, label: "Mardi", open: "08:00", close: "19:00" },
    { day: 3, label: "Mercredi", open: "08:00", close: "19:00" },
    { day: 4, label: "Jeudi", open: "08:00", close: "19:00" },
    { day: 5, label: "Vendredi", open: "08:00", close: "19:00" },
    { day: 6, label: "Samedi", open: "08:00", close: "17:00" },
    { day: 0, label: "Dimanche", open: null, close: null },
  ],

  categories: [
    { slug: "solaire", title: "Lunettes de soleil", subtitle: "Style et protection", image: "/images/cat-solaire.jpg" },
    { slug: "vue", title: "Lunettes de vue", subtitle: "Clarté au quotidien", image: "/images/cat-vue.jpg" },
    { slug: "enfant", title: "Lunettes enfants", subtitle: "Une vision pour demain", image: "/images/cat-enfant.jpg" },
    { slug: "lentille", title: "Lentilles de contact", subtitle: "Liberté de mouvement", image: "/images/cat-lentilles.jpg" },
  ],

  // À confirmer : uniquement les marques réellement vendues
  brands: ["Ray-Ban", "Gusto", "Mont Blanc", "prada", "Lacoste", "Nike", "mô", "Gucci", "Invu", "Hugo Boss", "Fendi", "Oliver people", "Elyos", "Vello", "Tom Ford", "Versace", "Guess" ],
};

export function whatsappLink(message = "Bonjour Atlantique Optique, je souhaite un renseignement.") {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function isOpenNow(date = new Date()) {
  const day = date.getUTCDay();
  const minutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  const slot = siteConfig.hours.find((h) => h.day === day);
  if (!slot?.open || !slot?.close) return false;
  const [oh, om] = slot.open.split(":").map(Number);
  const [ch, cm] = slot.close.split(":").map(Number);
  return minutes >= oh * 60 + om && minutes < ch * 60 + cm;
}