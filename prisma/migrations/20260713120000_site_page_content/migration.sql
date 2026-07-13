-- CreateTable
CREATE TABLE "SitePageContent" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SitePageContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SitePageContent_pageKey_language_key" ON "SitePageContent"("pageKey", "language");
CREATE INDEX "SitePageContent_pageKey_idx" ON "SitePageContent"("pageKey");
CREATE INDEX "SitePageContent_language_idx" ON "SitePageContent"("language");
