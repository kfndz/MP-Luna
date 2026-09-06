import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="hover:text-accent transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent font-medium">Termos de Uso</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-12">Termos de Uso - MP Luna </h1>

          <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Natureza do Serviço </h2>
              <p>
                A MP Luna opera estritamente como um catálogo digital independente e agregador de ofertas.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Nós não realizamos vendas diretas, não faturamos pedidos, não estocamos produtos e não somos responsáveis pela entrega física de mercadorias.</li>
                <li>Nossa função limita-se a pesquisar, selecionar e redirecionar os usuários, por meio de links de afiliados, para os ambientes seguros das grandes lojas oficiais, onde a transação comercial de fato ocorre.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Isenção de Responsabilidade sobre Preços e Estoques</h2>
              <p>
                Embora façamos o máximo de esforço para manter as promoções e valores atualizados em tempo real:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Os preços, a disponibilidade de estoque e as condições de frete/parcelamento são determinados exclusivamente pelas lojas e podem mudar sem qualquer aviso prévio.</li>
                <li>O valor válido para a compra será sempre o exigido na página de finalização do site oficial para onde você foi redirecionado. Não nos responsabilizamos por divergências de preços causadas por atualizações pendentes em nosso sistema.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Licença de Uso Limitada</h2>
              <p>
                É concedida a você uma licença limitada, não exclusiva e revogável para acessar e utilizar a nossa vitrine digital estritamente para fins pessoais e não comerciais. É expressamente proibido: 
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Reproduzir, copiar, extrair dados ou distribuir o conteúdo da plataforma sem autorização prévia.</li>
                <li>Tentar burlar os sistemas de segurança, obter acesso não autorizado ao painel administrativo ou interferir no bom funcionamento do site.</li>
                <li>Utilizar nossa marca e nossas seleções para fins comerciais de terceiros.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Links Externos e Compras em Plataformas Parceiras</h2>
              <p>
                Ao clicar em "Comprar" ou em qualquer oferta listada, você sairá do ambiente da MP Luna.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Não possuímos controle, ingerência ou responsabilidade sobre as práticas, termos, políticas de privacidade, processamento de pagamentos ou suporte técnico das lojas de destino.</li>
                <li>Qualquer problema relacionado ao fechamento do pedido, pagamento recusado, atraso na transportadora, troca ou devolução do produto deve ser tratado diretamente e exclusivamente com o atendimento ao cliente da loja oficial onde  a compra foi efetuada.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Propriedade Intelectual</h2>
              <p>
                Todo o design da interface, códigos, estrutura de curadoria, textos conceituais e a marca da MP Luna são de nossa propriedade intelectual ou devidamente licenciados. As imagens dos produtos, logos das marcas e nomes comerciais exibidos pertencem aos seus respectivos fabricantes e lojistas oficiais, sendo utilizados em nosso site estritamente para fins de identificação, divulgação e indicação de afiliados.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitação Geral de Responsabilidade</h2>
              <p>
                A MP Luna fornece o site "como está" e não oferece garantias de funcionamento ininterrupto ou livre de pequenos erros de digitação. Em nenhuma circunstância seremos responsáveis por quaisquer danos diretos, indiretos ou lucros cessantes decorrentes do uso da plataforma, de instabilidades na navegação ou de compras realizadas em sites de terceiros a partir de nossas indicações.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Alteração nos Termos</h2>
              <p>
               Reservamos o direito de atualizar e modificar estes Termos de Uso a qualquer momento, visando refletir melhorias técnicas ou mudanças em nosso modelo de agregação. O uso contínuo da plataforma após a publicação das alterações constituirá sua aceitação tácita dos novos termos.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Lei Aplicável e Foro</h2>
              <p>
                Estes termos são regidos e interpretados de acordo com as leis da República Federativa do Brasil, especificamente do Estado de Mato Grosso.
              </p>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-6 mt-8">
              <p className="text-sm">
                <strong>Última atualização:</strong> Julho de 2026
              </p>
              <p className="text-sm mt-2">
                Para questões sobre estes Termos, entre em contato: termos@premiumstore.com
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfUse;
