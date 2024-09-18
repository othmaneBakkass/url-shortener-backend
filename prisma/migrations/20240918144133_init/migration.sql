-- CreateTable
CREATE TABLE "ShortLinks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "short_link" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortLinks_short_link_key" ON "ShortLinks"("short_link");
