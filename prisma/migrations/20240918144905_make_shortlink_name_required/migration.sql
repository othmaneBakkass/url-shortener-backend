/*
  Warnings:

  - Made the column `name` on table `ShortLinks` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShortLinks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "short_link" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ShortLinks" ("createdAt", "id", "name", "original_url", "short_link", "updatedAt") SELECT "createdAt", "id", "name", "original_url", "short_link", "updatedAt" FROM "ShortLinks";
DROP TABLE "ShortLinks";
ALTER TABLE "new_ShortLinks" RENAME TO "ShortLinks";
CREATE UNIQUE INDEX "ShortLinks_short_link_key" ON "ShortLinks"("short_link");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
