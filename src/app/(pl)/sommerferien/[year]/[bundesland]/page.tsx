import { makeFerienTypRoute } from "@/lib/de/ferienTypRoute";

const r = makeFerienTypRoute("sommerferien");
export const generateStaticParams = r.generateStaticParams;
export const generateMetadata = r.generateMetadata;
export default r.Page;
