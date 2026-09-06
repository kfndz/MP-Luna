import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="hover:text-accent transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent font-medium">Política de Privacidade</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-12">Política de Privacidade - MP Luna</h1>

          <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Informações que Coletamos</h2>
              <p>
                Nós não coletamos dados financeiros ou informações sensíveis de pagamento. Por ser um catálogo de ofertas e afiliados, a MP Luna coleta apenas informações que você fornece voluntariamente ou que são geredas durante a sua navegação: 
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Dados de Contato: Nome e E-mail (caso você entre em contato conosco pelo suporte). </li>
                <li>Dados de Navegação: Informações padrão coletadas por cookies e ferramentas de análise.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Como Usamos Suas Informações</h2>
              <p>Usamos suas informações estritamente para:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Responder a suas dúvidas, mensagens, mensagens de suporte ou solicitações de contato.</li>
                <li>Analisar o desempenho da plataforma, entender quais categorias e produtos são mais acessados.</li>
                <li>Cumprir obrigações legais. </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Links de Terceiros e Redirecionamento</h2>
              <p>
                O nosso site contém links que redirecionam você para plataformas e lojas oficiais.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>A MP Luna não tem acesso, não coleta e não armazena dados que você insere nesses sites terceiros.</li>
                <li>A partir do momento em que você é redirecionado, a sua navegação e transação passam a ser regidas exclusivamente pela Política de Privacidade e pelos Termos de Uso da respectiva loja parceira onde a compra será finalizada. </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Compartilhamento de Informações </h2>
              <p>
                Nós não vendemos, alugamos ou comercializamos as suas informações pessoais com terceiros. Podemos compartilhar dados limitados apenas com: 
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Ferramentas de análise de tráfego para entender o comportamento do publico no site.</li>
                <li>Autoridades judiciais ou governamentais, estritamente quando exigido por lei.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Segurança de Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e administrativas para proteger as informações coletadas em nosso ambiente: 
              </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Criptografia SSL em todas as páginas, garantindo que sua navegação pelo nosso catálogo seja segura.</li>
                <li>Controle estrito de acesso aos e-mails enviados pelo nosso canal de contato.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies</h2>
              <p>Utilizamos cookies e tecnologias semelhantes para otimizar o funcionamento do site, lembrar suas preferências de navegação e analisar o tráfego de cliques em links de afiliados.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Seus direitos</h2>
              <p>
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Confirmar a existência do tratamento e acessar e-mails/dados que enviou para nós.</li>
                <li>Corrigir informações incompletas ou incorretas.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contato</h2>
              <p>
                Se tiver qualquer dúvida sobre esta política ou sobre como suas informações são tratadas entre em contato conosco através dos nossos canais de atendimento:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Email: privacidade@premiumstore.com</li>
                <li>Telefone: (11) 3333-3333</li>
                <li>WhatsApp: (11) 99999-9999</li>
              </ul>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-6 mt-8">
              <p className="text-sm">
                <strong>Última atualização:</strong> Julho de 2026
              </p>
              <p className="text-sm mt-2">
                Reservamos o direito de atualizar esta política periodicamente para refletir melhorias em nossa plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
