import {
  Award,
  Heart,
  Instagram,
  Lock,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

const footerLinkClassName =
  "text-sm text-background/70 transition-colors hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-foreground";

const categories = [
  {
    label: "Moda & Estilo",
    to: "/categoria/moda-acessorios",
  },
  {
    label: "Beleza & Cuidados Pessoais",
    to: "/categoria/saude-beleza",
  },
  {
    label: "Casa & Decoração",
    to: "/categoria/casa",
  },
  {
    label: "Utilidades",
    to: "/categoria/utilidades",
  },
  {
    label: "Esporte & Fitness",
    to: "/categoria/esporte-fitness",
  },
  {
    label: "Tecnologia & Gadgets",
    to: "/categoria/tecnologia",
  },
  {
    label: "Pet Shop",
    to: "/categoria/pet-shop",
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Informações de confiança */}
      <section
        aria-labelledby="footer-benefits-title"
        className="border-b border-background/20"
      >
        <h2 id="footer-benefits-title" className="sr-only">
          Benefícios da MP Luna
        </h2>

        <div className="container mx-auto px-4 py-10 sm:py-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <article className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-lg bg-accent p-3">
                <Lock
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <h3 className="mb-1 font-semibold">
                  Economia inteligente
                </h3>

                <p className="text-sm leading-6 text-background/70">
                  Reunimos produtos e ofertas de diferentes
                  marketplaces para facilitar sua pesquisa.
                </p>
              </div>
            </article>

            <article className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-lg bg-accent-secondary p-3">
                <Truck
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <h3 className="mb-1 font-semibold">
                  Compra no marketplace
                </h3>

                <p className="text-sm leading-6 text-background/70">
                  Você será redirecionado para a loja responsável
                  pela venda, pagamento e entrega.
                </p>
              </div>
            </article>

            <article className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-lg bg-accent p-3">
                <Award
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <h3 className="mb-1 font-semibold">
                  Curadoria de produtos
                </h3>

                <p className="text-sm leading-6 text-background/70">
                  Selecionamos produtos, promoções e achados para
                  ajudar você a comparar opções.
                </p>
              </div>
            </article>

            <article className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-lg bg-accent-secondary p-3">
                <Heart
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <h3 className="mb-1 font-semibold">
                  Dados no site parceiro
                </h3>

                <p className="text-sm leading-6 text-background/70">
                  O pagamento e os dados de compra são processados
                  diretamente pelo marketplace escolhido.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Rodapé principal */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <nav aria-labelledby="footer-company-title">
            <h2
              id="footer-company-title"
              className="mb-5 font-semibold"
            >
              Empresa
            </h2>

            <ul className="space-y-3">
              <li>
                <Link to="/sobre" className={footerLinkClassName}>
                  Sobre nós
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-categories-title">
            <h2
              id="footer-categories-title"
              className="mb-5 font-semibold"
            >
              Categorias
            </h2>

            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.to}>
                  <Link
                    to={category.to}
                    className={footerLinkClassName}
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-support-title">
            <h2
              id="footer-support-title"
              className="mb-5 font-semibold"
            >
              Suporte
            </h2>

            <ul className="space-y-3">
              <li>
                <Link to="/faq" className={footerLinkClassName}>
                  Perguntas frequentes
                </Link>
              </li>

              <li>
                <Link
                  to="/contato"
                  className={footerLinkClassName}
                >
                  Contato
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-legal-title">
            <h2
              id="footer-legal-title"
              className="mb-5 font-semibold"
            >
              Legal
            </h2>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacidade"
                  className={footerLinkClassName}
                >
                  Privacidade
                </Link>
              </li>

              <li>
                <Link
                  to="/termos"
                  className={footerLinkClassName}
                >
                  Termos de uso
                </Link>
              </li>
            </ul>
          </nav>

        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-background/20 pt-8 text-center md:flex-row md:text-left">
          <p className="text-sm text-background/70">
            © 2026 MP Luna. Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <span className="text-xs text-background/50">
              Site protegido por HTTPS
            </span>

            <span className="text-xs text-background/50">
              Compra concluída no marketplace
            </span>

            <span className="text-xs text-background/50">
              Política de privacidade
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}