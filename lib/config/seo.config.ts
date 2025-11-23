import { Metadata } from "next";
import { SiteSettings } from "./settings";

const SEO_CONFIG: Metadata = {
  title: {
    template: `%s | ${SiteSettings.name}`,
    default: "Velovs Finance",
  },
  description:
    "Velovs · Redefining finance with bold vision. Trust, prestige, and performance guiding every initiative.",
  keywords:
    "nextjs, saas, finance, velovs, economics, money, wealth, investment",
  icons: "/static/favicon.ico",
  openGraph: {
    type: "website",
    siteName: "Velovs Finance",
    locale: "en_US",
    url: "https://velovs.com",
    title: "Velovs Finance - Redefining Finance",
    description:
      "Velovs · Redefining finance with bold vision. Trust, prestige, and performance guiding every initiative.",
    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Velovs Finance - Redefining Finance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VelovsHQ",
    title: "Velovs Finance - Redefining Finance",
    description:
      "Velovs · Redefining finance with bold vision. Trust, prestige, and performance guiding every initiative.",
    images: ["/og-blog.jpg"],
  },
};

export default SEO_CONFIG;
