/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Loja` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Loja` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Loja" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "banner_url" TEXT,
ADD COLUMN     "sticker_url" TEXT;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "loja_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descrição" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "estoque" INTEGER NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imagens_produto" (
    "id" SERIAL NOT NULL,
    "ordem" INTEGER NOT NULL,
    "Img_URL" TEXT NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,

    CONSTRAINT "Imagens_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria_pai_id" INTEGER,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao_produto" (
    "id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,

    CONSTRAINT "Avaliacao_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao_loja" (
    "id" SERIAL NOT NULL,
    "loja_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,

    CONSTRAINT "Avaliacao_loja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentarios_avaliacao" (
    "id" SERIAL NOT NULL,
    "avaliacao_produto_id" INTEGER NOT NULL,
    "avaliacao_loja_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,

    CONSTRAINT "Comentarios_avaliacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "Loja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagens_produto" ADD CONSTRAINT "Imagens_produto_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagens_produto" ADD CONSTRAINT "Imagens_produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_categoria_pai_id_fkey" FOREIGN KEY ("categoria_pai_id") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao_produto" ADD CONSTRAINT "Avaliacao_produto_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao_produto" ADD CONSTRAINT "Avaliacao_produto_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao_loja" ADD CONSTRAINT "Avaliacao_loja_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "Loja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao_loja" ADD CONSTRAINT "Avaliacao_loja_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentarios_avaliacao" ADD CONSTRAINT "Comentarios_avaliacao_avaliacao_produto_id_fkey" FOREIGN KEY ("avaliacao_produto_id") REFERENCES "Avaliacao_produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentarios_avaliacao" ADD CONSTRAINT "Comentarios_avaliacao_avaliacao_loja_id_fkey" FOREIGN KEY ("avaliacao_loja_id") REFERENCES "Avaliacao_loja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentarios_avaliacao" ADD CONSTRAINT "Comentarios_avaliacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
