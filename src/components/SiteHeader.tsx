import { nowCtx } from "@/lib/calendars";
import MainNav from "@/components/MainNav";

export default function SiteHeader() {
  return <MainNav ctx={nowCtx()} />;
}
