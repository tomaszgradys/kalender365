import { redirect } from "next/navigation";
import { berlinNow } from "@/lib/de/now";

// /herbstferien → aktuelles Jahr. Bare-Keyword-URL ohne Jahr leitet (307) auf die
// Jahres-Übersicht aller Bundesländer. Kanonisch/indexierbar ist /herbstferien/{Jahr}.
export default function HerbstferienRedirect() {
  redirect(`/herbstferien/${berlinNow().year}`);
}
