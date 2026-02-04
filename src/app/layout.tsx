import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://athenastudios.com.br";
const siteName = "Athena Studios";
const siteDescription = "Criamos sites profissionais que transformam visitantes em clientes. Landing pages, sites institucionais e lojas virtuais com design premium e tecnologia de ponta.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Athena Studios | Sites Profissionais para Pequenos Negócios",
    template: "%s | Athena Studios",
  },
  description: siteDescription,
  keywords: [
    "criação de sites",
    "sites profissionais",
    "landing page",
    "site institucional",
    "loja virtual",
    "e-commerce",
    "web design",
    "desenvolvimento web",
    "sites para empresas",
    "sites para clínicas",
    "sites para escritórios",
    "Ribeirão Preto",
    "São Paulo",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: siteName,
    title: "Athena Studios | Sites Profissionais para Pequenos Negócios",
    description: siteDescription,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Athena Studios - Criação de Sites Profissionais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Athena Studios | Sites Profissionais",
    description: siteDescription,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/Favicon.png",
    apple: "/Favicon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
      description: siteDescription,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+55-16-99401-0466",
        contactType: "sales",
        availableLanguage: "Portuguese",
      },
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "pt-BR",
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#landing-pages`,
      name: "Criação de Landing Pages",
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
      description: "Páginas de alta conversão para campanhas e captação de leads.",
      offers: {
        "@type": "Offer",
        price: "1500",
        priceCurrency: "BRL",
      },
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#sites-institucionais`,
      name: "Criação de Sites Institucionais",
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
      description: "Presença digital completa para sua empresa ou consultório.",
      offers: {
        "@type": "Offer",
        price: "3500",
        priceCurrency: "BRL",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "3500",
          priceCurrency: "BRL",
          valueAddedTaxIncluded: true,
        },
      },
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#lojas-virtuais`,
      name: "Criação de Lojas Virtuais",
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
      description: "E-commerce completo para vender online 24/7.",
      offers: {
        "@type": "Offer",
        price: "5000",
        priceCurrency: "BRL",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Quanto tempo leva para criar meu site?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Landing pages e sites institucionais: 1-2 semanas. Lojas virtuais: 1-3 semanas. O prazo pode variar dependendo da fila de projetos.",
          },
        },
        {
          "@type": "Question",
          name: "Posso fazer alterações depois?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim! Pequenas alterações estão inclusas na mensalidade. Mudanças maiores são orçadas separadamente.",
          },
        },
        {
          "@type": "Question",
          name: "Vocês fazem manutenção do site?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim, a mensalidade inclui hospedagem, segurança, backups e atualizações técnicas.",
          },
        },
        {
          "@type": "Question",
          name: "Preciso pagar tudo de uma vez?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Não. Normalmente dividimos: 50% no início e 50% na entrega.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${serif.variable} ${sans.variable} antialiased`}>
        {/* Google Ads Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17915619735"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-17915619735');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
