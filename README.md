# 🚀 My Portfolio - Frontend Site Documentation

[![React](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646cff?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38b2ac?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## Application Overview

The frontend is a single-page application that handles two experiences:

1. **Public visitor site** – Hero, about, skills, education, services, projects, and contact sections.
2. **Admin dashboard** – Protected interface for updating every content module in real time.

The UI is component-driven (shadcn/ui + Tailwind CSS) with Redux Toolkit orchestrating state and Axios handling API calls. Routing is managed by React Router v7 with separate layouts for public and admin areas.

## Key Features (My Checklist)

- Responsive landing page with animated hero and dynamic content sections
- Dedicated project gallery with filtering and rich cards
- Contact form with toast feedback and backend email integration
- OTP-gated admin settings for changing email or password
- Dark/light theming via `next-themes` with persisted preference
- Skeleton loaders for all major sections to mask API latency

## Screenshot Reference

| Area | Screenshot |
| --- | --- |
| Public hero | ![Hero](./src/assets/portfolio_web-view_screenshorts/user-view-hero-section.png) |
| About section | ![About](./src/assets/portfolio_web-view_screenshorts/user-view-about-section.png) |
| Skills section | ![Skills](./src/assets/portfolio_web-view_screenshorts/user-view-skills-section.png) |
| Education timeline | ![Education](./src/assets/portfolio_web-view_screenshorts/user-view-education-section.png) |
| Services section | ![Services](./src/assets/portfolio_web-view_screenshorts/user-view-services-section.png) |
| Featured projects | ![Featured Projects](./src/assets/portfolio_web-view_screenshorts/user-view-feature_project-section.png) |
| All projects page | ![Projects Listing](./src/assets/portfolio_web-view_screenshorts/user-view-all-project-page-section.png) |
| Contact page | ![Contact](./src/assets/portfolio_web-view_screenshorts/user-view-contact-page-section.png) |
| Footer | ![Footer](./src/assets/portfolio_web-view_screenshorts/user-view-footer-section.png) |
| Admin auth | ![Admin Auth](./src/assets/portfolio_web-view_screenshorts/portfolio-auth-page-section.png) |
| Admin dashboard (top) | ![Dashboard Top](./src/assets/portfolio_web-view_screenshorts/admin-view-dashboard-up-section.png) |
| Admin dashboard (bottom) | ![Dashboard Bottom](./src/assets/portfolio_web-view_screenshorts/admin-view-dashboard-down-section.png) |
| Hero management | ![Hero Management](./src/assets/portfolio_web-view_screenshorts/admin-view-hero-section.png) |
| About management | ![About Management](./src/assets/portfolio_web-view_screenshorts/admin-view-about-section.png) |
| Education management | ![Education Management](./src/assets/portfolio_web-view_screenshorts/admin-view-education-section.png) |
| Skills management | ![Skills Management](./src/assets/portfolio_web-view_screenshorts/admin-view-skills-section.png) |
| Services management | ![Services Management](./src/assets/portfolio_web-view_screenshorts/admin-view-services-section.png) |
| Projects management | ![Projects Management](./src/assets/portfolio_web-view_screenshorts/admin-view-projects-section.png) |
| Contact details | ![Contact Details](./src/assets/portfolio_web-view_screenshorts/admin-view-contact-details-section.png) |
| Messages inbox | ![Messages](./src/assets/portfolio_web-view_screenshorts/admin-view-messages-section.png) |
| Settings (OTP) | ![Settings](./src/assets/portfolio_web-view_screenshorts/admin-view-settings-section.png) |

## Tech Stack Snapshot

| Layer | Choice |
| --- | --- |
| Framework | React 19 (ESM, hooks everywhere) |
| Router | React Router v7 with nested layouts |
| State | Redux Toolkit slices + RTK async thunks |
| HTTP | Axios with interceptors + `withCredentials` |
| Styling | Tailwind CSS, shadcn/ui, Radix UI primitives |
| Icons | Lucide React, Font Awesome |
| Theming | `next-themes` for dark/light handling |
| Notifications | Sonner toasts |
| Tooling | Vite 7, ESLint, Prettier, TypeScript type defs |

## Folder Structure (High-Level)

```
frontend/
├─ public/              # Static assets
├─ src/
│  ├─ assets/           # Images and media
│  ├─ components/
│  │  ├─ admin-view/    # Admin-specific UI building blocks
│  │  ├─ auth/          # Login + OTP components
│  │  ├─ common/        # Hooks/utilities shared across app
│  │  ├─ loaders/       # Skeleton placeholders
│  │  ├─ ui/            # shadcn-based primitives
│  │  └─ user-view/     # Public section components
│  ├─ config/           # API definitions and static content configs
│  ├─ pages/            # Route-level components (admin/auth/client)
│  ├─ store/            # Redux slices & store setup
│  ├─ lib/              # Utility helpers
│  ├─ App.jsx           # Routing shell
│  ├─ main.jsx          # Entry point
│  └─ index.css         # Tailwind base + custom styles
├─ package.json
└─ README.md (this document)
```

## Local Dev Routine

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `.env.example` (if it exists) or create `.env` with `VITE_BASE_URL` pointing to the backend (default `http://localhost:8000`).
3. Start the dev server
   ```bash
   npm run dev
   ```
4. Navigate to `http://localhost:5173`.

### Scripts I Use

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build (outputs `dist/`) |
| `npm run preview` | Test the built output locally |
| `npm run lint` | ESLint sweep before commits |

## Environment Variables

- `VITE_BASE_URL` – Required. Backend base URL for Axios. Remember to flip this to the production domain before taking a release live.

All other runtime values come from the backend responses.

## State & Networking Notes

- All endpoints are defined in `src/config/api.js`. Keeping them centralized avoids typo bugs.
- Async thunks in each slice (e.g., `auth.slice.js`, `hero.slice.js`) encapsulate request logic and dispatch toast notifications.
- `withCredentials: true` is set globally to pass the JWT cookie exchanged during login.
- Optimistic UI updates are limited to safe operations; destructive actions wait for server confirmation.

## Styling System

- Tailwind handles layout, spacing, and responsive utilities.
- shadcn/ui primitives provide accessible base components; custom variants live in `components/ui/`.
- `clsx` + `tailwind-merge` keep class strings manageable.
- Theme toggling is wired to `localStorage` via `next-themes`; default follows system preference.

## Deployment Checklist

1. Update `VITE_BASE_URL` to the production API.
2. Run `npm run build`.
3. Deploy `dist/` to the hosting provider (currently Netlify). Ensure headers allow credentials.
4. Smoke test key flows: public homepage, project listing, admin login, hero update, contact form.

## Maintenance Habits

- Review screenshots quarterly and refresh as the UI evolves.
- Keep dependencies current; focus on React, Vite, and Tailwind releases twice a year.
- Validate lighthouse scores after major UI updates to maintain performance targets.
- Periodically audit Redux slices for dead code when retiring features.

## Known Considerations

| Topic | Notes |
| --- | --- |
| Auth redirects | `CheckAuth` component ensures protected routes bounce to login when token missing |
| Mobile UX | `useMobileHook` toggles layout tweaks below 768px |
| Security | `useDisableContextMenuAndCopy` is applied on admin pages to reduce casual copying |
| Asset sizes | Optimize hero/project images before upload to keep load times low |


## Maintainer

**Samrat Mallick**  
[LinkedIn](https://www.linkedin.com/in/samrat-mallick01/) · [GitHub](https://github.com/samratmallick-dev) · [Email](mailto:samratmallick832@gmail.com)

---

<div align="center">
  Build by ❤️ Samrat Mallick ❤️<br/>
  &copy;Samrat Mallick - Portfolio. All rights reserved.
</div>
