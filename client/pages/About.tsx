import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChevronRight, Award, Target, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="hover:text-accent transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent font-medium">Sobre Nós</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-20 border-b border-border bg-gradient-to-br from-muted/50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre a MP Luna</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sua vitrine inteligente de ofertas. Vasculhamos a internet diariamente para selecionar as melhores oportunidades e promoções das maiores e mais confiáveis lojas do Brasil, ajudando você a economizar tempo e dinheiro em cada clique.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 border-b border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="w-14 h-14 bg-accent/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Award className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Qualidade</h3>
              <p className="text-muted-foreground">
                Selecionamos na internet com rigor para indicar apenas produtos altamente avaliados e de procedência comprovada. 
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="w-14 h-14 bg-accent-secondary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-7 h-7 text-accent-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparência</h3>
              <p className="text-muted-foreground">
                Deixamos claro nosso papel de intermediador. Você sempre sabe onde está comprando e que não cobramos taxas extras.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="w-14 h-14 bg-accent/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Humanidade</h3>
              <p className="text-muted-foreground">
                Focamos na experiência real do consumidor, criando uma comunidade que se ajuda a encontrar oportunidades verdadeiras.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="w-14 h-14 bg-accent-secondary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Target className="w-7 h-7 text-accent-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inovação</h3>
              <p className="text-muted-foreground">
                Utilizamos tecnologia e filtros inteligentes para otimizar sua busca, poupando seu tempo na caça pelo melhor preço.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-accent/5 to-transparent rounded-lg p-8 border border-accent/20">
              <h3 className="text-2xl font-bold mb-4 text-accent">Nossa Missão</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Descomplicar o consumo online através de uma curadoria inteligente, conectando pessoas às melhores ofertas das maiores lojas do país, garantindo um caminho rápido, econômico e totalmente seguro até a finalização da compra. 
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent-secondary/5 to-transparent rounded-lg p-8 border border-accent-secondary/20">
              <h3 className="text-2xl font-bold mb-4 text-accent-secondary">Nossa Visão</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Tornar-se a plataforma de recomendação de ofertas mais confiáveis e lembrada pelos consumidores brasileiros, sendo o ponto de partida definitivo para quem deseja economizar de verdade sem cair em fraudes na internet. 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-accent text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para Começar?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Explore nossos produtos premium e tenha a melhor experiência de compra
          </p>
          <Link
            to="/catalogo"
            className="inline-block px-8 py-4 bg-white text-accent rounded-lg font-semibold hover:bg-white/90 transition-all"
          >
            Explorar Catálogo
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
