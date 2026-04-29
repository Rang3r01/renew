# Renew Health Supplies — Implementation Plan

## Phase 1: Vite Migration (DONE)

- [x] Replaced CDN/Babel setup with a proper Vite + React project
- [x] Created `package.json` with Vite, React, `@clerk/clerk-react`, `@supabase/supabase-js`
- [x] Created `vite.config.js`
- [x] Updated `index.html` to use Vite module entry point (`/src/main.jsx`)
- [x] Created `src/index.css` with global reset styles
- [x] Project builds cleanly (`npm run build` passes, ~233 KB bundle)

## Phase 2: Modular File Structure (DONE)

- [x] `src/main.jsx` — app entry point, conditionally wraps with ClerkProvider when key is set
- [x] `src/App.jsx` — root component with all routing and state
- [x] `src/hooks/useResponsive.js` — responsive breakpoint hook
- [x] `src/hooks/useTweaks.js` — tweaks panel state hook
- [x] `src/pages/LandingPage.jsx` — full landing page (hero, categories, features, testimonials, CTA, footer)
- [x] `src/pages/StorePage.jsx` — product grid with search, filter, sort, cart badge
- [x] `src/pages/ProductDetailPage.jsx` — product detail with qty selector and add-to-cart
- [x] `src/pages/CartPage.jsx` — cart review, checkout form, order confirmation
- [x] `src/pages/AdminPage.jsx` — admin dashboard with revenue, orders, products
- [x] `src/components/AuthModal.jsx` — demo sign in / sign up modal
- [x] `src/components/TweaksPanel.jsx` — floating tweaks panel with color, toggle controls
- [x] `src/components/ClerkAuthUI.jsx` — Clerk sign-in/sign-up modals (ready, awaiting key)
- [x] `src/contexts/AuthContext.jsx` — Clerk-aware auth context (ready, awaiting key)

## Phase 3: Clerk Authentication (PENDING — awaiting your Publishable Key)

- [ ] Add `VITE_CLERK_PUBLISHABLE_KEY` to `.env`
- [ ] Switch `main.jsx` to always use `ClerkProvider`
- [ ] Replace demo `AuthModal` with Clerk's `<SignIn>` / `<SignUp>` components
- [ ] Map Clerk `useUser()` to app user state (name, email, isAdmin from `publicMetadata`)
- [ ] Wire Clerk `signOut()` to the logout button in StorePage / AdminPage
- [ ] Set `isAdmin: true` on admin users via Clerk dashboard (`publicMetadata`)

## Phase 4: Supabase Database (PENDING)

- [ ] Design schema: `products`, `orders`, `order_items`, `users`
- [ ] Apply migrations with RLS policies
- [ ] Replace `INITIAL_PRODUCTS` / `INITIAL_ORDERS` in-memory state with Supabase queries
- [ ] Persist cart checkout as real orders in Supabase
- [ ] Wire admin product CRUD to Supabase

## Phase 5: Features & Polish (PENDING)

- [ ] Restore full admin dashboard (Products tab, Orders tab, Customers tab)
- [ ] Product image upload to Supabase Storage
- [ ] Order status management in admin
- [ ] Search and filter persistence
- [ ] Mobile-optimised admin bottom tab bar

---

## How to test right now

1. The landing page, store, cart, product detail, and admin are all wired and visible.
2. Sign in using any email/password in the demo modal.
   - Use `admin@renew.co.za` with any password to access the Admin panel.
3. Clerk authentication will activate automatically once you paste a Publishable Key into `.env`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
   ```
