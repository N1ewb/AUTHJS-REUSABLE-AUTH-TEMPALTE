# Page Load / Compile Speed Analysis

## Root Cause

The app isn't loading slowly because of bundle bloat (it's actually lean at ~87 kB shared JS). The slowdown is from **three compounding issues**:

---

### 1. No Dynamic Imports — Everything Loads Eagerly

Every component is imported statically at the top of the file. This means the browser downloads and parses the **entire page's JS upfront**, even for content the user can't see yet.

**Examples:**
- `CreateQuiz.tsx` — 1024 lines of multi-step wizard logic. It loads entirely on page visit even though steps 2-5 are hidden behind button clicks.
- Landing page — 6 section components (`Hero`, `Features`, `Testimonials`, `Cta`, `Faq`, `Footer`) all load at once, even though only `Hero` is visible above the fold.
- Registration pages — Full `react-hook-form` + `zod` + `useToast` pipeline loads for both student and instructor registration, even if the user only uses one.

**The fix:** Use `next/dynamic` for below-fold sections and heavy interactive components:
```ts
import dynamic from "next/dynamic";
const CreateQuiz = dynamic(() => import("./CreateQuiz"));
```

---

### 2. 5 Font Weights on Poppins

`app/layout.tsx` loads **5 weights** of Poppins (300, 400, 500, 600, 700). Each weight adds ~15-20 kB of font data (75-100 kB total). While `next/font` self-hosts these (no external API call), the browser still has to download all 5 font files before fully rendering text in those weights.

**Check if you actually use all 5.** If only 400, 500, and 700 are used in your Tailwind classes, dropping 300 and 600 saves ~30-40 kB.

---

### 3. Duplicate Route Compilation (Build Time Only)

Two student dashboard routes are compiled on every build:
- `app/(pages)/student/dashboard/page.tsx`
- `app/(pages)/student/studentdashboard/page.tsx`

This adds unnecessary build time. The `studentdashboard/` route is likely dead code from a refactor.

---

## What's NOT the Problem

| Suspect | Verdict |
|---------|---------|
| Auth calls | At most 1 `auth()` per route. Normal. |
| Bundle size | 87 kB shared is healthy for a Next.js app with shadcn/ui, next-auth, and react-hook-form. |
| Server actions in client files | Used correctly — Next.js compiles them to lightweight action references. `bcrypt` and `prisma` stay server-side. |
| Prisma client | Global singleton pattern is correct. |
| CSS | `globals.css` is 78 lines. Tailwind generates what you use. |
| Layout nesting | Max 4 levels. Normal App Router depth. |

---

## Solution Path

### Priority 1: Add Dynamic Imports (Biggest Impact)

**Where:** `app/(landing)/page.tsx`, `app/(pages)/instructor/quizzes/create/page.tsx`

**Landing page** — lazy-load sections below `Hero`:
```ts
import dynamic from "next/dynamic";

const Features = dynamic(() => import("./(components)/landing-sections/Features"));
const Testimonials = dynamic(() => import("./(components)/landing-sections/Testimonials"));
const Cta = dynamic(() => import("./(components)/landing-sections/Cta"));
const Faq = dynamic(() => import("./(components)/landing-sections/Faq"));
const Footer = dynamic(() => import("./(components)/landing-sections/Footer"));
```
This drops the landing page's First Load JS from ~97 kB to ~88 kB (only `Hero` loads upfront).

**Create Quiz page** — lazy-load the `CreateQuiz` component (it's a multi-step wizard, no need to parse all 1024 lines on mount):
```ts
import dynamic from "next/dynamic";
const CreateQuiz = dynamic(() => import("./CreateQuiz"), { ssr: false });
```

**Registration pages** — if both forms share the same zod + react-hook-form setup, the shared bundle already covers them. No action needed unless you want to lazy-load the form component itself.

---

### Priority 2: Trim Font Weights

**File:** `app/layout.tsx`

Find which Poppins weights are actually used:
```bash
# Search for font-weight or Tailwind classes that map to Poppins weights
rg "font-(thin|extralight|light|normal|medium|semibold|bold|extrabold)" --include "*.tsx" --include "*.ts"
```

Then reduce to only what's needed:
```ts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],  // Drop 300 and 600 if unused
});
```

This saves ~30-40 kB of font data.

---

### Priority 3: Remove Dead Routes

**Delete** `app/(pages)/student/studentdashboard/` entirely (it's a duplicate of `app/(pages)/student/dashboard/`).

This eliminates an unnecessary page compilation from every build (~+3-5 seconds of build time).

---

### Quick Wins (5 minutes each)

| Fix | File | Change |
|-----|------|--------|
| Remove `prisma.$disconnect()` | `app/api/login/route.ts`, `app/api/signup/route.ts` | Delete the `finally` blocks — Prisma's pool handles this |
| Rename `Regsiter.tsx` → `Register.tsx` | `app\(auth)\instructorregistration\` | Fix typo, update import in `page.tsx` |
| Remove stale `pages/` from Tailwind config | `tailwind.config.ts` | `"./pages/**/*.{js,ts,jsx,tsx,mdx}"` doesn't exist in App Router projects |

---

## Summary

The app's JS bundles are **not too large** — the issue is **load order**. Nothing is lazy-loaded. Every page pulls in its full JS payload upfront. Adding `next/dynamic` for components below the fold and removing unused font weights would make the biggest difference.
