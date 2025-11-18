/*
  Warnings:

  - Added the required column `categoria_id_pai` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "Imagems_produto_URL" TEXT,
ADD COLUMN     "categoria_id_pai" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_categoria_id_pai_fkey" FOREIGN KEY ("categoria_id_pai") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
