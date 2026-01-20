'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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

// Portfolio data - your real projects
const projects = [
  {
    title: "Dominato Barbell Club",
    category: "Esportes & Fitness",
    description: "Landing page moderna para academia de powerlifting com design impactante.",
    image: "/dominato-barbell-club.png",
    isLongScreenshot: true
  }
];

export default function Home() {
  const [activeProject, setActiveProject] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});
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
      // Find which container the wheel event is on
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

  const whatsappNumber = "16994010466"; // Replace with your number
  const whatsappMessage = encodeURIComponent("Olá! Vi o site da Athena Studios e gostaria de saber mais sobre o serviço de criação de sites.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Scroll animation for portfolio section
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [portfolioVisible, setPortfolioVisible] = useState(false);

  // Parallax effect for hero background
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPortfolioVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (portfolioRef.current) {
      observer.observe(portfolioRef.current);
    }

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-6xl mx-auto px-6 py-1 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <img
              src="/logo-icon.png"
              alt="Athena Studios"
              className="h-19 w-auto transition-transform group-hover:scale-105"
            />
            <span className="font-serif text-3xl font-semibold text-charcoal tracking-wide">Athena</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#portfolio" className="text-sm text-charcoal-light hover:text-charcoal transition-colors">Portfólio</a>
            <a href="#sobre" className="text-sm text-charcoal-light hover:text-charcoal transition-colors">Sobre</a>
            <a href="#preco" className="text-sm text-charcoal-light hover:text-charcoal transition-colors">Investimento</a>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white px-7 py-3.5 rounded-full text-base font-medium transition-colors"
            style={{ backgroundColor: '#909a87' }}
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Conversar</span>
          </a>
        </div>
      </nav>

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
            Criamos sites profissionais que transformam visitantes em clientes.
            Cada detalhe é pensado para refletir a personalidade única da sua marca.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#909a87' }} //b0d3b3
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
              Projetos Recentes
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {projects.map((project, index) => {
              const isExpanded = expandedCards.has(index);
              const isHovered = hoveredCard === index;
              const shouldExpand = isExpanded || isHovered;

              return (
                <div
                  key={index}
                  className="bg-cream rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-[border-color,box-shadow] duration-300 hover:shadow-xl hover:shadow-gold/5"
                >
                  {/* Project Image with Waterfall Scroll Effect */}
                  {project.isLongScreenshot ? (
                    <div
                      ref={(el) => { containerRefs.current[index] = el; }}
                      className={`relative overflow-hidden cursor-pointer transition-all duration-500 ease-out scrollbar-hide ${shouldExpand ? 'h-[75vh]' : 'h-96'
                        }`}
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
                      {/* Gradient overlay at bottom */}
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
                        <span className="text-charcoal-light/50 text-sm">Screenshot do projeto</span>
                      )}
                    </div>
                  )}

                  {/* Project Info */}
                  <div className="p-6">
                    <p className="text-gold text-xs font-medium tracking-widest uppercase mb-2">
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
          </div>
        </div>
      </section>

      {/* About / Why Us Section */}
      <section id="sobre" className="py-24 px-6">
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

          <div className="flex flex-wrap justify-center gap-6">
            {[
              "Design responsivo para todos os dispositivos",
              "Otimizado para Google (SEO)",
              "Alterações eventuais inclusas",
              "Suporte direto via WhatsApp",
              "Entrega rápida e pontual"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-cream-dark p-4 rounded-xl">
                <CheckIcon />
                <span className="text-charcoal">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="preco" className="py-24 px-6 bg-charcoal text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">Investimento</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
            Simples e transparente
          </h2>
          <p className="text-cream/70 text-lg mb-12 max-w-2xl mx-auto">
            Sem surpresas, sem taxas escondidas. Você sabe exatamente o que está pagando.
          </p>

          <div className="bg-cream/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-cream/10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Setup Fee */}
              <div className="text-center">
                <p className="text-cream/50 text-sm uppercase tracking-wider mb-2">Criação do Site</p>
                <p className="font-serif text-5xl md:text-6xl font-bold text-cream">
                  R$ 1.500
                </p>
                <p className="text-cream/50 text-sm mt-2">pagamento único</p>
              </div>

              <div className="hidden md:block w-px h-24 bg-cream/20"></div>
              <div className="md:hidden w-24 h-px bg-cream/20"></div>

              {/* Monthly Fee */}
              <div className="text-center">
                <p className="text-cream/50 text-sm uppercase tracking-wider mb-2">Hospedagem + Manutenção</p>
                <p className="font-serif text-5xl md:text-6xl font-bold text-gold">
                  R$ 280
                </p>
                <p className="text-cream/50 text-sm mt-2">por mês</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-cream/10">
              <p className="text-cream/70 mb-6">Inclui: domínio, hospedagem, SSL, atualizações de segurança e pequenas alterações</p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gold text-charcoal px-8 py-4 rounded-full text-lg font-semibold hover:bg-gold-light transition-all hover:scale-105"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Quero meu site
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 greek-pattern relative">
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
            className="inline-flex items-center gap-3 text-white px-10 py-5 rounded-full text-xl font-medium transition-all hover:scale-105 shadow-xl"
            style={{ backgroundColor: '#909a87' }}
          >
            <WhatsAppIcon className="w-6 h-6" />
            Falar pelo WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gold/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <img
              src="/logo-icon.png"
              alt="Athena Studios"
              className="h-16 w-auto"
            />
            <span className="font-serif text-2xl font-semibold text-charcoal tracking-wide">Athena Studios</span>
          </div>
          <p className="text-charcoal-light text-sm">
            {new Date().getFullYear()} Athena Studios
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Button (Mobile) */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:hidden text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50"
        style={{ backgroundColor: '#909a87' }}
        aria-label="Conversar no WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>
    </div>
  );
}
