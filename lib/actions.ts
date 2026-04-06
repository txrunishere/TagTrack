"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";
import { scrapeProduct } from "./firecrawl";

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}

export async function addProduct(formdata: FormData) {
  const url = (formdata.get("url") as string).trim();

  if (!url) {
    return {
      error: "URL is required!",
    };
  }

  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: "Not Authorized!",
      };
    }

    const productData = await scrapeProduct(url);

    if (!productData.productName || !productData.currentPrice) {
      console.error("Product Data", productData);
      return {
        error: "Unable to extract data from this URL",
      };
    }

    let price: number;

    if (typeof productData.currentPrice === "string") {
      price = parseFloat(productData.currentPrice);
    } else {
      price = productData.currentPrice;
    }

    const currencyCode = productData.currencyCode || "USD";

    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, current_price")
      .eq("user_id", user.user?.id)
      .eq("url", url)
      .single();

    const isUpdate = !!existingProduct;

    const { data: product, error: upsertProductError } = await supabase
      .from("products")
      .upsert(
        {
          user_id: user.user?.id,
          url,
          name: productData.productName,
          current_price: price,
          currency: currencyCode,
          image_url: productData?.productImageUrl,
        },
        { ignoreDuplicates: false, onConflict: "user_id,url" },
      )
      .select()
      .single();

    if (upsertProductError) {
      return {
        error: upsertProductError.message,
      };
    }

    const shouldAddHistory =
      !isUpdate || existingProduct.current_price !== price;

    if (shouldAddHistory) {
      const { error: historyProductError } = await supabase
        .from("product_history")
        .insert({
          product_id: product.id,
          price,
          currency: currencyCode,
        });

      if (historyProductError) {
        return {
          error: historyProductError.message,
        };
      }
    }

    revalidatePath("/");

    return {
      success: true,
      product,
      message: isUpdate
        ? "Product updated with latest price!"
        : "Product added successfully!",
    };
  } catch (error) {
    console.error("Add product error:", error);

    if (error instanceof Error)
      return {
        error: error.message,
      };

    return {
      error: "Failed to add product",
    };
  }
}
