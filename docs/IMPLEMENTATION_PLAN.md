# AI Agent Scope Builder — Implementation Plan

Standalone demo app for Incode Group. A 3-step wizard where a visitor picks how they'll use an AI agent, selects skills (and the tools those skills would connect to), leaves contact details, and gets a "Thank you" screen. The team then prepares a cost estimate manually.

This document is the source of truth for the implementation. Anything marked **Open question** must be confirmed before building that part — do not guess.

---

## 1. Scope

### In scope (this phase)
- Landing page, Step 1 (goal), Step 2 (skills), Step 3 (contacts), Success screen.
- Catalog data (goals, categories, skills, connectors) loaded through an API layer, **mocked** for now.
- Wizard progress persisted across page reloads.
- Two languages: Ukrainian (`uk`) and English (`en`). Locale is **not** in the URL.
- Desktop-only layout.
- Deployed to GitHub Pages as a static demo.

### Out of scope (later phases)
- Real backend and real submission (demo submit only logs the payload).
- Real OAuth connections to Google Drive, Notion, etc. In this phase connectors are **just tags** the user selects ("Connect to (optional)").
- The short form behind "Submit request in 1 click" / "Quick request" / "Another way" (design pending).
- Accounts / auth (app is anonymous).
- Mobile/tablet layouts.
- Analytics, cookie consent, captcha.

---

## 2. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Build | **Vite + React + TypeScript** (strict mode) | |
| Package manager | **pnpm** | |
| Routing | **React Router** (`createBrowserRouter`) | `basename` = GitHub Pages repo path |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite` | Design tokens from Figma |
| UI primitives | **shadcn/ui on Base UI** (`@base-ui/react`) | Init with `-b base`; restyle to the design |
| Client state | **Zustand** + `persist` middleware (localStorage) | |
| Server state | **TanStack Query** | |
| Validation | **Zod** | API responses + form |
| Forms | **React Hook Form** + `@hookform/resolvers/zod` | |
| i18n | **react-i18next** | UI strings only; content comes localized from API |
| Unit tests | **Vitest** + Testing Library | |
| E2E | **Playwright** | One full happy-path flow |
| Lint/format | ESLint + Prettier | |
| Deploy | GitHub Actions → GitHub Pages (`actions/deploy-pages`) | |

### shadcn on Base UI
```bash
pnpm dlx shadcn@latest init -b base
pnpm dlx shadcn@latest add accordion checkbox tooltip dropdown-menu progress button input
```
- Base UI uses a **`render` prop** for composition (not Radix's `asChild`), e.g. `<Button render={<Link to="/skills" />}>`.
- Do not add third-party components that depend on Radix APIs.
- Connector chips are a small custom toggle button (`aria-pressed`), not a library primitive.

---

## 3. Routes

| Path | Screen | Guard |
|---|---|---|
| `/` | Landing | — |
| `/goal` | Step 1 of 3 — goal | — |
| `/skills` | Step 2 of 3 — skills | No `goalId` → redirect `/goal` |
| `/contact` | Step 3 of 3 — contacts | 0 selected skills → redirect `/skills` |
| `/quick` | Short form ("Launch in 1 click") | — |
| `/success` | Thank you | No `location.state.submitted` → redirect `/` |

### GitHub Pages SPA routing
- `vite.config.ts`: `base: '/<repo-name>/'`.
- Router: `basename: import.meta.env.BASE_URL`.
- Build step copies `dist/index.html` → `dist/404.html` so deep-link refreshes (e.g. `/skills`) load the app.
- (Alternative if the 404 trick is undesirable: `createHashRouter`, URLs become `/#/skills`.)

---

## 4. Screens

All screens share the **Header**: Incode Group logo + "AI Agent / Scope Builder" label on the left; language switcher (`UK` / `EN` dropdown) and an outlined green **header CTA** on the right. The header CTA label changes per screen:

| Screen | Header CTA label | Action (this phase) |
|---|---|---|
| Landing | Get estimate | Navigate to `/goal` |
| Step 1, Step 2 | Quick request | Short form — **pending design**, no-op/disabled for now |
| Step 3, Success | Another way | Short form — **pending design**, no-op/disabled for now |

Wizard steps (1–3) share: **"Step N of 3" + progress bar** at the top of the left column, a **right-side panel** (grey background), and a **footer bar** with Back (outlined, left) and primary CTA (filled green, right).

