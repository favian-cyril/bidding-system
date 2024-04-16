/*
  Warnings:

  - You are about to alter the column `price` on the `Bid` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "collection_id" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "Bid_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bid_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bid" ("collection_id", "id", "price", "status", "user_id") SELECT "collection_id", "id", "price", "status", "user_id" FROM "Bid";
DROP TABLE "Bid";
ALTER TABLE "new_Bid" RENAME TO "Bid";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
