# 🤝 ImpactSetu — Student NGO Volunteering Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-LibSQL-003B57?logo=sqlite)](https://github.com/tursodatabase/libsql)

A full-stack, production-ready web application connecting engineering student volunteers with audited NGO campaigns across Bengaluru. Inspired by the transparent, community-first visual identity of non-profit organizations like **Akshaya Patra**.

---

## ✨ Features At A Glance

- **🎨 Warm Visual Identity**: Designed with terracotta, warm orange, and earth sand color palettes, using `Playfair Display` for impact headings and `Plus Jakarta Sans` for UI text.
- **🔍 Browse & Filter Campaigns**: Live search and multi-filtering by Cause Category (*Hunger Relief, Education & Tech, Environment, Elderly Care, Blood & Health*), Location (*RR Nagar, Jayanagar, Kengeri, Koramangala, Banashankari*), and Shift Duration.
- **📋 Campaign Details & 1-Click Volunteer**: Full details, prerequisites checklist, spots counter, 1-click volunteer registration with particle confetti celebration, and bookmarking.
- **🎓 Student Dashboard**: Profile header (*Student Name, College e.g. RNSIT, Skills*), verified hours counter, upcoming campaigns, past history, and an **Official Volunteering Certificate** modal ready for printing/PDF export.
- **🏢 NGO Admin Dashboard**: Campaign creation modal and **Volunteer Roster Management** view to review applicants and toggle attendance status (`REGISTERED` ➔ `CONFIRMED` ➔ `ATTENDED` ➔ `CANCELLED`).
- **🗄️ Real SQLite Database**: Persists all users, campaigns, registrations, and bookmarks in `data/impactsetu.db` using `@libsql/client` across server restarts and page refreshes.
- **⚡ Evaluator Demo Switcher**: Top header bar allowing instant 1-click toggling between Student profiles (*Arun Kumar - RNSIT*) and NGO Admin profiles (*Akshaya Patra Foundation*).

---

## ⚡ Quick Start

```bash
# 1. Clone repo & install dependencies
git clone <your-repo-url>
cd "ngo volunteering"
npm install

# 2. Seed database with realistic mock data
npm run seed

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` to interact with the platform.

For a detailed technical architecture breakdown, database schema SQL, and route breakdown, see [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md).
