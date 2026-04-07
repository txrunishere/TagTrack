"use client";

import { deleteProduct } from "@/lib/actions";
import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { PriceChart } from "./price-chart";

export const ProductCard = ({ product }: { product: any }) => {
  const [showPriceChart, setShowPriceChart] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleShowChartChange = () => setShowPriceChart((prev) => !prev);

  const handleDeleteProduct = async () => {
    setDeleting(true);

    try {
      const result = await deleteProduct(product.id);

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Product deleted successfully!");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex gap-4">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={`${product.name} Image`}
              width={100}
              height={100}
              unoptimized
            />
          )}

          <div className="flex-1 space-y-2">
            <h3 className="line-clamp-2 font-semibold text-gray-800">
              {product.name}
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                {product.currency} {product.current_price}
              </span>

              <Badge variant={"secondary"}>
                <TrendingDown className="h-4 w-4" />
                Tracking
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1">
          <Button
            variant={"secondary"}
            size={"sm"}
            className="w-30 gap-1"
            onClick={handleShowChartChange}
          >
            {showPriceChart ? (
              <>
                <ChevronUp />
                Hide Chart
              </>
            ) : (
              <>
                <ChevronDown />
                Show Chart
              </>
            )}
          </Button>

          <Button variant={"secondary"} size={"sm"} asChild>
            <Link href={product.url} target="_blank">
              <ExternalLink />
              View Product
            </Link>
          </Button>

          <Button
            variant={"ghost"}
            size={"icon-sm"}
            className="text-red-500 hover:text-red-600"
            onClick={handleDeleteProduct}
            disabled={deleting}
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
      {showPriceChart && (
        <CardFooter className="w-full flex-1">
          <PriceChart />
        </CardFooter>
      )}
    </Card>
  );
};
