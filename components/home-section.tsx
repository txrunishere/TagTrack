import { Zap, ShieldCheck, MailCheck, TrendingDown } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { AddProductForm } from "./add-product-form";
import { User } from "@supabase/supabase-js";

type HomeSectionProps = {
  user: User | null;
};

export const HomeSection = async ({ user }: HomeSectionProps) => {
  const products = []; // render real products from db

  const featureCards = [
    {
      id: 1,
      icon: Zap,
      title: "Zero-Lag Velocity",
      description:
        "Flash sales vanish in seconds. Our high-octane scanners outpace the crowd, giving you a head start before the 'Sold Out' sign appears.",
    },
    {
      id: 2,
      icon: ShieldCheck,
      title: "Bulletproof Trust",
      description:
        "Fake deals are everywhere. We filter the noise, tracking only verified, secure retailers so your wallet stays as safe as your savings.",
    },
    {
      id: 3,
      icon: MailCheck,
      title: "Priority Inbox Intel",
      description:
        "Never miss a beat. Get high-priority price drop alerts delivered straight to your inbox, complete with direct links to snag the deal before it expires.",
    },
  ];

  return (
    <section className="px-4 py-10 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <div className="text-center">
          <p className="mb-1 text-lg font-bold sm:text-2xl md:mb-4 md:text-4xl">
            Precision Tracking.{" "}
            <span className="text-blue-500">Premium Savings</span>
          </p>
          <p className="text-sm font-semibold sm:text-lg md:text-xl">
            Monitor every tag. Capture every price drop
          </p>
        </div>

        <AddProductForm />

        {products.length === 0 && (
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {featureCards.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        )}

        {user && products.length === 0 && (
          <section className="mt-10 rounded-lg border border-dashed p-10 md:mt-16">
            <div className="flex flex-col items-center gap-4">
              <div>
                <TrendingDown className="h-15 w-15 text-gray-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">No products yet!</p>
                <p>Add your first product above to start tracking prices!</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
};
