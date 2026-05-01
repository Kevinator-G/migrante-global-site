-- CreateTable SocialPost
CREATE TABLE "SocialPost" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "caption" TEXT,
    "script" TEXT,
    "hashtags" TEXT[],
    "platformId" TEXT,
    "platformUrl" TEXT,
    "error" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialPost_platform_status_idx" ON "SocialPost"("platform", "status");

-- CreateIndex
CREATE INDEX "SocialPost_blogPostId_idx" ON "SocialPost"("blogPostId");

-- AddForeignKey
ALTER TABLE "SocialPost" ADD CONSTRAINT "SocialPost_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
