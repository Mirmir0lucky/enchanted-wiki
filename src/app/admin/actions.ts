"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  checkCredentials,
  createSessionToken,
  requireAdmin,
} from "@/lib/auth";
import { ROOT_KEY, deleteDoc, isValidKey, keyToHref, readDoc, writeDoc } from "@/lib/content";
import { saveSettings } from "@/lib/settings";

export type FormState = { error?: string };

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!checkCredentials(username, password)) {
    redirect("/admin/login?error=1");
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

const pageSchema = z.object({
  originalKey: z.string().optional(),
  key: z
    .string()
    .trim()
    .min(1, "Enter a path for the page.")
    .max(120)
    .transform((value) => value.replace(/^\/+|\/+$/g, "").toLowerCase())
    .refine(isValidKey, "Use lowercase letters, numbers and dashes. Separate sections with /, e.g. guides/images."),
  title: z.string().trim().min(1, "Enter a title.").max(120),
  description: z.string().trim().max(300).default(""),
  order: z.coerce.number().int().min(0).max(9999).default(100),
  content: z.string().max(200_000),
});

export async function savePage(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = pageSchema.safeParse({
    originalKey: formData.get("originalKey") || undefined,
    key: formData.get("key") ?? "",
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    order: formData.get("order") ?? 100,
    content: formData.get("content") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { originalKey, key, title, description, order, content } = parsed.data;

  if (key !== originalKey && (await readDoc(key))) {
    return { error: "A page with this path already exists." };
  }

  await writeDoc(key, { title, description, order }, content);

  if (originalKey && originalKey !== key && isValidKey(originalKey)) {
    await deleteDoc(originalKey).catch(() => undefined);
  }

  revalidatePath("/", "layout");
  redirect(keyToHref(key));
}

export async function deletePage(formData: FormData) {
  await requireAdmin();

  const key = String(formData.get("key") ?? "");
  if (!isValidKey(key) || key === ROOT_KEY) {
    redirect("/admin");
  }

  await deleteDoc(key).catch(() => undefined);
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();

  await saveSettings({
    siteName: String(formData.get("siteName") ?? "").trim().slice(0, 60),
    description: String(formData.get("description") ?? "").trim().slice(0, 240),
    hoverPreviews: formData.get("hoverPreviews") === "on",
  });

  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "");
  if (/^[a-zA-Z0-9._-]+$/.test(name) && !name.includes("..")) {
    await fs.unlink(path.join(process.cwd(), "public", "uploads", name)).catch(() => undefined);
  }

  revalidatePath("/admin/media");
  redirect("/admin/media");
}
