-- DropForeignKey
ALTER TABLE "UserTasks" DROP CONSTRAINT "UserTasks_taskId_fkey";

-- AddForeignKey
ALTER TABLE "UserTasks" ADD CONSTRAINT "UserTasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
