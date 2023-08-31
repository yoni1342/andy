-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "motherTongue" TEXT NOT NULL,
    "previousScores" JSONB NOT NULL,
    "previousTries" JSONB NOT NULL,
    "userFeedback" JSONB NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningMaterial" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "learningMaterialId" INTEGER NOT NULL,
    "recordedVoiceUrl" TEXT NOT NULL,
    "transcribedPhonemes" TEXT NOT NULL,
    "userResponses" JSONB NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "LearningMaterial" ADD CONSTRAINT "LearningMaterial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_learningMaterialId_fkey" FOREIGN KEY ("learningMaterialId") REFERENCES "LearningMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
