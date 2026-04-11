import { Header } from "@/components/header";
import { HomeSection } from "@/components/home-section";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100">
      <Header user={user} />
      <HomeSection user={user} />
      <p className="text-center text-neutral-400">Made by TARUN with ❤️</p>
    </div>
  );
}
