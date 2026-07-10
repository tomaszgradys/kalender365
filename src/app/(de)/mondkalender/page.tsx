import { redirect } from "next/navigation";
import { berlinNow } from "@/lib/de/now";

// /mondkalender → aktuelles Jahr. Bare-Keyword-URL ohne Jahr war bisher 404; jetzt
// leitet sie (307) auf den Jahrgang mit realer Suchnachfrage. Kein Eintrag in
// der Sitemap — die kanonische, indexierbare Seite ist /mondkalender/{Jahr}.
export default function MondkalenderRedirect() {
  redirect(`/mondkalender/${berlinNow().year}`);
}
