import { BellRing, Zap, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FeatureCard } from "./feature-card";
import { AddProductForm } from "./add-product-form";

export const HomeSection = async () => {
  const user = null; // replce it with real user
  const products = []; // render real products from db

  const featureCards = [
    {
      id: 1,
      icon: BellRing,
      title: "The 'Drop' Alert",
      description:
        "Don't just watch the market command it. We'll ping your phone the millisecond your 'must-have' item hits your dream price.",
    },
    {
      id: 2,
      icon: Zap,
      title: "Zero-Lag Velocity",
      description:
        "Flash sales vanish in seconds. Our high-octane scanners outpace the crowd, giving you a head start before the 'Sold Out' sign appears.",
    },
    {
      id: 3,
      icon: ShieldCheck,
      title: "Bulletproof Trust",
      description:
        "Fake deals are everywhere. We filter the noise, tracking only verified, secure so your wallet stays as safe as your savings.",
    },
  ];

  return (
    <section className="px-4 py-10 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <div className="text-center">
          <p className="mb-1 text-xl font-bold md:mb-4 md:text-4xl">
            Precision Tracking.{" "}
            <span className="text-blue-600">Premium Savings</span>
          </p>
          <p className="font-semibold md:text-xl">
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
      </div>
    </section>
  );
};
