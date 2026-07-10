import { redirect } from "next/navigation";
import { berlinNow } from "@/lib/de/now";

// /sommerferien → aktuelles Jahr. Bare-Keyword-URL ohne Jahr leitet (307) auf die
// Jahres-Übersicht aller Bundesländer. Kanonisch/indexierbar ist /sommerferien/{Jahr}.
export default function SommerferienRedirect() {
  redirect(`/sommerferien/${berlinNow().year}`);
}
