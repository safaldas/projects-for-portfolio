-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'MANAGER');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('VIEW_USERS', 'CREATE_USER', 'EDIT_USER', 'DELETE_USER', 'VIEW_PROJECTS', 'CREATE_PROJECT', 'EDIT_PROJECT', 'DELETE_PROJECT', 'VIEW_TASKS', 'CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK', 'VIEW_CATEGORIES', 'CREATE_CATEGORY', 'EDIT_CATEGORY', 'DELETE_CATEGORY', 'VIEW_TAGS', 'CREATE_TAG', 'EDIT_TAG', 'DELETE_TAG');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL,
    "permission" "Permission" NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_permission_key" ON "RolePermission"("role", "permission");
