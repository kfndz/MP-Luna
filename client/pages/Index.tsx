import promoImg from "../public/images/grupo-whatsapp.jpeg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Lock,
  Truck,
} from "lucide-react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/catalog/ProductCard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { SectionHeader } from "@/components/catalog/SectionHeader";
import { useProducts } from "@/hooks/useProducts";
import { sortProducts } from "@/utils/productSorting";
import { WHATSAPP_GROUP_URL, WHATSAPP_PROMO_IMAGE } from "@/lib/whatsapp";

const carouselImages = [
  {
    src: "/images/hero-geral.webp",
    alt: "Vitrine inteligente da MP Vertise",
  },
  {
    src: "/images/home-image.webp",
    alt: "Seleção geral de produtos da MP Vertise",
  },
  {
    src: "/images/hero-3.webp",
    alt: "Seleção de produtos de moda e estilo",
  },
];

const categories = [
  {
    name: "Moda & Estilo",
    slug: "moda-acessorios",
    image: "/images/moda-estilo-image.webp",
    description: "Roupas, acessórios e tendências de moda",
  },
  {
    name: "Beleza & Cuidados Pessoais",
    slug: "saude-beleza",
    image: "/images/produtos-beleza-image.webp",
    description: "Maquiagem, perfumes, cosméticos e produtos para autocuidado",
  },
  {
    name: "Casa & Decoração",
    slug: "casa",
    image: "/images/casa-image.webp",
    description: "Móveis, decoração e utensílios para o seu lar",
  },
  {
    name: "Utilidades",
    slug: "utilidades",
    image: "/images/utilidades-image.webp",
    description: "Produtos úteis e práticos para o dia a dia",
  },
  {
    name: "Esporte & Fitness",
    slug: "esporte-fitness",
    image: "/images/esportes-image.webp",
    description: "Produtos para treinos, esportes e rotina ativa",
  },
  {
    name: "Saúde & Bem-estar",
    slug: "saude-beleza",
    image: "/images/saude-image.webp",
    description: "Produtos para saúde, conforto e bem-estar",
  },
  {
    name: "Tecnologia & Gadgets",
    slug: "tecnologia",
    image: "/images/tecnologia-image.webp",
    description: "Smartphones, notebooks, acessórios e gadgets",
  },
  {
    name: "Pet Shop",
    slug: "pet-shop",
    image: "/images/petshop-image.webp",
    description: "Produtos para o cuidado do seu pet",
  },
];

const faqs = [
  {
    question: "Como o site funciona?",
    answer:
      "Selecionamos e organizamos produtos e ofertas de diferentes marketplaces em um só lugar. Ao escolher um produto, você é redirecionado para concluir a compra na loja responsável.",
  },
  {
    question: "Eu pago algo a mais para comprar por aqui?",
    answer:
      "Não. A MP Vertise funciona como uma vitrine de produtos afiliados e não cobra taxas adicionais do usuário.",
  },
  {
    question: "Como funciona o envio e o rastreamento?",
    answer:
      "O envio, a entrega e o rastreamento são de responsabilidade do marketplace no qual a compra foi finalizada.",
  },
  {
    question: "Onde vejo o prazo de entrega e o frete?",
    answer:
      "Essas informações são apresentadas diretamente no marketplace responsável pela venda, antes da finalização da compra.",
  },
  {
    question: "Como solicitar troca, devolução ou reembolso?",
    answer:
      "Essas solicitações devem ser realizadas diretamente no marketplace em que o produto foi comprado, conforme as políticas da plataforma.",
  },
  {
    question: "O site processa meus dados de pagamento?",
    answer:
      "Não. Os dados de pagamento e de compra são informados diretamente no ambiente do marketplace responsável pela venda.",
  },
];

