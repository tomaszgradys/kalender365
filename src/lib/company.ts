// Dane operatora/administratora serwisu — jedno źródło prawdy dla stron prawnych,
// stopki i strony „O nas". Serwis kalendarz.pro prowadzony jest przez Profivo Sp. z o.o.
export const COMPANY = {
  legalName: "Profivo Sp. z o.o.",
  shortName: "Profivo",
  street: "ul. Paprotna 8B/14",
  postal: "51-117",
  city: "Wrocław",
  nip: "9151835807",
  nipFormatted: "915 183 58 07",
  regon: "542154491",
  krs: "0001181942",
  email: "kontakt@kalendarz.pro",
  registryNote:
    "wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy właściwy dla siedziby spółki",
} as const;

// Jednowierszowy adres do stopki / podpisów.
export const COMPANY_LINE = `${COMPANY.legalName} · ${COMPANY.street}, ${COMPANY.postal} ${COMPANY.city} · NIP: ${COMPANY.nipFormatted} · REGON: ${COMPANY.regon} · KRS: ${COMPANY.krs}`;

// Pełne zdanie identyfikujące usługodawcę (do intro regulaminu/polityki).
export const COMPANY_SENTENCE = `${COMPANY.legalName} z siedzibą we Wrocławiu, ${COMPANY.street}, ${COMPANY.postal} ${COMPANY.city}, ${COMPANY.registryNote} pod numerem KRS ${COMPANY.krs}, NIP ${COMPANY.nip}, REGON ${COMPANY.regon}`;
