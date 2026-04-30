export type SiteLink = {
  label: string;
  href: string;
};

export const companyLinks: SiteLink[] = [
  { label: "About Silal Market", href: "/about-us" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export const quickLinks: SiteLink[] = [
  { label: "Marketplace", href: "/products" },
  { label: "Supplier Onboarding", href: "/signup/seller" },
  { label: "Buyer Onboarding", href: "/signup/buyer" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "FAQ", href: "/faq" },
];

export const siteDescription = `A UAE-made products marketplace connecting households, enterprises, retailers, Horeca buyers, farmers, fashion makers, and game creators through verified supplier onboarding, AI product checks, and secure B2C and B2B commerce.`;

export type SocialLink = {
  label: string;
  href: string;
  icon: 'facebook' | 'twitter' | 'youtube' | 'instagram';
};

export const socialLinks: SocialLink[] = [
  { label: "Silal", href: "https://www.silal.ae", icon: "facebook" },
  { label: "Silal on X", href: "https://twitter.com/silaluae", icon: "twitter" },
  { label: "Silal on YouTube", href: "https://www.youtube.com", icon: "youtube" },
  { label: "Silal on Instagram", href: "https://www.instagram.com/silaluae", icon: "instagram" },
];

const footerData = {
  companyLinks,
  quickLinks,
  siteDescription,
  socialLinks,
};

export default footerData;
