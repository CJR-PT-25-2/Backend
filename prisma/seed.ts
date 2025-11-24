import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIAS_LOJA_DADOS = [
  { nome: "Mercado" },
  { nome: "Farmacia" },
  { nome: "Brinquedo" },
  { nome: "Beleza" },
  { nome: "Moda" },
  { nome: "Casa" },
  { nome: "Eletronicos" },
  { nome: "Jogos" },
];

async function main() {
  console.log("Iniciando limpeza e semeadura... 🌱");

        await prisma.avaliacao_loja.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.loja.deleteMany();
  await prisma.categoriaLoja.deleteMany();
  await prisma.categoria.deleteMany();


  console.log("Tabelas limpas!");

       console.log("Resetando sequences...");

const sequences = await prisma.$queryRaw<Array<{ sequence_name: string }>>`
  SELECT sequence_name
  FROM information_schema.sequences
  WHERE sequence_schema = 'public';
`;

for (const seq of sequences) {
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "${seq.sequence_name}" RESTART WITH 1`);
}


        console.log("Criando categorias de loja...");
  await prisma.categoriaLoja.createMany({
    data: CATEGORIAS_LOJA_DADOS,
  });
  console.log("Categorias de loja criadas!");

        console.log("Criando categorias e subcategorias de produto...");

  const categorias = [
    {
      nome: "Mercado",
      subcategorias: [
        "Hortifruti",
        "Limpeza",
        "Padaria",
        "Adega",
        "Bebidas",
        "Açougue",
        "Mercearia",
      ],
    },
    {
      nome: "Farmacia",
      subcategorias: ["Medicamentos", "Higiene", "Cosméticos"],
    },
    {
      nome: "Brinquedo",
      subcategorias: ["Boneca", "Carrinho", "Legos", "Pelúcia"],
    },
    {
      nome: "Beleza",
      subcategorias: ["Skincare", "Maquiagem", "Cabelo", "Corpo"],
    },
    {
      nome: "Moda",
      subcategorias: ["Vestido", "Blusa", "Calça", "Sapato"],
    },
    {
      nome: "Casa",
      subcategorias: ["Cozinha", "Sala", "Quarto", "Banheiro"],
    },
    {
      nome: "Eletronicos",
      subcategorias: ["Celulares", "Notebooks", "TVs", "Acessórios"],
    },
    {
      nome: "Jogos",
      subcategorias: ["Consoles e Eletrônicos", "Tabuleiro"],
    }
  ];

  for (const categoria of categorias) {
    const categoriaPai = await prisma.categoria.create({
      data: {
        nome: categoria.nome,
        categoria_pai_id: null,
      },
    });

    for (const sub of categoria.subcategorias) {
      await prisma.categoria.create({
        data: {
          nome: sub,
          categoria_pai_id: categoriaPai.id,
        },
      });
    }
  }

  console.log("Categorias de produto criadas com sucesso! 🚀");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
