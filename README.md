# Kickoff

Kickoff je hrvatska PWA/Android aplikacija za raspored nogometnih utakmica i dostupne Bet365 kvote preko API-Footballa. Spremljene utakmice ostaju lokalno na uređaju.

Prognoze nisu jamstvo ishoda. 1X2, više/manje 2,5 i BTTS vjerojatnosti izvode se iz vraćenih Bet365 decimalnih kvota uz normalizaciju tržišne marže. Točan rezultat i HT/FT prikazuju ishod s najvećom impliciranom vjerojatnošću među ponuđenim kvotama. Ako API-Football plan ili pojedina utakmica ne vraćaju Bet365 odnosno neko tržište, aplikacija ga označi nedostupnim umjesto da prikazuje zamjenske ili izmišljene podatke. API dostupnost i CORS pravila ovise o API-Football računu.

## Pokretanje web aplikacije

Potrebni su Node.js 20.19+ ili 22.12+ i npm.

```powershell
npm install
npm run dev
```

Otvori adresu koju ispiše Vite, obično `http://localhost:5173`. Možeš pokrenuti i `start-kickoff.bat`, koji nudi pokretanje preglednika te otvaranje APK-a i ZIP-a.

## API-Football ključ

U aplikaciji otvori **Postavke**, zalijepi API-Football ključ i pritisni **Testiraj i spremi**. Ključ se sprema na tom uređaju: u Android APK-u koristi se šifrirana pohrana Android Keystorea; u web pregledniku je u `localStorage` i nije šifriran. Svaki izravni poziv šalje ključ API-Footballu, pa se može izvući iz web alata za razvoj ili pregledom mrežnog prometa. Za javnu distribuciju sigurniji je vlastiti HTTPS proxy.

Android APK šalje zahtjeve nativnim HTTPS klijentom. Web PWA ovisi o tome dopušta li API-Football CORS zahtjeve s njezine domene. Ako test ključa ili dohvaćanje podataka ne uspije, provjeri API plan, preostalu kvotu, CORS i internet. Nikakav API ključ nije uključen u izvorni kod, ZIP ni APK.

## Bet365 kvote i tržišta

Aplikacija traži Bet365 ponudu preko API-Footballova `odds` endpointa za odabranu utakmicu. Dostupna tržišta ovise o natjecanju, vremenu ažuriranja, API-Football planu i providerovoj pokrivenosti. Prikazuju se:

- 1X2
- više/manje 2,5 gola
- BTTS (oba daju gol: da/ne)
- točan rezultat
- poluvrijeme/konačni ishod (HT/FT)

Utakmice se dohvaćaju po datumu u vremenskoj zoni `Europe/Zagreb`. Zadnji uspješno dohvaćeni raspored i kvote kratkotrajno se lokalno keširaju; zastarjeli podaci koji se prikazuju nakon neuspjelog osvježavanja označeni su u sučelju.

## PWA i Android APK

Web aplikacija može se instalirati iz Chromea/Edgea na računalu i Androidu. Na iPhoneu/iPadu otvori stranicu u Safariju i odaberi **Dijeli → Dodaj na početni zaslon**. Gumb **Instaliraj** u aplikaciji pokreće instalaciju kad je preglednik podržava ili prikazuje upute. Za instalaciju s weba aplikacija mora biti objavljena na HTTPS domeni (localhost radi za lokalni razvoj); lokalna `dist` mapa sama po sebi nije javna adresa.

Ako hosting objavljuje aplikaciju u podmapi (npr. `https://primjer.hr/kickoff/`), postavi `VITE_BASE_PATH=/kickoff/` pri gradnji. Zadana putanja `/` odgovara domeni na kojoj je aplikacija objavljena u korijenu.

### Besplatna javna objava

Projekt uključuje GitHub Actions tijek rada `.github/workflows/deploy-pages.yml`, koji gradi PWA i objavljuje je na GitHub Pagesu uz HTTPS. Za repozitorij `sandrapmilovic-cloud/kickoff` javna adresa nakon prve uspješne objave bit će `https://sandrapmilovic-cloud.github.io/kickoff/`. Svaka nova promjena poslana na granu `main` automatski pokreće novu objavu. GitHub Pages je besplatan za javne repozitorije; trajnost ovisi o tome da repozitorij i račun ostanu aktivni, a GitHub može mijenjati kvote i uvjete.

Nakon prijenosa projekta u repozitorij otvori **Settings → Pages** i za **Build and deployment → Source** odaberi **GitHub Actions**. Tijek rada sam postavlja `VITE_BASE_PATH` na podmapu repozitorija, tako da PWA manifest, ikone i servisni radnik rade i na GitHub Pages adresi. Ako je repozitorij zasad prazan, prvo treba prenijeti projektne datoteke i workflow na granu `main`; prva objava se zatim pojavljuje pod karticom **Actions**.

Nemoj u javni repozitorij stavljati API ključeve ni `.env` datoteke. APK koristi Android Keystore za ključ koji se unese na uređaju, dok se web ključ čuva lokalno u pregledniku.

```powershell
npm run build
npm run android:apk
npm run zip
```

`npm run build` izgradi PWA u `dist`. Android naredba izgradi i sinkronizira PWA u Capacitoru te stvara debug APK u `android/app/build/outputs/apk/debug/app-debug.apk` (trenutna verzija 1.4.0, versionCode 5). Potrebni su Android Studio/SDK, JDK 21 i postavljeni `ANDROID_HOME`/`ANDROID_SDK_ROOT`. Za javnu objavu izradi potpisani release APK/AAB.

`npm run zip` ažurira `matchday-project.zip`, bez `.env`, API tajni, `node_modules`, `dist` i Android build izlaza.

## Neobavezni proxy

U projektu je zadržan raniji Express proxy u `server/` za vlastite implementacije. Trenutačna aplikacija ne koristi proxy: ključ koji uneseš šalje izravno s uređaja API-Footballu.
