import { sendPriceDropAlert } from "@/lib/email";
import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Price check endpoint is working!",
    },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecretKey = process.env["CRON_SECRET_KEY"];

    if (!authHeader?.startsWith("Bearer")) {
      return NextResponse.json({ error: "Invalid header" }, { status: 400 });
    }

    if (!cronSecretKey || authHeader !== `Bearer ${cronSecretKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*");

    if (productsError) throw productsError;

    const results = {
      total: products?.length,
      failed: 0,
      updated: 0,
      alertSend: 0,
      priceChanges: 0,
    };

    for (const product of products) {
      try {
        const scrapeProductData = await scrapeProduct(product.url);

        if (!scrapeProductData.currentPrice) {
          results.failed++;
          continue;
        }

        const oldPrice = parseFloat(product.current_price);
        let newPrice: number;

        if (typeof scrapeProductData.currentPrice === "string")
          newPrice = parseFloat(scrapeProductData.currentPrice);
        else newPrice = scrapeProductData.currentPrice;

        await supabase
          .from("products")
          .update({
            name: scrapeProductData.productName || product.name,
            current_price: newPrice,
            currency: scrapeProductData.currencyCode || product.currency,
            image_url: scrapeProductData.productImageUrl || product.image_url,
          })
          .eq("id", product.id);

        if (oldPrice !== newPrice) {
          await supabase.from("product_history").insert({
            product_id: product.id,
            price: newPrice,
            currency: scrapeProductData.currencyCode || product.currency,
          });

          results.priceChanges++;

          if (newPrice < oldPrice) {
            // send user a alert!

            const { data } = await supabase.auth.admin.getUserById(
              product.user_id,
            );

            const user = data.user;

            if (user?.email) {
              // email logic / function call
              const emailResult = await sendPriceDropAlert({
                userEmail: user?.email,
                product,
                newPrice,
                oldPrice,
              });

              if (emailResult.success) {
                results.alertSend++;
              }
            }
          }
        }

        results.updated++;
      } catch (error) {
        console.error("Project updating error:", error);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Price check completed!",
      results,
    });
  } catch (error) {}
}
