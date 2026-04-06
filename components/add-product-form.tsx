"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { AuthModel } from "./auth-model";
import { addProduct } from "@/lib/actions";
import { toast } from "sonner";

type AddProductFormProps = {
  user: User | null;
};

export const AddProductForm = ({ user }: AddProductFormProps) => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showAuthModel, setShowAuthModel] = useState<boolean>(false);

  const onClose = () => setShowAuthModel(false);
  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  const handleAddProductSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModel(true);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("url", url);

      const result = await addProduct(formData);

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Product tracked successfully!");
        setUrl("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-16 w-full max-w-2xl">
        <form
          onSubmit={handleAddProductSubmit}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <Input
            className="placeholder:text-sm"
            type="url"
            placeholder="Paste Product URL (Amazon, Walmart, etc.)"
            required
            disabled={loading}
            value={url}
            onChange={handleUrlChange}
          />
          <Button disabled={loading} className="bg-blue-500 hover:bg-blue-600">
            Track Price
          </Button>
        </form>
      </div>

      <AuthModel isOpen={showAuthModel} onClose={onClose} />
    </>
  );
};
