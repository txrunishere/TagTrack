import Image from "next/image";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";

export const Header = async () => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-10">
        <div className="flex items-center gap-3">
          <Image
            className="h-20 w-auto"
            src={"/tagtrack_logo.png"}
            alt="TagTrack logo"
            width={150}
            height={100}
          />
        </div>

        <Button
          asChild
          size="sm"
          className="cursor-pointer bg-blue-500 hover:bg-blue-600"
        >
          <span>
            <LogIn />
            Sign in
          </span>
        </Button>
      </div>
    </header>
  );
};
