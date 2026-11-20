import { MessageCircle } from "lucide-react";
import { waLink } from "@/config/site";

/* Always-reachable WhatsApp button, bottom right. */
export function StickyWhatsApp() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener"
      aria-label="Pišite nam na WhatsApp"
      className="btn btn-wa fixed bottom-5 right-5 z-40 !size-16 !p-0"
    >
      <MessageCircle className="size-8" aria-hidden="true" />
    </a>
  );
}
