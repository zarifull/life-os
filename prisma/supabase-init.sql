
CREATE TABLE IF NOT EXISTS "public"."WealthVault" (
  "id" TEXT NOT NULL,
  "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "lastUpdated" TIMESTAMP(3) NOT NULL,
  "autoSave" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "WealthVault_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."DailyBurn" (
  "id" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "category" TEXT NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DailyBurn_pkey" PRIMARY KEY ("id")
);
