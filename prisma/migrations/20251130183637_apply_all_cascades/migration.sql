-- DropForeignKey
ALTER TABLE "Avaliacao_loja" DROP CONSTRAINT "Avaliacao_loja_loja_id_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao_loja" DROP CONSTRAINT "Avaliacao_loja_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao_produto" DROP CONSTRAINT "Avaliacao_produto_produto_id_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao_produto" DROP CONSTRAINT "Avaliacao_produto_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Comentarios_avaliacao" DROP CONSTRAINT "Comentarios_avaliacao_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "Imagens_produto" DROP CONSTRAINT "Imagens_produto_produto_id_fkey";

-- DropForeignKey
ALTER TABLE "Loja" DROP CONSTRAINT "Loja_donoId_fkey";

-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_loja_id_fkey";

-- AddForeignKey
ALTER TABLE "Loja" ADD CONSTRAINT "Loja_donoId_fkey" FOREIGN KEY ("donoId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagens_produto" ADD CONSTRAINT "Imagens_produto_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao_produto" ADD CONSTRAINT "Avaliacao_produto_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao_produto" ADD CONSTRAINT "Avaliacao_produto_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao_loja" ADD CONSTRAINT "Avaliacao_loja_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao_loja" ADD CONSTRAINT "Avaliacao_loja_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentarios_avaliacao" ADD CONSTRAINT "Comentarios_avaliacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
