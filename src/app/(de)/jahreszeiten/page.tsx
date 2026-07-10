import { redirect } from "next/navigation";
import { berlinNow } from "@/lib/de/now";

// /jahreszeiten → aktuelles Jahr. Bare-Keyword-URL ohne Jahr war bisher 404; jetzt
// leitet sie (307) auf den Jahrgang mit realer Suchnachfrage. Kein Eintrag in
// der Sitemap — die kanonische, indexierbare Seite ist /jahreszeiten/{Jahr}.
export default function JahreszeitenRedirect() {
  redirect(`/jahreszeiten/${berlinNow().year}`);
}