### 4.1 Landing (`/`)
- Left column:
  - Badge with clock icon: "It will take less than 5 minutes".
  - Heading: "**Build an AI agent** for your business, for personal use, or both." — the first part is green.
  - Subtitle: "Answer a few questions, and we'll show you which tasks can be handed over to AI and what your agent could look like."
  - Buttons: **Get estimate →** (primary, → `/goal`), **Submit request in 1 click** (outlined, short form — pending design, no-op for now).
- Right column: illustration placeholder (asset from Figma).

### 4.2 Step 1 — Goal (`/goal`)
- Title: "How do you plan to use your AI agent?" Subtitle: "Choose one goal".
- Three selectable cards (single select), each: icon/image, title, description:
  - Personal / Productivity — Focus on personal effectiveness, routine, and learning
  - Business / Team — Focus on sales, marketing, support, and teamwork
  - All-in-One / Custom — Combine skills from all categories for a tailored solution
- Selected card: green border + light green tint.
- Right panel: preview of the selected goal (large image, title, description).
- Footer: primary **Choose skills →** (→ `/skills`). No back button on this step.
- Goal list comes from `getGoals(lang)`.

### 4.3 Step 2 — Skills (`/skills`)
- Title: "What should your agent learn?" Subtitle: "Choose one or more categories and skills".
- Categories are grouped under uppercase group headings (e.g. OPERATIONS & ADMIN, SALES & MARKETING, IT & ANALYTICS, SPECIALIZED ROLES). **Which categories appear depends on the selected goal** (from API).
- Each category is an **accordion row**: icon, title, description, `+` (collapsed) / `−` (expanded). Multiple categories can be open at once.
- Expanded category shows:
  - **"Select all skills"** link (green).
  - A list of **skill cards**, each with a checkbox and the skill text.
  - When a skill is checked, its card gets a green border + tint and reveals **"Connect to (optional)"** with an info icon. Tooltip text: "Please list the services you use. This is simply to gather requirements for the project assessment—there is no need to set up access at this stage."
  - Under it, **connector chips** for that skill's available connectors:
    - Selected: solid green chip with `×` (click to remove).
    - Not selected: outlined chip with `+` (click to add).
- **Right panel — Summary** (see 4.6).
- Footer: **← Back to agent goal** (→ `/goal`), primary **Share your contacts →** (→ `/contact`).
- **Primary button is disabled when 0 skills are selected.**

### 4.4 Step 3 — Contacts (`/contact`)
- Title: "Your AI agent's configuration is ready! 🎉"
- Text: "We have gathered the basic requirements. Please provide your contact details, and the Incode Group team will prepare a preliminary cost estimate and an implementation roadmap."
- Fields:
  - Name — required
  - Work email — required, email format only (no domain blocking)
  - Company name (optional)
- Right panel — Summary (see 4.6).
- Footer: **← Back to agent skills** (→ `/skills`), primary **Get my estimate →** (submit).

### 4.5 Success (`/success`)
- Centered: illustration placeholder, "Thank you!", "We'll contact you as soon as we've calculated the cost of your agent".
- No progress bar, no summary panel, no footer.

### 4.6 Summary panel (Steps 2 and 3)
Derived entirely from store + current-locale catalog (no separate state).
- Goal block: goal image, goal title, goal `description` (single field — the differing subtitle between Step 2 and Step 3 in the layouts is a design inconsistency; use `description` everywhere).
- "What your agent will do"
- One block per category that has ≥1 selected skill:
  - Category title + **`×`** — removes all selected skills of that category.
  - "Selected skills: N" · **Change** · **Hide skills**
    - **Change**: on Step 2, expand that category and scroll to it; on Step 3, navigate to `/skills` and do the same.
    - **Hide skills / Show skills**: local UI toggle of the bullet list.
  - Bulleted list of selected skill texts.
- Footer note: "Here is your agent's configuration. Feel free to make changes."

---

## 5. Data model & API

### 5.1 Types (validate with Zod)
```ts
type Locale = 'uk' | 'en';

interface Goal {
  id: string;                    // 'personal' | 'business' | 'all_in_one'
  title: string;
  description: string;
  image: string;                 // URL/path
  defaultSelectedSkills: { skillId: string; connectorIds: string[] }[];
}

interface CategoryGroup {
  id: string;                    // 'operations_admin', ...
  title: string;                 // 'OPERATIONS & ADMIN'
  categories: Category[];
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  skills: Skill[];
}

interface Skill {
  id: string;
  title: string;
  availableConnectors: Connector[];
}

interface Connector {
  id: string;                    // 'notion', 'google_drive', 'firecrawl', ...
  name: string;
}
```

