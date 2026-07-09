import { makeFerienTypRoute } from "@/lib/de/ferienTypRoute";

const r = makeFerienTypRoute("weihnachtsferien");
export const generateStaticParams = r.generateStaticParams;
export const generateMetadata = r.generateMetadata;
export default r.Page;
