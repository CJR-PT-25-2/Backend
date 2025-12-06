/*
  Warnings:

  - You are about to drop the column `perfil_URL` on the `Loja` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Loja" DROP COLUMN "perfil_URL",
ADD COLUMN     "perfil_url" TEXT;
