/**
 * Întrebările frecvente de pe /erp. Aceleași texte pleacă și în datele
 * structurate FAQPage (src/seo.ts), deci răspunsurile sunt text simplu.
 * Verificate în manualul programului (ANDAXI-ERP/docs/manual).
 */
export interface FaqItem {
  q: string
  a: string
}

export const ERP_FAQ: FaqItem[] = [
  {
    q: 'Facturile ajung în e-Factura direct din program?',
    a: 'Da. Pe factura emisă apeși „Trimite în SPV” și ea pleacă la ANAF. Tot pe factură vezi ce a răspuns ANAF: în prelucrare, acceptată sau respinsă, cu motivul. Iar facturile primite de la furnizori le aduci din SPV și faci recepția (NIR) direct din ele.',
  },
  {
    q: 'Ce declarații scoate programul? Și SAF-T (D406)?',
    a: 'D300, D394, D390 și SAF-T (D406) se generează din datele tale, gata de depus. La D100, D101 și D205 completezi sumele într-un formular (la D205, beneficiarii vin din distribuirea dividendelor), iar programul face fișierul. Primești XML-ul și PDF-ul oficial cu cod de bare, făcut prin DUKIntegrator, validatorul oficial ANAF. Tu doar le încarci. La D406 lucrăm continuu, ca să acopere tot mai multe situații: dacă firma ta are cazuri speciale, spune-ne din timp.',
  },
  {
    q: 'Pot opri un modul dacă nu-l mai folosesc?',
    a: 'Da. Ne spui și îl oprim cu preaviz: nu se mai începe nimic nou pe el, iar ce ai în lucru se termină normal. Nu se pierde nimic, documentele rămân de citit și de tipărit. În program îți apare un anunț care spune exact ce se schimbă. Un modul nou pornește la fel de simplu, în câteva minute.',
  },
  {
    q: 'Cum îmi aduc datele din programul vechi?',
    a: 'Le importăm noi, fără cost: clienți, furnizori, produse, solduri de deschidere, stoc pe loturi și facturi istorice, din exporturile Excel ale programului vechi (de exemplu Pluriva; facturile istorice și din SmartBill sau SAGA). Întâi facem o probă, abia apoi importul adevărat.',
  },
  {
    q: 'Ce casă de marcat merge cu ANDAXI ERP?',
    a: 'Casele de marcat Datecs, prin driverul lor oficial. Pe calculatorul de lângă casă rulează un mic program, agentul, care tipărește bonurile. Dacă pică internetul, bonurile stau la coadă și nu se pierde niciunul.',
  },
  {
    q: 'Unde stau datele mele? Se face backup?',
    a: 'Fiecare firmă are instanța ei dedicată, cu baza ei de date, la adresa firma-ta.erp.andaxi.ro. Datele tale nu se amestecă cu ale altei firme. Backup-ul automat rulează la ora aleasă, iar o copie faci oricând, dintr-un buton.',
  },
  {
    q: 'Pot da fiecărui coleg doar ce-i trebuie?',
    a: 'Da. Pornești de la un rol (Proprietar, Administrator, Contabil, Operator sau Vizualizare) și bifezi secțiunile pe care le vede fiecare. Poți limita omul la anumite gestiuni, poți ascunde prețurile de achiziție și hotărăști cine schimbă prețuri sau trimite în SPV. Plătești doar conturile active.',
  },
]
