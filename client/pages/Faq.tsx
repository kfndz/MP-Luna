import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Faq = () => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const [expandedFaq, setExpandedFaq] = useState<Record<string, boolean>>({});

 const faqData = {
  funcionamento: {
    title: 'Como Funciona',
    faqs: [
      {
        id: 'func-1',
        question: 'O que é a MP Luna?',
        answer: 'Nós somos uma plataforma independente de curadoria de ofertas. Nosso trabalho é vasculhar a internet para encontrar as melhores promoções, cupons e produtos bem avaliados das maiores lojas do Brasil, reunindo tudo em um só lugar para você economizar tempo e dinheiro.',
      },
      {
        id: 'func-2',
        question: 'Eu pago alguma taxa ou valor a mais para comprar por aqui?',
        answer: 'Não! O uso do nosso site é 100% gratuito. Você paga exatamente o preço anunciado pela loja parceira. Nós recebemos uma pequena comissão deles por indicar o produto, sem nenhum custo extra para você.',
      },
      {
        id: 'func-3',
        question: 'Como faço para comprar um produto listado?',
        answer: 'Ao encontrar o produto desejado, basta clicar no botão de compra. Você será redirecionado de forma automática e segura para o site oficial da loja parceira (como Amazon, Mercado Livre, Magalu, etc.) para concluir seu pedido.',
      },
    ],
  },
   entrega: {
    title: 'Envio & Entrega',
    faqs: [
      {
        id: 'entrega-1',
        question: 'Quem é responsável pela entrega do meu produto?',
        answer: 'Toda a logística de separação, envio e transporte é de responsabilidade exclusiva da loja parceira oficial onde você finalizou a sua compra.',
      },
      {
        id: 'entrega-2',
        question: 'Qual é o prazo de entrega e o valor do frete?',
        answer: 'Os prazos e valores de frete variam de acordo com o lojista e a sua região. Você poderá consultar a estimativa exata informando seu CEP diretamente na página de fechamento do pedido da loja parceira.',
      },
      {
        id: 'entrega-3',
        question: 'Como posso rastrear o meu pedido?',
        answer: 'Assim que o pagamento for aprovado pela loja onde você comprou, ela enviará o código de rastreamento diretamente para o seu e-mail cadastrado. Você poderá acompanhar o envio pelo painel de pedidos dessa respectiva loja.',
      },
    ],
  },
  pagamento: {
    title: 'Pagamento & Valores',
    faqs: [
      {
        id: 'pagamento-1',
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'As opções de pagamento (Cartão de Crédito, PIX, Boleto Bancário ou parcelamento) variam conforme as regras da plataforma oficial de destino onde você concluirá a compra.',
      },
      {
        id: 'pagamento-2',
        question: 'Por que o preço na loja de destino está diferente do anúncio daqui?',
        answer: 'As grandes lojas alteram seus preços e estoques frequentemente. Embora atualizemos nosso catálogo com regularidade, o valor final e válido será sempre o exibido no carrinho de compras da loja oficial parceira.',
      },
    ],
  },
  posVenda: {
    title: 'Trocas & Devoluções',
    faqs: [
      {
        id: 'pos-1',
        question: 'Como faço para solicitar uma troca ou devolução?',
        answer: 'Qualquer solicitação de cancelamento, troca, devolução ou reembolso deve ser realizada diretamente com o canal de atendimento e suporte da loja onde a transação foi concluída, respeitando as políticas internas deles.',
      },
      {
        id: 'pos-2',
        question: 'Os produtos indicados possuem garantia?',
        answer: 'Sim! Todos os produtos recomendados contam com as garantias legais de fábrica e do próprio varejista oficial que efetua a venda.',
      },
    ],
  },
  seguranca: {
    title: 'Segurança & Dados',
    faqs: [
      {
        id: 'seguranca-1',
        question: 'É seguro clicar nos links e comprar através do site?',
        answer: 'Totalmente seguro. Nós filtramos e checamos rigorosamente cada link para garantir que você seja direcionado apenas para as lojas oficiais e ambientes protegidos, eliminando riscos de páginas falsas ou golpes.',
      },
      {
        id: 'seguranca-2',
        question: 'Vocês guardam meus dados de cartão ou documentos?',
        answer: 'Não. A MP Luna não possui sistema de checkout. Suas informações cadastrais e financeiras nunca passam pelo nosso servidor, permanecendo totalmente protegidas sob os protocolos de segurança bancária das grandes redes varejistas.',
      },
    ],
  },
};

  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category],
    });
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq({
      ...expandedFaq,
      [id]: !expandedFaq[id],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="hover:text-accent transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent font-medium">FAQ</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-20 border-b border-border bg-gradient-to-br from-muted/50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Perguntas Frequentes</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Encontre respostas para as questões mais comuns sobre compra, entrega, pagamento e mais
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {Object.entries(faqData).map(([categoryKey, category]) => (
              <div key={categoryKey} className="border border-border rounded-lg overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(categoryKey)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-colors bg-card"
                >
                  <h2 className="text-lg font-semibold">{category.title}</h2>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${
                      expandedCategories[categoryKey] ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* FAQs */}
                {expandedCategories[categoryKey] && (
                  <div className="border-t border-border">
                    {category.faqs.map((faq, idx) => (
                      <div key={faq.id} className={idx > 0 ? 'border-t border-border' : ''}>
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                        >
                          <span className="font-medium">{faq.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 flex-shrink-0 transition-transform ${
                              expandedFaq[faq.id] ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {expandedFaq[faq.id] && (
                          <div className="px-6 py-4 bg-muted/30 text-muted-foreground">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 p-8 bg-gradient-to-r from-accent/10 to-accent-secondary/10 border border-accent/20 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-3">Ainda tem dúvidas?</h3>
            <p className="text-muted-foreground mb-6">
              Nosso time de suporte está pronto para ajudar!
            </p>
            <Link
              to="/contato"
              className="inline-block px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-all"
            >
              Entre em Contato
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Faq;
