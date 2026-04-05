import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const AddProductForm = () => {
  return (
    <div className="mt-16 w-full max-w-2xl">
      <form className="flex flex-col gap-2 sm:flex-row">
        <Input
          className="placeholder:text-sm"
          type="url"
          placeholder="Paste Product URL (Amazon, Walmart, etc.)"
          required
        />
        <Button className="bg-blue-500 hover:bg-blue-600">Track Price</Button>
      </form>
    </div>
  );
};
