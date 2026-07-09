import Image from "next/image";
import EventArt, { type EventMotif } from "@/components/de/EventArt";

/**
 * Hero-Banner für Modul- und Anlassseiten. Nutzt ein echtes (KI-)Titelbild,
 * wenn `src` vorhanden ist, sonst die hausgemachte SVG-Illustration als
 * Fallback — so bleiben neue Anlässe auch ohne Bild markenkonform bebildert.
 */
export default function ModuleHero({
  src,
  alt,
  motif,
  uid,
  className = "h-44 w-full sm:h-56",
  priority = false,
}: {
  src?: string;
  alt: string;
  motif: EventMotif;
  uid?: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${className}`}>
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 900px, 100vw" priority={priority} className="object-cover" />
      </div>
    );
  }
  return <EventArt motif={motif} uid={uid} className={className} />;
}
