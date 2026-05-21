# RONAC by Aquatia — site + CMS

Site static generat cu **Eleventy (11ty)**, cu panou de administrare **Sveltia CMS**
la `/admin`. Conținutul nu mai stă în HTML, ci în fișiere de date editabile dintr-o
interfață. Editezi → salvezi → Netlify reconstruiește singur site-ul în ~1 minut.

Design: natură acvatică + influență tradițională românească (motive de cusătură,
paletă ivory / verde adânc / roșu oxblood / aur). Fonturi: Fraunces + Hanken Grotesk.

---

## Cum funcționează (pe scurt)

```
Editezi în /admin  ──►  commit automat pe GitHub  ──►  Netlify rulează `npm run build`
                                                         (Eleventy → folderul _site)  ──►  live
```

- **Conținutul** stă în `src/_data/*.json` (pagini) și `src/editions/*.md` (arhiva).
- **Șabloanele** (HTML) sunt în `src/` și `src/_includes/` — nu trebuie să le atingi.
- **Build-ul** transformă datele în pagini HTML finale, în `_site/` (generat, nu se editează).

---

## Structura

```
ronac-cms/
├── netlify.toml            → setări build + redirecturi de la vechiul ronac.ro
├── package.json            → Eleventy + markdown-it
├── .eleventy.js            → configul generatorului
├── src/
│   ├── _data/              ← CONȚINUT EDITABIL (pagini)
│   │   ├── site.json         · setări globale (brand, contact, social)
│   │   ├── edition.json      · pagina principală / ediția curentă
│   │   ├── regulament.json   · regulament (secțiuni, calendar, premii)
│   │   ├── judges.json       · jurați ediția curentă
│   │   ├── sponsors.json     · sponsori (pe nivele)
│   │   └── team.json         · echipa / organizatori
│   ├── editions/           ← CONȚINUT EDITABIL (arhivă — câte un fișier per ediție)
│   │   ├── 2019.md … 2023.md
│   │   └── editions.json     · setări comune ale colecției (nu edita)
│   ├── _includes/          → șabloane (layout, header, footer, macros) — nu edita
│   ├── admin/              → CMS: index.html + config.yml
│   ├── assets/             → css / js / img (placeholdere + imagini încărcate)
│   ├── *.njk               → paginile (index, regulament, jurati, …)
│   ├── sitemap.njk, robots.txt, _redirects, _headers
└── README.md
```

---

## A. Publicare pe Netlify (cu Git — recomandat)

1. Urcă proiectul într-un repo pe **GitHub** (ex. `numele-tau/ronac`).
2. Netlify → *Add new site* → *Import from Git* → alege repo-ul.
3. Build settings se iau automat din `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `_site`
4. Deploy. Adaugi apoi domeniul `ronac.ro` din *Domain settings*.

> Redirecturile de la vechile linkuri WordPress (`/regulament-2023`, `/galerie-foto`…)
> sunt deja configurate, ca să nu pierzi SEO-ul.

### Previzualizare locală (opțional, dacă ai Node.js)
```bash
npm install
npm start          # deschide http://localhost:8080 cu live-reload
```

---

## B. Activarea panoului /admin (configurare unică)

Sveltia CMS scrie modificările direct în repo-ul tău GitHub. Pentru login îți trebuie
un mic „portar" OAuth (gratuit, găzduit pe Cloudflare Workers). E nevoie o singură dată.

**Pasul 1 — OAuth App pe GitHub**
GitHub → *Settings* → *Developer settings* → *OAuth Apps* → *New OAuth App*.
- Homepage URL: `https://www.ronac.ro`
- Authorization callback URL: URL-ul worker-ului de la pasul 2 (revii și-l completezi).
Notează **Client ID** și **Client Secret**.

**Pasul 2 — Worker-ul OAuth (gratuit)**
Deployează `sveltia-cms-auth` (Cloudflare Workers) — instrucțiuni oficiale:
`https://github.com/sveltia/sveltia-cms-auth`
Setezi `GITHUB_CLIENT_ID` și `GITHUB_CLIENT_SECRET` ca variabile în worker.
Vei obține un URL de forma `https://ceva.workers.dev`.

**Pasul 3 — completează `src/admin/config.yml`**
```yaml
backend:
  name: github
  repo: numele-tau/ronac          # ← repo-ul tău
  branch: main
  base_url: https://ceva.workers.dev   # ← URL-ul worker-ului
```
(Întoarce-te la GitHub OAuth App și pune acel URL la *callback URL*.)

**Pasul 4** — intră pe `https://www.ronac.ro/admin/`, te loghezi cu GitHub și editezi.
Se poate folosi și de pe telefon.

> Notă: nu am folosit „Netlify Identity + Git Gateway" (vechea metodă), pentru că
> Git Gateway e deprecat. Sveltia + OAuth propriu e calea curată azi.

---

## C. Cum editezi conținutul

În `/admin` vei vedea:
- **Pagini & setări** — site, pagina principală, regulament, jurați, sponsori, echipa.
- **Arhivă ediții** — listă; apeși *New* ca să adaugi o ediție nouă (ex. 2026 după ce se termină).

Pentru o ediție din arhivă, câmpul **An** stabilește și numele fișierului și URL-ul
(`/arhiva-2024.html`). Adaugi jurați, sponsori, premii și galeria din liste — fără cod.

---

## D. Ce e placeholder (de înlocuit)

Toate imaginile din `src/assets/img/` sunt SVG-uri temporare. Le poți înlocui:
- direct din `/admin` (încarci fișiere reale pe fiecare câmp de imagine), sau
- în repo, păstrând numele.

De confirmat la lansare: **numărul ediției 2026** (am pus „a VIII-a", verifică ordinalul)
și **data limită** pentru countdown (câmpul *Data limită* din „Pagina principală").

---

## E. Formularul de contact

Folosește **Netlify Forms** — funcționează automat după deploy. Mesajele apar în
dashboard-ul Netlify la *Forms*; la trimitere, vizitatorul ajunge pe `/multumim.html`.

---

## Note

- 100% static la livrare (rapid, sigur, fără server de întreținut).
- Gratuit: Eleventy, Sveltia și worker-ul OAuth sunt open-source / free tier.
- Build verificat local: 13 pagini generate, fără erori de linkuri sau imagini.
