import { redirect } from "next/navigation";
import { berlinNow } from "@/lib/de/now";

// /osterferien → aktuelles Jahr. Bare-Keyword-URL ohne Jahr leitet (307) auf die
// Jahres-Übersicht aller Bundesländer. Kanonisch/indexierbar ist /osterferien/{Jahr}.
export default function OsterferienRedirect() {
  redirect(`/osterferien/${berlinNow().year}`);
}
