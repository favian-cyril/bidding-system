-- CreateTable
CREATE TABLE "Collection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "stocks" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "collection_id" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Bid_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bid_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
