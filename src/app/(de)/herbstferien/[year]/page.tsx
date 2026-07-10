import { makeFerienTypYearRoute } from "@/lib/de/ferienTypRoute";

const r = makeFerienTypYearRoute("herbstferien");
export const generateStaticParams = r.generateStaticParams;
export const generateMetadata = r.generateMetadata;
export default r.Page;
