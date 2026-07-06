import { redirect } from "next/navigation";
import { warsawNow } from "@/lib/now";

export const revalidate = 3600;

export default function Page() {
  redirect(`/now-ksiezyca/${warsawNow().year}`);
}
