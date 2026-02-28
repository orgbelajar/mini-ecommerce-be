/*
  Warnings:

  - A unique constraint covering the columns `[cartId,userId]` on the table `cart_shared_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cart_shared_users_cartId_userId_key" ON "cart_shared_users"("cartId", "userId");
