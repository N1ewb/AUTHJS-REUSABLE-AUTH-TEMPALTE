-- Drop old User fields
ALTER TABLE "User" DROP COLUMN IF EXISTS "instructorId";
ALTER TABLE "User" DROP COLUMN IF EXISTS "inviteCode";

-- Create new StudentInstructor table
CREATE TABLE "StudentInstructor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    CONSTRAINT "StudentInstructor_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint
CREATE UNIQUE INDEX "StudentInstructor_studentId_instructorId_key" ON "StudentInstructor"("studentId", "instructorId");

-- Add foreign keys
ALTER TABLE "StudentInstructor" ADD CONSTRAINT "StudentInstructor_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentInstructor" ADD CONSTRAINT "StudentInstructor_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
