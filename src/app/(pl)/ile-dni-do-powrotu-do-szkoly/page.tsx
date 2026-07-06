import type { Metadata } from "next";
import CountdownView from "@/components/views/CountdownView";
import { countdownMeta } from "@/lib/countdowns";

export const revalidate = 3600;
const SLUG = "ile-dni-do-powrotu-do-szkoly";

export function generateMetadata(): Metadata {
  return countdownMeta(SLUG);
}

export default function Page() {
  return <CountdownView slug={SLUG} />;
}
