import { redirect } from "next/navigation";
import { berlinNow } from "@/lib/de/now";

// /weihnachtsferien → aktuelles Jahr. Bare-Keyword-URL ohne Jahr leitet (307) auf die
// Jahres-Übersicht aller Bundesländer. Kanonisch/indexierbar ist /weihnachtsferien/{Jahr}.
export default function WeihnachtsferienRedirect() {
  redirect(`/weihnachtsferien/${berlinNow().year}`);
}
