# 🤝 ImpactSetu — Student & NGO Volunteering Platform

> **Bridging passionate engineering students with audited NGO campaigns across Bengaluru for real, measurable social impact.**

---

## 📌 Executive Summary & Project Vision

**ImpactSetu** is a full-stack, production-ready web platform designed to solve a dual problem in collegiate social engagement:
1. **For Students**: College students (e.g., from institutions like RNSIT, RVCE, BMSCE) want verified, high-impact weekend volunteering opportunities without navigating sketchy unverified forms or corporate fluff. They need a simple core loop to register, track completed hours, and earn official certificates for their portfolio.
2. **For NGOs**: Non-Profit organizations (like *Akshaya Patra Foundation*, *Youth For Seva*, *Goonj*) need a reliable stream of motivated student volunteers for kitchen meal sorting, digital teaching drives, tree planting, and blood donation logistics. They need an administrative dashboard to manage applicant rosters and verify attendance.

---

## 🛠️ Technology Stack & System Architecture

| Component | Technology | Rationale & Application |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14+ (App Router)** | Full-stack React framework utilizing Server Components for fast page loads & Client Components for interactive UI state. |
| **Language** | **TypeScript (`v5.6`)** | Strict type safety across database entities, API response payloads, and React component props. |
| **Styling & Design** | **Tailwind CSS (`v3.4`)** | Custom design system with tailored earth-tone variables, glassmorphism panels, and responsive grid layouts. |
| **Typography** | **Google Fonts** | `Playfair Display` (character-driven serif for impact headings) + `Plus Jakarta Sans` (clean sans-serif for UI clarity). |
| **Database** | **SQLite (`data/impactsetu.db`)** | Embedded relational SQL database. Uses `@libsql/client` with **zero native compilation requirements**, ensuring 100% data persistence across browser refreshes and server restarts. |
| **Icons & Delight** | **Lucide React & Canvas-Confetti** | Modern UI icon set (`lucide-react`) and particle explosion celebrations (`canvas-confetti`) upon student registration. |

---

## 🗄️ Database Schema (`data/schema.sql`)

The relational database architecture is defined as follows:

```sql
-- 1. USERS TABLE (Students & NGOs)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('STUDENT', 'NGO')),
  college_name TEXT,
  skills TEXT,
  contact_info TEXT,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. CAMPAIGNS TABLE (NGO Volunteering Initiatives)
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  ngo_id TEXT NOT NULL,
  ngo_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cause_category TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  duration_hours INTEGER NOT NULL,
  required_volunteers INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  requirements TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ngo_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. REGISTRATIONS TABLE (Enrollment & Attendance State)
CREATE TABLE registrations (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  campaign_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'REGISTERED' CHECK(status IN ('REGISTERED', 'CONFIRMED', 'ATTENDED', 'CANCELLED')),
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  UNIQUE(student_id, campaign_id)
);

-- 4. BOOKMARKS TABLE (Saved Opportunities)
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  campaign_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  UNIQUE(student_id, campaign_id)
);
```

---

## 🚀 Core Pages & User Routes

### 1. Homepage (`/`)
- **Hero Section**: Akshaya Patra inspired warm hero banner with clear call-to-actions, live statistics bar (15,000+ meals served, 1,200+ volunteers, 45+ NGO partners).
- **Causes We Support**: Interactive grid for *Hunger Relief, Education & Tech, Environment, Elderly Care, Blood & Health*.
- **How Volunteering Works**: 4-step workflow explaining the volunteer lifecycle.
- **Impact Stories**: Authentically written testimonials from RNSIT, RVCE & BMSCE engineering students.
- **Live Featured Campaigns**: Dynamic 3-card grid reading directly from SQLite.

### 2. Browse Campaigns (`/campaigns`)
- **Search Engine**: Real-time keyword filter searching campaign titles, NGO names, descriptions, or locations.
- **Multi-Filter Controls**:
  - Filter by Cause Category
  - Filter by Location (*RR Nagar, Jayanagar, Kengeri, Koramangala, Banashankari*)
  - Filter by Shift Duration (*≤ 3 Hours, 4-5 Hours, 6+ Hours*)
- **Campaign Cards**: Cover image, cause category badge, venue map pin, date/duration badges, volunteer progress bar, and quick action buttons.

### 3. Campaign Details (`/campaigns/[id]`)
- Comprehensive overview with cover photo, NGO details, available spots counter, schedule, and prerequisites checklist.
- **Interactive Action Card**:
  - **1-Click Volunteer Button**: Persists registration to database (`REGISTERED` status) and triggers celebratory confetti.
  - **Bookmark Button**: Saves campaign to student's saved tab.

