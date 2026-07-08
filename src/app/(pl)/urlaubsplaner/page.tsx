import { redirect } from "next/navigation";
import { berlinNow } from "@/lib/de/now";

// /urlaubsplaner → current year.
export default function UrlaubsplanerRedirect() {
  redirect(`/urlaubsplaner/${berlinNow().year}`);
}
