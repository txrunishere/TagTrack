import { Header } from "@/components/header";
import { HomeSection } from "@/components/home-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100">
      <Header />
      <HomeSection />
    </div>
  );
}
