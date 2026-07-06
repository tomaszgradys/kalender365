import { Geist, Geist_Mono } from "next/font/google";

// Serwis jest po polsku — potrzebny podzbiór latin-ext (ą, ć, ę, ł, ń, ó, ś, ż, ź),
// inaczej polskie znaki diakrytyczne spadają na font systemowy (niespójny wygląd + FOUT).
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Mono używamy tylko do cyfr/dat/godzin (ASCII) — latin wystarcza, mniejszy payload.
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
