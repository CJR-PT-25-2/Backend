/*
  Warnings:

  - You are about to drop the column `categoria` on the `Loja` table. All the data in the column will be lost.
  - Added the required column `categoriaId` to the `Loja` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loja" DROP COLUMN "categoria",
ADD COLUMN     "categoriaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CategoriaLoja" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "CategoriaLoja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaLoja_nome_key" ON "CategoriaLoja"("nome");

-- AddForeignKey
ALTER TABLE "Loja" ADD CONSTRAINT "Loja_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaLoja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
