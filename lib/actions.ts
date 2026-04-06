"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}
