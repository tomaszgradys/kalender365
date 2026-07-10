import { makeFerienTypYearOgImage } from "@/lib/de/ferienTypRoute";

const og = makeFerienTypYearOgImage("osterferien");
export const alt = og.alt;
export const size = og.size;
export const contentType = og.contentType;
export default og.Image;
