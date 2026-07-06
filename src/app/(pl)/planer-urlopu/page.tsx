import { redirect } from "next/navigation";
import { warsawNow } from "@/lib/now";

// /planer-urlopu → bieżący rok.
export default function PlanerUrlopuRedirect() {
  redirect(`/planer-urlopu/${warsawNow().year}`);
}
