/*
  Warnings:

  - You are about to drop the column `foto__perfil_URL` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "foto__perfil_URL",
ADD COLUMN     "foto_perfil_URL" TEXT;
