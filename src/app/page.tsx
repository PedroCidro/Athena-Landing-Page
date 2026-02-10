'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Google Ads conversion tracking
const trackWhatsAppConversion = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17915619735/J1q7COmJ0fIbEJfT6t5C',
      'transaction_id': ''
    });
  }
};

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// Service icons
const LandingPageIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const InstitutionalIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  </svg>
);

const StoreIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

// Portfolio data - your real projects + conceptual projects
const projects = [
  {
    title: "Dominato Barbell Club",
    category: "Esportes & Fitness",
    description: "Landing page moderna para academia de powerlifting com design impactante.",
    image: "/dominato-barbell-club.png",
    isLongScreenshot: true,
    isConceptual: false
  },
  {
    title: "Dr. Mendes Advocacia",
    category: "Projeto Conceitual",
    description: "Site institucional sério e profissional para escritório de advocacia.",
    image: "/dr-mendes-advocacia.png",
    isLongScreenshot: true,
    isConceptual: true
  }
];

// Services data
const services = [
  {
    icon: LandingPageIcon,
    title: "Landing Pages",
    description: "Páginas de alta conversão para campanhas e captação de leads.",
    price: "R$ 1.500",
    priceNote: "Pagamento único",
    monthlyPrice: "Mensalidade: R$ 280",
    features: ["Hospedagem inclusa", "Manutenção técnica", "Design responsivo", "Otimização SEO"]
  },
  {
    icon: InstitutionalIcon,
    title: "Sites Institucionais",
    description: "Presença digital completa para sua empresa ou consultório.",
    price: "A partir de R$ 3.500",
    priceNote: "Valor do desenvolvimento",
    monthlyPrice: "Mensalidade: A partir de R$ 300",
    features: ["Hospedagem inclusa", "Manutenção técnica", "Múltiplas páginas", "Design exclusivo"]
  },
  {
    icon: StoreIcon,
    title: "Lojas Virtuais",
    description: "E-commerce completo para vender online 24/7.",
    price: "A partir de R$ 3.500",
    priceNote: "Valor do desenvolvimento",
    monthlyPrice: "Mensalidade: A partir de R$ 450",
    features: ["Hospedagem otimizada", "Manutenção prioritária", "Catálogo de produtos", "Integração de pagamentos"]
  }
];

// Process steps
const processSteps = [
  {
    number: "01",
    title: "Conversa",
    description: "Entendemos seu negócio, objetivos e necessidades."
  },
  {
    number: "02",
    title: "Proposta",
    description: "Apresentamos um orçamento claro e cronograma."
  },
  {
    number: "03",
    title: "Criação",
    description: "Desenvolvemos com aprovações em cada etapa."
  },
  {
    number: "04",
    title: "Lançamento",
    description: "Colocamos seu site no ar com suporte contínuo."
  }
];

// FAQ data - com tempos de entrega atualizados
const faqItems = [
  {
    question: "Quanto tempo leva para criar meu site?",
    answer: "Landing pages e sites institucionais: 1-2 semanas. Lojas virtuais: 1-3 semanas. O prazo pode variar dependendo da fila de projetos."
  },
  {
    question: "Posso fazer alterações depois?",
    answer: "Sim! Pequenas alterações estão inclusas na mensalidade. Mudanças maiores são orçadas separadamente."
  },
  {
    question: "E se eu não gostar do resultado?",
    answer: "Você aprova cada etapa do projeto. Se não estiver satisfeito, ajustamos até ficar perfeito."
  },
  {
    question: "Vocês fazem manutenção do site?",
    answer: "Sim, a mensalidade inclui hospedagem, segurança, backups e atualizações técnicas."
  },
  {
    question: "Preciso pagar tudo de uma vez?",
    answer: "Não. Normalmente dividimos: 50% no início e 50% na entrega."
  }
];

