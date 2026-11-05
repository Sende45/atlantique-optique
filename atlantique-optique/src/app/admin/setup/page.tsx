import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AuthForm from "@/components/admin/AuthForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const count = await prisma.user.count();
  if (count > 0) redirect("/admin/login");
  return <AuthForm mode="setup" />;
}