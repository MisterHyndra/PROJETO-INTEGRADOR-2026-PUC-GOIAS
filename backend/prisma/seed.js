import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config({ quiet: true });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(' Iniciando seed do banco de dados...');

  // ─── Admin User ────────────────────────────────────────────────
  const senhaAdmin = await bcrypt.hash('admin123', 12);
  await prisma.cliente.upsert({
    where: { email: 'admin@paralelo14.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@paralelo14.com',
      senhaHash: senhaAdmin,
      cpf: '000.000.000-00',
      role: 'ADMIN',
    },
  });
  console.log(' Admin criado: admin@paralelo14.com / admin123');

  // ─── Demo Customer ─────────────────────────────────────────────
  const senhaDemo = await bcrypt.hash('demo123', 12);
  await prisma.cliente.upsert({
    where: { email: 'joao@exemplo.com' },
    update: {},
    create: {
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senhaHash: senhaDemo,
      cpf: '111.222.333-44',
      role: 'CLIENTE',
    },
  });
  console.log(' Cliente demo criado: joao@exemplo.com / demo123');

  // ─── Products ──────────────────────────────────────────────────
  const count = await prisma.produto.count();
  if (count === 0) {
    await prisma.produto.createMany({
      data: [
        {
          nome: 'Alto Paraíso Natural',
          descricao:
            'Grão de altitude cultivado a 1.200m nas encostas da Chapada dos Veadeiros. Processo natural que concentra doçura de frutas maduras, chocolate ao leite e mel. Notas de jabuticaba e laranja-mel no retrogosto persistente.',
          preco: 48.9,
          estoque: 50,
          origem: 'Alto Paraíso de Goiás — GO',
          altitudeM: 1200,
          processo: 'Natural',
          torra: 'Clara',
          ativo: true,
        },
        {
          nome: 'Chapada Honey Premium',
          descricao:
            'Processo honey que equilibra a complexidade do natural com a limpeza do lavado. Cultivado nos terreiros altos de Cavalcante, este grão oferece notas de mel, pêssego e especiarias suaves com acidez cítrica balanceada.',
          preco: 56.9,
          estoque: 35,
          origem: 'Cavalcante — GO',
          altitudeM: 1350,
          processo: 'Honey',
          torra: 'Média',
          ativo: true,
        },
        {
          nome: 'Serra do Cristal Lavado',
          descricao:
            'Café de altitude processado via úmida nas nascentes da Serra do Cristal. Acidez cítrica pronunciada, corpo médio e retrogusto de caramelo dourado. Ideal para métodos de coagem filtrada.',
          preco: 52.9,
          estoque: 40,
          origem: 'Colinas do Sul — GO',
          altitudeM: 1100,
          processo: 'Lavado',
          torra: 'Clara',
          ativo: true,
        },
        {
          nome: 'Paralelo 14 Signature',
          descricao:
            'Blend exclusivo da casa: combinação de grãos do Cerrado e da Chapada selecionados pelo nosso barista chefe. Equilíbrio perfeito entre doçura, acidez e corpo encorpado. Nossa assinatura em cada xícara.',
          preco: 64.9,
          estoque: 60,
          origem: 'Chapada dos Veadeiros — GO',
          altitudeM: 1200,
          processo: 'Honey',
          torra: 'Média',
          ativo: true,
        },
        {
          nome: 'Machu Picchu Collection',
          descricao:
            'Edição limitada. Grão raro de altitude extrema colhido à mão em terrenos acima de 1.500m. Corpo pleno, complexidade aromática única com notas florais, frutas vermelhas e finalização longa de chocolate amargo.',
          preco: 89.9,
          estoque: 20,
          origem: 'Alto Paraíso de Goiás — GO',
          altitudeM: 1500,
          processo: 'Natural',
          torra: 'Clara',
          ativo: true,
        },
        {
          nome: 'Cerrado Goiano Escuro',
          descricao:
            'Torra escura para os amantes de espresso intenso. Grão do cerrado goiano com corpo denso, baixa acidez e notas profundas de cacau amargo, nozes torradas e tabaco suave. Perfeito para cappuccino.',
          preco: 42.9,
          estoque: 45,
          origem: 'Rio Verde — GO',
          altitudeM: 850,
          processo: 'Natural',
          torra: 'Escura',
          ativo: true,
        },
      ],
    });
    console.log(' 6 produtos criados com sucesso!');
  } else {
    console.log(`ℹ  Produtos já existem (${count} encontrados). Pulando seed de produtos.`);
  }

  console.log(' Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(' Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
