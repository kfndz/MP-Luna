# MP Vertise

🇺🇸 English | 🇧🇷 Português

A full-stack affiliate product discovery platform designed for the Brazilian e-commerce ecosystem, featuring a public product catalog, search, favorites, and an administrative dashboard for product management.

> **Note:** The platform targets the Brazilian market, and the application interface is currently available in Brazilian Portuguese.

---

Uma plataforma full-stack de curadoria e divulgação de produtos afiliados voltada ao mercado brasileiro, com catálogo público, busca, favoritos e painel administrativo para gerenciamento de produtos.

> **Observação:** A interface da aplicação está disponível em português (Brasil).

---

## 🌐 Live Demo | Demonstração

**Website / Site**

https://mp-vertise-chi.vercel.app/

---

# 🇺🇸 About

MP Vertise brings together selected products from multiple marketplaces into a single browsing experience.

Visitors can browse categories, search products, save favorites, and access partner marketplaces through affiliate links.

The platform does **not** process orders or payments. Purchases are completed directly on each marketplace.

---

# 🇧🇷 Sobre

A MP Vertise reúne produtos selecionados de diferentes marketplaces em uma única experiência de navegação.

Os visitantes podem explorar categorias, pesquisar produtos, salvar favoritos e acessar o marketplace parceiro por meio de links de afiliado.

A plataforma **não processa pagamentos nem pedidos**. Toda a compra é realizada diretamente no marketplace responsável.

---

# ✨ Features | Funcionalidades

* Responsive home page with featured categories
* Product catalog with search, filters and sorting
* Category and subcategory pages
* Individual product pages
* Related products
* Browser-based favorites
* Loading, error and empty states
* Protected admin dashboard
* Product management (CRUD)
* Image upload and preview
* REST API connected to PostgreSQL
* Basic SEO (robots.txt, sitemap and web manifest)
* Responsive layout for desktop, tablet and mobile

---

* Home responsiva com categorias em destaque
* Catálogo com busca, filtros e ordenação
* Páginas de categoria e subcategoria
* Página individual de produto
* Produtos relacionados
* Favoritos armazenados no navegador
* Estados de carregamento, erro e catálogo vazio
* Painel administrativo protegido
* Cadastro, edição e exclusão de produtos
* Upload e visualização de imagens
* API integrada ao banco de dados
* SEO básico, sitemap, robots.txt e web manifest
* Layout responsivo para desktop, tablet e celular

---

# 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* TanStack Query
* Radix UI
* Lucide React

### Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* Neon

### Authentication

* JWT
* bcrypt

### Development Tools

* Git
* GitHub
* GitHub Codespaces
* Vercel

---

# 🏗️ Architecture | Arquitetura

```text
User
 ↓
React
 ↓
Services
 ↓
REST API
 ↓
Prisma ORM
 ↓
PostgreSQL (Neon)
```

---

# ⚙️ Installation | Instalação

```bash
git clone https://github.com/kfndz/MP-Vertise

cd MP-Vertise

pnpm install

cp .env.example .env

pnpm prisma:generate

pnpm dev
```

---

# 📁 Project Structure | Estrutura

```text
MP-Vertise/
├── api/
├── client/
├── public/
├── server/
├── shared/
├── scripts/
├── package.json
└── vite.config.ts
```

---

# 🔐 Security | Segurança

* Protected administrative dashboard
* Password hashing with bcrypt
* JWT authentication
* Environment variables for secrets
* `.env` ignored by Git
* Administrative pages configured with `noindex`

---

* Painel administrativo protegido
* Senhas criptografadas com bcrypt
* Autenticação via JWT
* Variáveis de ambiente para credenciais
* Arquivos `.env` ignorados pelo Git
* Páginas administrativas configuradas com `noindex`

---

# 💼 Business Model | Modelo de Negócio

MP Vertise operates as an affiliate marketing platform.

Products are displayed in the catalog, and users are redirected to partner marketplaces where purchases, shipping, returns, and payments are handled.

---

A MP Vertise funciona como uma plataforma de marketing de afiliados.

Os produtos são divulgados no catálogo e o usuário é redirecionado para o marketplace parceiro, onde pagamento, entrega, troca e devolução são processados.

---

# 🚀 Roadmap

* User accounts
* Personalized recommendations
* Product comparison
* Price history
* Coupon integration
* Product reviews
* Analytics dashboard
* Multi-marketplace support

---

# 📄 License | Licença

This project is available for educational, portfolio and demonstration purposes.

Este projeto está disponível para fins de estudo, portfólio e demonstração.
