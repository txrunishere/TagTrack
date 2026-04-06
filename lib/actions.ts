"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";
import { scrapeProduct } from "./firecrawl";

type AddProductResult =
  | {
      success: true;
      product: any; // you can replace with your Product type
      message: string;
    }
  | {
      success: false;
      error: string;
    };

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}

export async function addProduct(
  formdata: FormData,
): Promise<AddProductResult> {
  const url = (formdata.get("url") as string).trim();

  if (!url) {
    return {
      success: false,
      error: "URL is required!",
    };
  }

  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Not Authorized!",
      };
    }

    const productData = await scrapeProduct(url);

    if (!productData.productName || !productData.currentPrice) {
      console.error("Product Data", productData);
      return {
        success: false,
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

    if (upsertProductError) throw upsertProductError;

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

      if (historyProductError) throw historyProductError;
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
        success: false,
        error: error.message,
      };

    return {
      success: false,
      error: "Failed to add product",
    };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete product error:", error);

    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to delete product!" };
  }
}

export async function getProducts() {
  try {
    const supabase = await createClient();
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return products || [];
  } catch (error) {
    console.error("Get products error:", error);
    return [];
  }
}

export async function getProductPriceHistory(productId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("product_history")
      .select("*")
      .eq("product_id", productId)
      .order("checked_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get product price history error:", error);
    return [];
  }
}
