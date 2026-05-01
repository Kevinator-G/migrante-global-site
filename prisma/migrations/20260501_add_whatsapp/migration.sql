-- Add phone to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- CreateTable WhatsappLog
CREATE TABLE "WhatsappLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "phone" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "templateName" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "waMessageId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsappLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WhatsappLog_phone_idx" ON "WhatsappLog"("phone");
CREATE INDEX "WhatsappLog_userId_idx" ON "WhatsappLog"("userId");

-- AddForeignKey
ALTER TABLE "WhatsappLog" ADD CONSTRAINT "WhatsappLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