export default function Home() {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [fullscreenProject, setFullscreenProject] = useState<number | null>(null);
  const imageRefs = useRef<{ [key: number]: HTMLImageElement | null }>({});
  const containerRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const toggleCardExpand = (index: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const [scrollPosition, setScrollPosition] = useState<{ [key: number]: number }>({});

  const getImageTranslation = (index: number): number => {
    return -(scrollPosition[index] ?? 0);
  };

  // Use native event listener to prevent page scroll when hovering expanded cards
  useEffect(() => {
    const handleNativeWheel = (e: WheelEvent) => {
      for (const [indexStr, container] of Object.entries(containerRefs.current)) {
        const index = parseInt(indexStr);
        if (!container) continue;

        const isHovered = hoveredCard === index;
        const isExpanded = expandedCards.has(index);
        const shouldExpand = isHovered || isExpanded;

        if (shouldExpand && container.contains(e.target as Node)) {
          e.preventDefault();

          const img = imageRefs.current[index];
          if (!img) return;

          const imageHeight = img.naturalHeight * (container.clientWidth / img.naturalWidth);
          const containerHeight = container.clientHeight;
          const maxScroll = Math.max(0, imageHeight - containerHeight);

          setScrollPosition(prev => {
            const current = prev[index] ?? 0;
            const delta = e.deltaY * 0.5;
            const newPosition = Math.max(0, Math.min(maxScroll, current + delta));
            return { ...prev, [index]: newPosition };
          });
          return;
        }
      }
    };

    window.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleNativeWheel);
  }, [hoveredCard, expandedCards]);

  const whatsappNumber = "5516994010466";
  const whatsappMessage = encodeURIComponent("Olá! Vi o site da Athena Studios e gostaria de saber mais sobre o serviço de criação de sites.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Scroll animations
  const portfolioRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const [portfolioVisible, setPortfolioVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);
  const [servicesVisible, setServicesVisible] = useState(false);
  const [faqVisible, setFaqVisible] = useState(false);

  // Parallax effect for hero background
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ESC key to close fullscreen modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === portfolioRef.current) setPortfolioVisible(true);
            if (entry.target === aboutRef.current) setAboutVisible(true);
            if (entry.target === processRef.current) setProcessVisible(true);
            if (entry.target === servicesRef.current) setServicesVisible(true);
            if (entry.target === faqRef.current) setFaqVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (portfolioRef.current) observer.observe(portfolioRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (processRef.current) observer.observe(processRef.current);
    if (servicesRef.current) observer.observe(servicesRef.current);
    if (faqRef.current) observer.observe(faqRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Global Watermark Background with Parallax */}
      <div
        className="fixed inset-0 opacity-[0.18] pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/background1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translateY(${scrollY * 0.05}px)`
        }}
      />

      {/* Navigation */}
      <header>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-md border-b border-gold/10" role="navigation" aria-label="Menu principal">
          <div className="max-w-6xl mx-auto px-6 py-1 flex items-center justify-between">
            <a href="#" className="flex items-center gap-0 group" aria-label="Athena Studios - Início">
              <Image
                src="/logo-icon.png"
                alt="Athena Studios - Agência de criação de sites profissionais"
                width={76}
                height={76}
                className="transition-transform group-hover:scale-105"
                priority
              />
              <Image
                src="/athena_name.png"
                alt="Athena"
                width={90}
                height={22}
                className="transition-transform group-hover:scale-110"
                priority
              />
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="#quem-somos" className="text-sm text-charcoal-light hover:text-charcoal transition-colors">Quem Somos</a>
              <a href="#portfolio" className="text-sm text-charcoal-light hover:text-charcoal transition-colors">Portfólio</a>
              <a href="#servicos" className="text-sm text-charcoal-light hover:text-charcoal transition-colors">Serviços</a>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackWhatsAppConversion}
              className="flex items-center gap-1 text-white px-7 py-3.5 rounded-full text-base font-medium transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: '#909a87' }}
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Conversar</span>
            </a>
          </div>
        </nav>
      </header>

      <main>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-20 px-6 greek-pattern relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-cream-dark/80 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-gold/20">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
              <span className="text-sm text-charcoal-light">Sites profissionais para pequenos negócios</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-5xl md:text-7xl font-semibold text-charcoal leading-tight mb-6">
              Seu negócio merece um{' '}
              <span className="text-gold">site à altura</span>
            </h1>

            <p className="text-lg md:text-xl text-charcoal-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Criamos sites profissionais que transformam visitantes em clientes —
              com atendimento direto e sem terceirizações.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackWhatsAppConversion}
                className="flex items-center gap-3 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: '#909a87' }}
              >
                <WhatsAppIcon className="w-5 h-5" />
                Solicitar Orçamento
              </a>
              <a
                href="#portfolio"
                className="flex items-center gap-2 text-charcoal-light hover:text-charcoal px-8 py-4 transition-colors"
              >
                Ver Portfólio
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* About Section - Quem Somos */}
        <section id="quem-somos" className="py-24 px-6 bg-cream-dark">
          <div
            ref={aboutRef}
            className={`max-w-4xl mx-auto text-center transition-[opacity,transform] duration-700 ease-out ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">Quem Somos</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal mb-8">
              Desenvolvedores que entendem de negócios
            </h2>
            <p className="text-charcoal-light text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              Somos um estúdio de desenvolvimento web formado por desenvolvedores apaixonados
              por criar experiências digitais que envolvem seus visitantes e os transformam em clientes.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-cream p-6 rounded-2xl border border-gold/10">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">Tecnologia Atual</h3>
                <p className="text-charcoal-light text-sm">Next.js, React e TypeScript — as mesmas tecnologias usadas por grandes empresas.</p>
              </div>
              <div className="bg-cream p-6 rounded-2xl border border-gold/10">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">Atendimento Personalizado</h3>
                <p className="text-charcoal-light text-sm">Acompanhamento próximo em todas as etapas do projeto.</p>
              </div>
              <div className="bg-cream p-6 rounded-2xl border border-gold/10">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">Compromisso Total</h3>
                <p className="text-charcoal-light text-sm">Cada projeto é tratado como único — sua satisfação é nossa prioridade.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section - Como Trabalhamos */}
        <section className="py-24 px-6">
          <div
            ref={processRef}
            className={`max-w-5xl mx-auto transition-[opacity,transform] duration-700 ease-out ${processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <div className="text-center mb-16">
              <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">Como Trabalhamos</p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal">
                Do primeiro contato ao lançamento
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gold/30">
                    <span className="font-serif text-2xl font-bold text-gold">{step.number}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">{step.title}</h3>
                  <p className="text-charcoal-light text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-24 px-6 bg-cream-dark">
          <div
            ref={portfolioRef}
            className={`max-w-6xl mx-auto rounded-3xl p-10 md:p-14 transition-[opacity,transform] duration-700 ease-out ${portfolioVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-16'
              }`}
            style={{
              backgroundColor: 'rgba(217, 181, 150, 0.08)',
              border: '1px solid rgba(217, 181, 150, 0.2)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="text-center mb-16">
              <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">Portfólio</p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal">
                Nossos Projetos
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
              {projects.map((project, index) => {
                const isExpanded = expandedCards.has(index);
                const isHovered = hoveredCard === index;
                const shouldExpand = isExpanded || isHovered;

                return (
                  <div
                    key={index}
                    className={`bg-cream rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-[border-color,box-shadow] duration-300 hover:shadow-xl hover:shadow-gold/5 ${project.isConceptual ? 'cursor-pointer' : ''}`}
                    onClick={() => project.isConceptual && setFullscreenProject(index)}
                  >
                    {/* Project Image with Waterfall Scroll Effect */}
                    {project.isLongScreenshot && project.image ? (
                      <div
                        ref={(el) => { containerRefs.current[index] = el; }}
                        className={`relative overflow-hidden cursor-pointer transition-all duration-500 ease-out scrollbar-hide ${shouldExpand ? 'h-[75vh]' : 'h-64'}`}
                        onClick={() => toggleCardExpand(index)}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => {
                          setHoveredCard(null);
                          setScrollPosition(prev => ({ ...prev, [index]: 0 }));
                        }}
                      >
                        <img
                          ref={(el) => { imageRefs.current[index] = el; }}
                          src={project.image}
                          alt={project.title}
                          className="w-full h-auto object-cover object-top transition-transform duration-150 ease-out"
                          style={{
                            transform: shouldExpand ? `translateY(${getImageTranslation(index)}px)` : 'translateY(0)'
                          }}
                          onLoad={() => setImageLoaded(prev => ({ ...prev, [index]: true }))}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cream via-cream/80 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-cream-dark to-cream">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                              </svg>
                            </div>
                            <span className="text-charcoal-light/50 text-sm">Em desenvolvimento</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Project Info */}
                    <div className="p-6">
                      <p className={`text-xs font-medium tracking-widest uppercase mb-2 ${project.isConceptual ? 'text-charcoal-light' : 'text-gold'}`}>
                        {project.category}
                      </p>
                      <h3 className="font-serif text-2xl font-semibold text-charcoal mb-2">
                        {project.title}
                      </h3>
                      <p className="text-charcoal-light leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* CTA Card - O próximo pode ser o seu */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackWhatsAppConversion}
                className="bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl overflow-hidden border-2 border-dashed border-gold/40 hover:border-gold transition-all duration-300 hover:shadow-xl hover:shadow-gold/10 flex flex-col items-center justify-center min-h-[300px] group"
              >
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-charcoal mb-3">
                    O próximo pode ser o seu!
                  </h3>
                  <p className="text-charcoal-light mb-6">
                    Vamos criar algo incrível juntos?
                  </p>
                  <span className="inline-flex items-center gap-2 text-gold font-medium group-hover:gap-3 transition-all">
                    Começar agora
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicos" className="py-24 px-6">
          <div
            ref={servicesRef}
            className={`max-w-6xl mx-auto transition-[opacity,transform] duration-700 ease-out ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
          >
            <div className="text-center mb-16">
              <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">Nossos Serviços</p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal mb-6">
                Soluções para cada necessidade
              </h2>
              <p className="text-charcoal-light text-lg max-w-2xl mx-auto">
                De landing pages a lojas virtuais, criamos a presença digital ideal para o seu negócio.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-cream-dark rounded-2xl p-8 border border-gold/10 hover:border-gold/30 transition-all duration-300 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6 text-gold">
                    <service.icon />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-charcoal mb-3">{service.title}</h3>
                  <p className="text-charcoal-light mb-6">{service.description}</p>

                  <div className="mb-6">
                    <p className="font-serif text-3xl font-bold text-gold">{service.price}</p>
                    <p className="text-charcoal-light text-xs uppercase tracking-wide mb-2">{service.priceNote}</p>
                    {/* @ts-ignore */}
                    <div className="inline-block bg-gold/10 px-3 py-1 rounded-full">
                      {/* @ts-ignore */}
                      <p className="text-gold text-sm font-medium">{service.monthlyPrice}</p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-charcoal-light text-sm">
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackWhatsAppConversion}
                    className="mt-8 w-full flex items-center justify-center gap-2 bg-charcoal text-cream py-3 rounded-xl font-medium hover:bg-charcoal-light transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Solicitar Orçamento
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section id="sobre" className="py-24 px-6 bg-cream-dark">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">Por que nós</p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal mb-6">
                Qualidade técnica com atendimento humano
              </h2>
              <p className="text-charcoal-light text-lg leading-relaxed max-w-2xl mx-auto">
                Combinamos conhecimento técnico de ponta com a dedicação de quem está
                construindo sua reputação — cada projeto é tratado como se fosse o único.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Design premium com performance otimizada",
                "Tecnologia usada por empresas como Netflix e Nubank",
                "Revisões até sua aprovação",
                "Suporte contínuo via WhatsApp"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-cream p-4 rounded-xl border border-gold/10">
                  <CheckIcon />
                  <span className="text-charcoal">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* FAQ Section */}
        <section className="py-24 px-6" ref={faqRef}>
          <div className="max-w-3xl mx-auto">
            <div className={`text-center mb-16 transition-[opacity,transform] duration-700 ease-out ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">Dúvidas Frequentes</p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal">
                Perguntas e Respostas
              </h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={`bg-cream-dark rounded-2xl border border-gold/10 overflow-hidden transition-[opacity,transform] duration-500 ease-out ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: faqVisible ? `${index * 100}ms` : '0ms' }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-semibold text-charcoal">{item.question}</span>
                    <svg
                      className={`w-5 h-5 text-gold transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: expandedFaq === index ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6">
                        <p className="text-charcoal-light leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 greek-pattern relative bg-cream-dark">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <Image
              src="/logo.png"
              alt="Athena Studios"
              width={280}
              height={280}
              className="mx-auto mb-8"
            />
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal mb-6">
              Pronto para começar?
            </h2>
            <p className="text-charcoal-light text-lg mb-10">
              Mande uma mensagem e vamos conversar sobre o seu projeto.
              Respondemos em até 2 horas durante horário comercial.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackWhatsAppConversion}
              className="inline-flex items-center gap-3 text-white px-10 py-5 rounded-full text-xl font-medium transition-all hover:scale-105 shadow-xl"
              style={{ backgroundColor: '#909a87' }}
            >
              <WhatsAppIcon className="w-6 h-6" />
              Falar pelo WhatsApp
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-gold/10 bg-cream/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Image
                src="/logo-icon.png"
                alt="Athena Studios - Agência de criação de sites profissionais"
                width={64}
                height={64}
              />
              <span className="font-serif text-2xl font-semibold text-charcoal tracking-wide">Athena Studios</span>
            </div>
            <p className="text-charcoal-light text-sm">
              {new Date().getFullYear()} Athena Studios
            </p>
          </div>
        </footer>
      </main>

      {/* Floating WhatsApp Button (Mobile) */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackWhatsAppConversion}
        className="fixed bottom-6 right-6 md:hidden text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50"
        style={{ backgroundColor: '#909a87' }}
        aria-label="Conversar no WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>

      {/* Fullscreen Modal for Conceptual Projects */}
      {fullscreenProject !== null && projects[fullscreenProject] && (
        <div
          className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setFullscreenProject(null)}
        >
          <button
            className="absolute top-6 right-6 text-cream/80 hover:text-cream transition-colors z-[101]"
            onClick={() => setFullscreenProject(null)}
            aria-label="Fechar"
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={projects[fullscreenProject].image || ''}
              alt={projects[fullscreenProject].title}
              className="w-full h-auto"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <p className="text-cream font-serif text-xl font-semibold">
              {projects[fullscreenProject].title}
            </p>
            <p className="text-cream/60 text-sm mt-1">
              Clique fora ou pressione ESC para fechar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
