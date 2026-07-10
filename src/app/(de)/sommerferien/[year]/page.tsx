import { makeFerienTypYearRoute } from "@/lib/de/ferienTypRoute";

const r = makeFerienTypYearRoute("sommerferien");
export const generateStaticParams = r.generateStaticParams;
export const generateMetadata = r.generateMetadata;
export default r.Page;
