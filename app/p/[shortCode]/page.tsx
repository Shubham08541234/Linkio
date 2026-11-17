import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import PasswordForm from "./passwordForm";

export default async function PasswordPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;

  const result = await db
    .select({
      shortCode: urls.shortCode,
      password: urls.password,
    })
    .from(urls)
    .where(eq(urls.shortCode, shortCode))
    .limit(1);

  if (!result[0] || !result[0].password) {
    console.log("Page not Found!!!👍")
    notFound();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Password Protected</h1>
          <p className="mt-2 text-sm text-gray-400">
            This link is protected. Enter the password to continue.
          </p>
        </div>

        <PasswordForm shortCode={shortCode} />
      </div>
    </main>
  );
}
