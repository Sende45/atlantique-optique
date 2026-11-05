import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import AuthForm from "@/components/admin/AuthForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  if ((await prisma.user.count()) === 0) redirect("/admin/setup");
  return <AuthForm mode="login" />;
}