import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function HowToUseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="secondary">
          How to Use 🚀
        </Button>
      </DialogTrigger>

      <DialogContent className="mx-auto w-[calc(100%-2rem)] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            🚀 How to Use TagTrack
          </DialogTitle>
        </DialogHeader>

        <div className="text-muted-foreground space-y-4 text-sm">
          <p>
            TagTrack helps you monitor product prices and get notified when
            prices drop automatically.
          </p>

          <div>
            <h3 className="text-foreground font-medium">1. Add a Product</h3>
            <ul className="list-disc pl-5">
              <li>Paste the product URL into the input field.</li>
              <li>
                Click on <span className="font-medium">Track Product</span>.
              </li>
              <li>
                TagTrack will fetch product details and start tracking its
                price.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-medium">
              2. View Price History
            </h3>
            <ul className="list-disc pl-5">
              <li>Once added, the product will appear in your dashboard.</li>
              <li>
                You can see a price tracking chart showing how the price changes
                over time.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-medium">
              3. Automatic Price Check
            </h3>
            <ul className="list-disc pl-5">
              <li>TagTrack checks product prices in the background.</li>
              <li>
                If the price drops compared to the previous value, it is
                recorded.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-medium">
              4. Weekly Email Alerts 📩
            </h3>
            <ul className="list-disc pl-5">
              <li>Every Monday at 2:00 PM.</li>
              <li>
                Emails are sent only if the price of tracked products has
                dropped.
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
