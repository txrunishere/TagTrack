import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { LucideProps } from "lucide-react";

type FeatureCardProps = {
  feature: {
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    id: number;
    title: string;
    description: string;
  };
};

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  const Icon = feature.icon;

  return (
    <Card key={feature.id}>
      <CardContent className="flex flex-col items-center gap-2">
        <div className="rounded-md bg-blue-100 p-3">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-center">{feature.title}</CardTitle>
        <CardDescription className="text-center">
          {feature.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
