import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // ou 'bcrypt'

const prisma = new PrismaClient();

const categories = [
  {
    name: "Moda & Estilo",
    slug: "moda-acessorios",
    description: "Roupas e acessórios para todas as ocasiões",
    subcategories: [
      { name: "Relógios", slug: "relogios" },
      { name: "Bolsas", slug: "bolsas" },
      { name: "Carteiras", slug: "carteiras" },
      { name: "Óculos", slug: "oculos" },
      { name: "Joias", slug: "joias" },
      { name: "Colares", slug: "colares" },
      { name: "Correntes", slug: "correntes" },
      { name: "Pulseiras", slug: "pulseiras" },
      { name: "Anéis", slug: "aneis" },
      { name: "Brincos", slug: "brincos" },
    ],
  },
  {
    name: "Beleza & Cuidados Pessoais",
    slug: "saude-beleza",
    description: "Produtos para sua rotina de autocuidado",
    subcategories: [
      {
        name: "Cuidados Pessoais",
        slug: "cuidados-pessoais",
      },
      {
        name: "Cosméticos",
        slug: "cosmeticos",
      },
      {
        name: "Bem-estar",
        slug: "bem-estar",
      },
      {
        name: "Higiene",
        slug: "higiene",
      },
    ],
  },
  {
    name: "Casa & Decoração",
    slug: "casa",
    description: "Produtos para deixar sua casa mais bonita e funcional",
    subcategories: [
      { name: "Cozinha", slug: "cozinha" },
      { name: "Decoração", slug: "decoracao" },
      { name: "Organização", slug: "organizacao" },
      { name: "Limpeza", slug: "limpeza" },
    ],
  },
  {
    name: "Utilidades",
    slug: "utilidades",
    description: "Produtos úteis e práticos para o dia a dia",
    subcategories: [
      { name: "Organizadores", slug: "organizadores" },
      { name: "Ferramentas", slug: "ferramentas" },
    ],
  },
  {
    name: "Esporte e Fitness",
    slug: "esporte-fitness",
    description: "Produtos para treinos, esportes e rotina ativa",
    subcategories: [
      { name: "Musculação", slug: "musculacao" },
      { name: "Corrida", slug: "corrida" },
      { name: "Yoga", slug: "yoga" },
      {
        name: "Acessórios",
        slug: "acessorios-esporte",
      },
    ],
  },
  {
    name: "Tecnologia",
    slug: "tecnologia",
    description: "Gadgets e acessórios inovadores",
    subcategories: [
      { name: "Smartphones", slug: "smartphones" },
      { name: "Informática", slug: "informatica" },
      { name: "Áudio", slug: "audio" },
      { name: "Smart Home", slug: "smart-home" },
      {
        name: "Acessórios",
        slug: "acessorios-tech",
      },
    ],
  },
  {
    name: "Pet Shop",
    slug: "pet-shop",
    description: "Produtos para cuidado e bem-estar do seu pet",
    subcategories: [
      { name: "Cães", slug: "caes" },
      { name: "Gatos", slug: "gatos" },
      {
        name: "Brinquedos",
        slug: "brinquedos-pet",
      },
      {
        name: "Higiene",
        slug: "higiene-pet",
      },
    ],
  },
  {
    name: "Automotivo",
    slug: "automotivo",
    description: "Acessórios e utilidades para veículos",
    subcategories: [
      { name: "Interior", slug: "interior" },
      { name: "Exterior", slug: "exterior" },
      {
        name: "Acessórios",
        slug: "acessorios-auto",
      },
      {
        name: "Organização",
        slug: "organizacao-auto",
      },
    ],
  },
];

async function main() {
  console.log("Iniciando seed...");

  for (const categoryData of categories) {
    const { subcategories, ...category } = categoryData;

    const savedCategory = await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });

    for (const subcategory of subcategories) {
      await prisma.subcategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: savedCategory.id,
            slug: subcategory.slug,
          },
        },
        update: {
          name: subcategory.name,
        },
        create: {
          name: subcategory.name,
          slug: subcategory.slug,
          categoryId: savedCategory.id,
        },
      });
    }
  }
  // Criação do Administrador na tabela correta 'Admin' usando 'passwordHash'
  const adminEmail = process.env.ADMIN_SEED_EMAIL || "mpvertiseoficial@gmail.com";
  const rawPassword = process.env.ADMIN_SEED_PASSWORD || "MaraMpVertise2026@";

  // Gera o hash real com bcrypt que a rota de login valida
  const passwordHash = await bcrypt.hash(rawPassword, 10)

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: passwordHash,
    },
    create: {
      name: "Administrador",
      email: adminEmail,
      passwordHash: passwordHash,
    },
  });

  console.log("Usuário Admin criado/atualizado com sucesso na tabela Admin.");
  console.log("Seed concluído com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
