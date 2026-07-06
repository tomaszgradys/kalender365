import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";
import { generateOnePost } from "@/lib/blogGen";

export const runtime = "nodejs";
export const maxDuration = 300;

// Ręczne wygenerowanie wpisu z panelu (tylko admin). Publikuje od razu (dziś).
export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const result = await generateOnePost();
  if (result.ok) {
    revalidatePath("/blog");
    revalidatePath(`/blog/${result.slug}`);
    revalidatePath("/");
  }
  return NextResponse.json(result);
}
