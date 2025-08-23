/*
  Warnings:

  - You are about to drop the column `detailedScent` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductScent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `detailedSize` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductScent" DROP CONSTRAINT "ProductScent_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductScent" DROP CONSTRAINT "ProductScent_scentId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "detailedScent",
DROP COLUMN "size",
ADD COLUMN     "detailedSize" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "customization" JSONB;

-- DropTable
DROP TABLE "ProductScent";

-- DropTable
DROP TABLE "Scent";

-- DropEnum
DROP TYPE "Size";

-- CreateTable
CREATE TABLE "Size" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSize" (
    "productId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,

    CONSTRAINT "ProductSize_pkey" PRIMARY KEY ("productId","sizeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Size_name_key" ON "Size"("name");

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
