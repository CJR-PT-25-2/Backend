-- DropForeignKey
ALTER TABLE "Comentarios_avaliacao" DROP CONSTRAINT "Comentarios_avaliacao_avaliacao_loja_id_fkey";

-- DropForeignKey
ALTER TABLE "Comentarios_avaliacao" DROP CONSTRAINT "Comentarios_avaliacao_avaliacao_produto_id_fkey";

-- AlterTable
ALTER TABLE "Comentarios_avaliacao" ALTER COLUMN "avaliacao_produto_id" DROP NOT NULL,
ALTER COLUMN "avaliacao_loja_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comentarios_avaliacao" ADD CONSTRAINT "Comentarios_avaliacao_avaliacao_produto_id_fkey" FOREIGN KEY ("avaliacao_produto_id") REFERENCES "Avaliacao_produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentarios_avaliacao" ADD CONSTRAINT "Comentarios_avaliacao_avaliacao_loja_id_fkey" FOREIGN KEY ("avaliacao_loja_id") REFERENCES "Avaliacao_loja"("id") ON DELETE SET NULL ON UPDATE CASCADE;
