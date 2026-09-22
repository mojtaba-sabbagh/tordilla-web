-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "query" TEXT,
    "title" TEXT,
    "locale" TEXT,
    "referrer" TEXT,
    "referrerHost" TEXT,
    "userAgent" TEXT,
    "ip" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "sessionId" TEXT,
    "deviceType" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,
    "countryCode" TEXT,
    "region" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");
CREATE INDEX "PageView_isBot_createdAt_idx" ON "PageView"("isBot", "createdAt");
CREATE INDEX "PageView_path_idx" ON "PageView"("path");
CREATE INDEX "PageView_ip_idx" ON "PageView"("ip");
CREATE INDEX "PageView_visitorId_idx" ON "PageView"("visitorId");
CREATE INDEX "PageView_country_idx" ON "PageView"("country");

-- CreateTable
CREATE TABLE "IpLocation" (
    "ip" TEXT NOT NULL,
    "country" TEXT,
    "countryCode" TEXT,
    "region" TEXT,
    "city" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isp" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OK',
    "lookedUpAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IpLocation_pkey" PRIMARY KEY ("ip")
);

-- CreateIndex
CREATE INDEX "IpLocation_status_idx" ON "IpLocation"("status");
