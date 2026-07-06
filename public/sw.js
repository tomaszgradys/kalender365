// Minimalny service worker — spełnia kryterium „instalowalności" (Dodaj do ekranu
// głównego / Zainstaluj aplikację). Nie cache'uje agresywnie: pass-through fetch.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // Brak respondWith — przeglądarka obsługuje żądania normalnie.
});