### 5.2 Endpoints (one language per request)
```ts
getGoals(lang: Locale): Promise<Goal[]>
getCategories(goalId: string, lang: Locale): Promise<CategoryGroup[]>
submitEstimate(payload: EstimatePayload): Promise<void>
```
- `src/api/client.ts` switches between real fetch and mocks via `VITE_API_MODE=mock|live`.
- All responses parsed with Zod; on schema mismatch, throw (surface an error state, don't render broken data).
- **Demo `submitEstimate`**: `console.log(payload)`, resolve after ~800 ms.

```ts
interface EstimatePayload {
  locale: Locale;
  goalId: string;
  skills: { skillId: string; connectorIds: string[] }[];
  contact: { name: string; email: string; company?: string };
}
```

### 5.3 Mocks
- Location: `src/api/mocks/uk/*.json`, `src/api/mocks/en/*.json`.
- **IDs must be identical across locales**; only text differs.
- Mock adapter adds a small artificial delay (~300 ms).
- Per-goal category lists will be provided from Figma. Until then, use the All-in-One list below for all three goals.

Known content (EN) from the All-in-One Step 2 layout:

| Group | Category | Description |
|---|---|---|
| OPERATIONS & ADMIN | Search, documents and knowledge | Web research, document analysis, and instant answers from your knowledge base. |
| OPERATIONS & ADMIN | Communication & Meetings | Email management, meeting preparation, and smart transcript analysis. |
| SALES & MARKETING | CRM & Customer Support | Support ticket resolution, feedback analysis, and automated CRM updates. |
| SALES & MARKETING | Content, Writing & Websites | SEO copywriting, creative ad generation, and competitor monitoring. |
| IT & ANALYTICS | Data Analytics & Reporting | Data consolidation, user trend analysis, and automated reporting. |
| IT & ANALYTICS | Code & Infrastructure | Smart code review, technical documentation, and automated task tracking. |
| SPECIALIZED ROLES | Education & Learning | Complex topic explanation, personalized study plans, and language learning. |
| SPECIALIZED ROLES | Life & Personal Finance | Personal expense tracking, receipt categorization, and travel planning. |
| SPECIALIZED ROLES | HR & Recruitment | Resume screening, candidate shortlisting, and team onboarding support. |
| SPECIALIZED ROLES | Legal & Finance | Financial data comparison, compliance verification, and risk management. |

Skills of "Search, documents and knowledge":
1. Analyze markets, competitors, or specific topics by comparing facts across multiple sources. — connectors include Firecrawl (others pending Figma)
2. Turn long documents (even 100+ pages) into short, easy-to-read summaries. — Notion, Google Drive
3. Organize scattered company rules and guidelines into a single, searchable knowledge base. — Notion, Google Drive
4. Find hidden risks in complex contracts and draft ready-to-send reply letters. — connectors pending Figma

All-in-One `defaultSelectedSkills` (from layout): skills 1–3 above, with Firecrawl on skill 1 and Notion on skills 2 and 3.

Skills for other categories, Ukrainian texts, and per-goal defaults for Personal/Business: **pending Figma mocks** — use clearly marked placeholders.

---

## 6. State (Zustand, persisted)

```ts
interface WizardState {
  version: 1;
  locale: Locale;                                   // default: 'uk' (see open questions)
  goalId: string | null;
  selectionsGoalId: string | null;                  // goal the selections were seeded for
  selections: Record<string /*skillId*/, { categoryId: string; connectorIds: string[] }>;
  contact: { name: string; email: string; company?: string };
}
```
- Persist key: `scope-builder-wizard`. Include `version` + `migrate` from day one.
- Persist `contact` so a reload on Step 3 keeps typed values.
- Selections store **IDs only** — labels always come from the current-locale catalog.

### Actions
- `setLocale(locale)`
- `setGoal(goalId)`
- `seedDefaults(goal, catalog)` — see 6.1
- `toggleSkill(skillId, categoryId)` — unchecking removes its connectors too
- `toggleConnector(skillId, connectorId)`
- `selectAllInCategory(category)`
- `clearCategory(categoryId)`
- `setContact(partial)`
- `resetWizard()` — clears everything **except `locale`**

### Selectors
- `selectedSkillCount`, `canContinueFromSkills = selectedSkillCount > 0`
- `selectedByCategory(catalog)` → summary panel data
- `isCategoryFullySelected(category)`

### 6.1 Default pre-selection (Step 2)
Goal: the user never lands on Step 2 with a disabled primary button.

- When Step 2 mounts and the catalog for the current goal has loaded:
  - If `selectionsGoalId !== goalId` → call `seedDefaults`:
    - Replace `selections` with the goal's `defaultSelectedSkills` (skills **and** their connectors).
    - Filter out any skill IDs not present in the catalog and any connector IDs not in that skill's `availableConnectors`.
    - Set `selectionsGoalId = goalId`.
    - Done in **one** store update (no visible "empty then filled" flicker).
  - Otherwise → do nothing.
- Consequences:
  - First visit to Step 2: defaults applied, summary filled, button active.
  - Reload / Back→Next with the same goal: user's selections kept, even if they unchecked everything (button then correctly disabled).
  - Changing the goal on Step 1: next Step 2 visit re-seeds with the new goal's defaults.
  - Changing language: never re-seeds.
- **Initially expanded categories** = those containing selected skills (in the layout: "Search, documents and knowledge").
- Show a skeleton until the catalog is loaded on first load, so a disabled button never flashes.

---

## 7. Internationalization

- Languages: `uk`, `en`. No locale in URL. Current locale lives in the Zustand store (persisted).
- **UI strings** (titles, buttons, labels, tooltip, validation messages): `src/i18n/locales/uk.json`, `en.json` via react-i18next. Maintained by developers.
- **Content** (goals, categories, skills, connectors): fetched per locale from the API.
  - TanStack Query keys include the locale: `['goals', locale]`, `['categories', goalId, locale]`.
  - Use `placeholderData: keepPreviousData` so switching language keeps old content visible until the new one arrives (skeleton only on first load).
- On `setLocale`: call `i18n.changeLanguage(locale)` and set `<html lang>`.
- Language switcher label shows the current code (`UK` / `EN`).
- Because Zustand reads localStorage synchronously, the persisted locale is known before the first render — no flash of the wrong language.

---

## 8. Submit flow (Step 3)

1. Validate with Zod (`name` non-empty, `email` valid format, `company` optional).
2. Build `EstimatePayload` from store.
3. Call `submitEstimate`; primary button shows loading state and is disabled while pending (no double submit).
4. On success: `resetWizard()` (keeps locale) → `navigate('/success', { state: { submitted: true }, replace: true })`.
5. Reloading `/success` (state lost) → redirect to `/`. Going back from `/success` lands on a fresh wizard.
6. On error (live mode later): show inline error, keep form values.

---

## 9. Project structure

```
src/
  main.tsx
  router.tsx
  routes/
    Landing.tsx
    QuickRequest.tsx
    Success.tsx
    guards.tsx          # RequireSubmitted
    wizard/             # everything owned by the 3-step wizard
      guards.tsx        # RequireGoal, RequireSkills
      components/       # StepHeader, WizardFooter, SummaryPanel, WizardLayout
      goal/             # GoalStep + GoalCard, GoalPreview
      skills/           # SkillsStep (+ test) + CategoryGroup, CategoryAccordion, SkillCard, ConnectorChips
      contact/          # ContactStep
  components/
    ui/                 # shadcn (Base UI) primitives
    layout/             # Header, LanguageSwitcher, HeaderCta
    common/             # shared across pages (ButtonLink, FormField, ImagePlaceholder, …)
  api/
    client.ts
    catalog.ts          # getGoals, getCategories
    submit.ts           # submitEstimate
    schemas.ts          # Zod schemas + inferred types
    queries.ts          # TanStack Query hooks
    mocks/
      en/goals.json
      en/categories.<goalId>.json
      uk/goals.json
      uk/categories.<goalId>.json
  store/
    wizard.ts
    selectors.ts
  i18n/
    index.ts
    locales/en.json
    locales/uk.json
  styles/
    index.css           # Tailwind + design tokens
  test/
e2e/
  wizard.spec.ts
```

---

## 10. Design implementation notes

- Take colors, typography, spacing, and icons from Figma; define them as Tailwind v4 theme tokens in `index.css`. Do not eyeball values from screenshots.
- Visual language: flat, square corners, 1–2 px borders, single green accent, light grey panels.
- Button variants: primary (filled green), secondary (green outline, green text), back (dark outline with ←).
- Selected states (goal card, skill card): green border + light green background.
- Illustrations and goal/category icons are placeholders in the layouts; use Figma assets when available, otherwise neutral grey placeholders.
- Desktop only; set a sensible min-width for the layout container.
- Accessibility: keyboard-operable accordion/checkboxes/chips, visible focus, labels on inputs, `aria-pressed` on chips, `aria-disabled` reasoning on the disabled primary button.

---

## 11. Deployment (GitHub Pages)

- `.github/workflows/deploy.yml`: on push to `main` → `pnpm install` → `pnpm build` → copy `index.html` to `404.html` → upload `dist` → `actions/deploy-pages`.
- Repo Settings → Pages → Source: GitHub Actions.
- Build env: `VITE_API_MODE=mock`.

---

## 12. Phases & acceptance criteria

### Phase 1 — Scaffold
- Vite + TS + Tailwind v4 + shadcn (Base UI) + React Router + react-i18next + Zustand + TanStack Query set up.
- Header with working language switch (persisted).
- Empty route shells for all 5 routes.
- Deployed to GitHub Pages; deep-link refresh works.

### Phase 2 — Data layer
- Zod schemas, mock adapter, per-locale fixtures, query hooks.
- Language switch refetches content without losing selections.

### Phase 3 — Screens
- Landing, Step 1, Step 2 (accordion, checkboxes, select all, connector chips, tooltip, summary panel, pre-selection), Step 3 (form, submit), Success.
- Guards as in §3.
- Progress survives reload on every step.

### Phase 4 — Tests & polish
- Unit tests:
  - Defaults seeded once per goal.
  - Reload keeps a deselected state (no re-seed).
  - Goal change re-seeds.
  - Language change does not re-seed.
  - Invalid default skill/connector IDs filtered out.
  - Primary button disabled at 0 skills.
  - Unchecking a skill removes its connectors.
  - Category `×` clears only that category.
  - `resetWizard` keeps locale.
- Playwright: landing → goal → skills (keep defaults) → contact → submit → success; reload on `/success` redirects to `/`.
- Loading/error states.

### Phase 5 — Later
- Short form ("Submit request in 1 click" / "Quick request" / "Another way").
- Real backend + submission.
- Real OAuth connectors (needs a server; not possible on GitHub Pages).

---

## 13. Open questions

### Resolved (2026-10-01)
1. **Default locale:** from browser language (`uk*` → `uk`, `en*` → `en`, anything else → `uk`). Persisted after that.
2. **Step 1 default:** All-in-One (`all_in_one`) is pre-selected on first visit; "Choose skills" is always enabled.
3. **"Select all skills"** becomes **"Unselect all skills"** when every skill in the category is selected (per `docs/design/Step 2 - Personal - Skills.png`).
4. **Removing the last category on Step 3** → redirect to `/skills` (same rule as the route guard).
5. **Short form** is built in this phase as **`/quick`** (design: `docs/design/Launch in 1 click.png`):
   - Fields: Name (required), Work email (required), Agent name idea (optional), "Tell us why you need an agent" (optional textarea). Primary: **Submit request**.
   - Right side: illustration placeholder. No progress bar / summary / footer.
   - Landing "Submit request in 1 click", header "Quick request" and "Another way" → `/quick`.
   - Header CTA on `/quick` and `/success`: **Get estimate** (→ `/goal`), per the designs.
   - Submit: demo `submitQuickRequest` (logs, ~800 ms) → `/success` with `state.submitted`. Does **not** reset wizard progress.
6. **From the PNGs in `docs/design/`:** per-goal category lists, all EN skill texts, and Personal/Business defaults are now known (encoded in mocks). Personal/Business Step 2 also shows "Can't find a skill? **Switch to All-in-One** to see more advanced capabilities" below the list → sets goal to `all_in_one` (re-seeds per §6.1).

### Still pending
- Figma file link (exact tokens, icons, illustrations, logo). Until then tokens in `src/index.css` are placeholders.
- Ukrainian copy: content mocks and `uk.json` hold **draft translations** that need review.
- Connectors for most skills (only "Search, documents and knowledge" has them; other skills show no "Connect to" block).
- Goal card vs. preview subtitle: the designs use a different subtitle in the Step 1 preview and the summary (e.g. "A fully customizable agent tailored to your exact needs"). The app uses `description` everywhere, per §4.6. Adding a separate field needs an API change.