const Index = () => {
  const { products, loading, error } = useProducts();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const bestSellers = sortProducts(
    products.filter((product) => product.isBestSeller),
    "mais-vendidos",
  ).slice(0, 8);

  const homeProducts =
    bestSellers.length > 0
      ? bestSellers
      : sortProducts(products, "relevancia").slice(0, 8);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((current) =>
        current === carouselImages.length - 1 ? 0 : current + 1,
      );
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  function nextSlide() {
    setCurrentSlide((current) =>
      current === carouselImages.length - 1 ? 0 : current + 1,
    );
  }

  function previousSlide() {
    setCurrentSlide((current) =>
      current === 0 ? carouselImages.length - 1 : current - 1,
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-14 sm:py-16 md:py-24 lg:py-32">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
              <div className="animate-slide-up">
                <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                  Sua vitrine inteligente para encontrar as melhores ofertas
                </h1>

                <p className="mb-8 text-base leading-7 text-muted-foreground sm:text-lg">
                  Explore produtos cuidadosamente selecionados em diversas
                  categorias e seja direcionado para comprar com segurança nas
                  maiores lojas do Brasil.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Link
                    to="/catalogo"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3 font-semibold text-white transition hover:bg-accent/90 active:scale-[0.98]"
                  >
                    Explorar produtos
                    <ChevronRight aria-hidden="true" className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/mais-vendidos"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-foreground px-7 py-3 font-semibold text-foreground transition hover:bg-foreground hover:text-background"
                  >
                    Mais vendidos
                  </Link>
                </div>
              </div>

              {/* Carrossel */}
              <div
                className="group relative hidden md:block"
                aria-label="Destaques da MP Vertise"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                  {carouselImages.map((image, index) => (
                    <div
                      key={image.src}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentSlide
                          ? "z-10 opacity-100"
                          : "z-0 opacity-0"
                      }`}
                      aria-hidden={index !== currentSlide}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Exibir imagem anterior"
                    className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/85 p-2 text-foreground opacity-0 shadow-md transition hover:bg-background focus:opacity-100 group-hover:opacity-100"
                  >
                    <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Exibir próxima imagem"
                    className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/85 p-2 text-foreground opacity-0 shadow-md transition hover:bg-background focus:opacity-100 group-hover:opacity-100"
                  >
                    <ChevronRight aria-hidden="true" className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                    {carouselImages.map((image, index) => (
                      <button
                        key={image.src}
                        type="button"
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Exibir destaque ${index + 1}`}
                        aria-current={
                          index === currentSlide ? "true" : undefined
                        }
                        className={`h-2 rounded-full transition-all ${
                          index === currentSlide
                            ? "w-6 bg-accent"
                            : "w-2 bg-background/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-2xl bg-accent-secondary opacity-20 blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Grupo de promoções */}
        <section className="pb-4 pt-2 sm:pb-8 sm:pt-4">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="bg-muted/30 p-2 sm:p-3">
                <img
                  src={promoImg}
                  alt="Grupo de promoções da MP Vertise no WhatsApp"
                  className="mx-auto max-h-[560px] w-full rounded-2xl object-contain"
                />
              </div>

              <div className="flex flex-col items-center gap-3 px-5 py-5 text-center sm:px-8 sm:py-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                    Promoções direto no WhatsApp
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                    Entre no grupo para receber achados, cupons e ofertas selecionadas pela MP Vertise.
                  </p>
                </div>

                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:brightness-95 active:scale-[0.98]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Entrar no grupo de promoções
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="border-t border-border py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <SectionHeader
              title="Categorias destacadas"
              description="Explore nossas seleções em diferentes categorias"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={`${category.name}-${category.slug}`}
                  to={`/categoria/${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/15 to-transparent p-6">
                    <h3 className="mb-1 text-xl font-semibold text-white">
                      {category.name}
                    </h3>

                    <p className="text-sm leading-6 text-white/85">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Produtos */}
        <section className="border-t border-border py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <SectionHeader
              title="Produtos em destaque"
              description="Confira os produtos selecionados para o catálogo"
            />

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="h-[420px] animate-pulse rounded-2xl border border-border bg-muted"
                  />
                ))}
              </div>
            ) : error ? (
              <div
                role="alert"
                className="rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-10 text-center"
              >
                <h3 className="text-xl font-semibold">
                  Não foi possível carregar os produtos
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Tente novamente em alguns instantes.
                </p>
              </div>
            ) : homeProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {homeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center sm:px-8">
                <h3 className="text-xl font-semibold">Produtos em breve</h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                  O catálogo está sendo preparado. Novos produtos e ofertas
                  serão adicionados em breve.
                </p>

                <Link
                  to="/sobre"
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
                >
                  Conhecer a MP Vertise
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Por que escolher */}
        <section className="border-t border-border bg-foreground py-16 text-background md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <SectionHeader
              title="Por que escolher a MP Vertise"
              description="Organizamos produtos e oportunidades para facilitar sua pesquisa"
            />

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Curadoria inteligente",
                  description:
                    "Organizamos produtos de diferentes categorias para facilitar sua descoberta.",
                },
                {
                  title: "Pesquisa simplificada",
                  description:
                    "Você encontra diferentes opções reunidas em um catálogo claro e direto.",
                },
                {
                  title: "Redirecionamento para a loja",
                  description:
                    "A compra é concluída diretamente no marketplace responsável pela venda.",
                },
                {
                  title: "Economia de tempo",
                  description:
                    "Você evita navegar por vários sites para encontrar produtos de diferentes nichos.",
                },
              ].map((item) => (
                <article key={item.title} className="text-center">
                  <div
                    aria-hidden="true"
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-bold"
                  >
                    ✓
                  </div>

                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>

                  <p className="leading-7 text-background/70">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="border-t border-border bg-muted/30 py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <SectionHeader
              title="Nossos diferenciais"
              description="Uma experiência simples para pesquisar produtos e ofertas"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-2xl border border-border bg-card p-7 text-center transition-shadow hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                  <Lock aria-hidden="true" className="h-7 w-7 text-accent" />
                </div>

                <h3 className="mb-2 text-xl font-semibold">
                  Compra no parceiro
                </h3>

                <p className="leading-7 text-muted-foreground">
                  O pagamento e os dados da compra são processados diretamente
                  pelo marketplace escolhido.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-card p-7 text-center transition-shadow hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-secondary/10">
                  <Truck
                    aria-hidden="true"
                    className="h-7 w-7 text-accent-secondary"
                  />
                </div>

                <h3 className="mb-2 text-xl font-semibold">
                  Diferentes marketplaces
                </h3>

                <p className="leading-7 text-muted-foreground">
                  O catálogo pode reunir produtos de diferentes lojas e
                  plataformas de venda.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-card p-7 text-center transition-shadow hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                  <Award aria-hidden="true" className="h-7 w-7 text-accent" />
                </div>

                <h3 className="mb-2 text-xl font-semibold">
                  Catálogo organizado
                </h3>

                <p className="leading-7 text-muted-foreground">
                  Categorias e subcategorias ajudam você a encontrar produtos de
                  forma mais rápida.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-card p-7 text-center transition-shadow hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-secondary/10">
                  <Headphones
                    aria-hidden="true"
                    className="h-7 w-7 text-accent-secondary"
                  />
                </div>

                <h3 className="mb-2 text-xl font-semibold">
                  Navegação simples
                </h3>

                <p className="leading-7 text-muted-foreground">
                  Busca, filtros e favoritos tornam a experiência mais prática
                  em diferentes dispositivos.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border py-16 md:py-24 lg:py-32">
          <div className="container mx-auto max-w-3xl px-4">
            <SectionHeader
              title="Perguntas frequentes"
              description="Encontre respostas para suas dúvidas"
            />

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const expanded = expandedFaq === index;
                const contentId = `faq-answer-${index}`;

                return (
                  <article
                    key={faq.question}
                    className="overflow-hidden rounded-xl border border-border"
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(expanded ? null : index)}
                        aria-expanded={expanded}
                        aria-controls={contentId}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-muted sm:px-6"
                      >
                        <span className="font-semibold">{faq.question}</span>

                        <ChevronDown
                          aria-hidden="true"
                          className={`h-5 w-5 flex-shrink-0 transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </h3>

                    {expanded && (
                      <div
                        id={contentId}
                        className="border-t border-border bg-muted px-5 py-4 sm:px-6"
                      >
                        <p className="leading-7 text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
