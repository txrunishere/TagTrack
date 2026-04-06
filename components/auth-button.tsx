"use client";

import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import { AuthModel } from "./auth-model";

type AuthButtonProps = {
  user: User | null;
};

export const AuthButton = ({ user }: AuthButtonProps) => {
  const [showAuthModel, setShowAuthModel] = useState<boolean>(false);

  const handleModelClick = () => setShowAuthModel(true);
  const onClose = () => setShowAuthModel(false);

  if (user) {
    return (
      <form action="">
        <Button
          asChild
          size="sm"
          variant={"outline"}
          className="cursor-pointer gap-2 hover:bg-blue-100"
        >
          <span>
            <LogOut />
            Sign out
          </span>
        </Button>
      </form>
    );
  }

  return (
    <>
      <Button
        asChild
        size="sm"
        className="cursor-pointer gap-2 bg-blue-500 hover:bg-blue-600"
        onClick={handleModelClick}
      >
        <span>
          <LogIn />
          Sign in
        </span>
      </Button>

      <AuthModel isOpen={showAuthModel} onClose={onClose} />
    </>
  );
};