### 4. Student Dashboard (`/dashboard/student`)
- **Profile Header**: Student Name (*Arun Kumar*), College (*RNSIT - Computer Science*), Verified Hours Counter, Skills badges.
- **3 Tabbed Views**:
  - **Upcoming Campaigns**: Registered campaigns with status (`REGISTERED`, `CONFIRMED`), date, location, option to view details or cancel.
  - **Past History & Certificates**: Completed shifts with `ATTENDED` status, total verified hours calculation, and an interactive **Official Volunteering Certificate** modal with print/download support.
  - **Saved Campaigns**: Quick access to bookmarked opportunities.

### 5. NGO Admin Dashboard (`/dashboard/ngo`)
- **NGO Metrics Overview**: Active campaigns, total registered applicants, confirmed count.
- **Create Campaign Modal**: Form for NGOs to publish new campaigns with title, cause, location, date, hours, required count, cover image, description, and requirements. Writes directly to SQLite DB.
- **Volunteer Management View**: Select any campaign to view applicant roster (*Student Name, Email, College e.g. RNSIT, Skills, Phone number*).
- **Attendance Status Updater**: Toggle applicant status between `REGISTERED` ➔ `CONFIRMED` ➔ `ATTENDED` ➔ `CANCELLED` with instant database persistence.

---

## ⚡ Demo Accounts & Quick Role Switcher

To allow evaluators and recruiters to test the application instantly without manual login friction, a **Demo Role Switcher** top header bar is included:

- **Student Profile**: `Arun Kumar` (*RNSIT - Computer Science & Engineering*)
- **Student Profile**: `Ananya Sharma` (*RVCE - Electronics & Communication*)
- **NGO Profile**: `Akshaya Patra Foundation Admin`
- **NGO Profile**: `Youth For Seva Bengaluru Coordinator`

---

## 📁 Repository Directory Structure

```
ngo volunteering/
├── data/
│   ├── schema.sql           # SQLite table definitions
│   └── impactsetu.db        # SQLite database file (created on seed)
├── scripts/
│   └── seed.js              # Database seeding script (@libsql/client)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── bookmarks/route.ts       # GET & POST bookmarks
│   │   │   ├── campaigns/route.ts       # GET & POST campaigns
│   │   │   ├── campaigns/[id]/route.ts  # GET, PUT, DELETE single campaign
│   │   │   └── registrations/route.ts   # GET, POST, PUT volunteer registrations
│   │   ├── campaigns/
│   │   │   ├── [id]/page.tsx            # Campaign Details page
│   │   │   └── page.tsx                 # Browse Campaigns page
│   │   ├── dashboard/
│   │   │   ├── ngo/page.tsx             # NGO Admin Dashboard & Roster
│   │   │   └── student/page.tsx         # Student Dashboard & Certificates
│   │   ├── globals.css                  # Custom styling & font setup
│   │   ├── layout.tsx                   # Root layout with AuthProvider & Fonts
│   │   └── page.tsx                     # Homepage
│   ├── components/
│   │   ├── CampaignCard.tsx             # Campaign card component
│   │   ├── CampaignFilters.tsx          # Multi-criteria filter bar
│   │   ├── CertificateModal.tsx         # Printable certificate modal
│   │   ├── CreateCampaignModal.tsx      # NGO campaign creation modal
│   │   ├── Footer.tsx                   # Social impact footer
│   │   └── Navbar.tsx                   # Header with Demo Role Switcher
│   └── lib/
│       ├── auth-context.tsx             # Client AuthContext & Demo user switcher
│       └── db.ts                        # @libsql/client database query helpers
├── next.config.js                       # Next.js configuration (Unsplash remote patterns)
├── package.json                         # Project dependencies & scripts
├── tailwind.config.js                   # Custom design system tokens
├── tsconfig.json                        # TypeScript configuration
└── PROJECT_CONTEXT.md                   # This project context document
```

---

## 💻 Local Setup & Development Instructions

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm (v9+)

### 1. Clone & Install Dependencies
```bash
git clone <your-repository-url>
cd ngo-volunteering
npm install
```

### 2. Seed the Database
Initialize tables and pre-populate mock data for students and NGOs:
```bash
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore the platform.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📜 License & Acknowledgments
Designed with warmth and care for social impact. Special inspiration drawn from the transparent, community-first work of non-profit organizations across India.
