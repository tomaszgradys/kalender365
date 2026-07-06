import { redirect } from "next/navigation";
import { MONTH_SLUGS } from "@/lib/months";
import { warsawNow } from "@/lib/now";

export const revalidate = 3600;

export default function Page() {
  const now = warsawNow();
  redirect(`/wschod-zachod-slonca/${now.year}/${MONTH_SLUGS.pl[now.month0]}`);
}
