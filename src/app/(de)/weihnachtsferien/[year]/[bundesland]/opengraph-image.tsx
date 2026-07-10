import { makeFerienTypOgImage } from "@/lib/de/ferienTypRoute";

const og = makeFerienTypOgImage("weihnachtsferien");
export const alt = og.alt;
export const size = og.size;
export const contentType = og.contentType;
export default og.Image;
