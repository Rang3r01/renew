# Renew Health Supplies — Implementation Plan

## Phase 1: Vite Migration (DONE)

- [x] Replaced CDN/Babel setup with a proper Vite + React project
- [x] Created `package.json` with Vite, React, `@clerk/clerk-react`, `@supabase/supabase-js`
- [x] Created `vite.config.js`
- [x] Updated `index.html` to use Vite module entry point (`/src/main.jsx`)
- [x] Created `src/index.css` with global reset styles
- [x] Project builds cleanly (`npm run build` passes)

## Phase 2: Modular File Structure (DONE)

- [x] `src/main.jsx` — app entry point, conditionally wraps with ClerkProvider when key is set
- [x] `src/App.jsx` — root component with all routing and state
- [x] `src/hooks/useResponsive.js` — responsive breakpoint hook
- [x] `src/hooks/useTweaks.js` — tweaks panel state hook
- [x] `src/hooks/useProducts.js` — Supabase product CRUD hook with realtime subscription
- [x] `src/hooks/useOrders.js` — Supabase order CRUD hook with realtime subscription
- [x] `src/pages/LandingPage.jsx` — full landing page (hero, categories, features, testimonials, CTA, footer)
- [x] `src/pages/StorePage.jsx` — product grid with search, filter, sort, cart badge
- [x] `src/pages/ProductDetailPage.jsx` — product detail with qty selector and add-to-cart
- [x] `src/pages/CartPage.jsx` — cart review, checkout form, Payfast payment integration
- [x] `src/pages/AdminPage.jsx` — admin dashboard with revenue stats, orders, products, customers
- [x] `src/pages/PaymentSuccessPage.jsx` — post-payment success screen
- [x] `src/pages/PaymentCancelPage.jsx` — post-payment cancel/failure screen
- [x] `src/components/AuthModal.jsx` — demo sign in / sign up modal
- [x] `src/components/TweaksPanel.jsx` — floating tweaks panel with color, toggle controls
- [x] `src/components/ClerkAuthUI.jsx` — Clerk sign-in/sign-up modals (ready, awaiting key)
- [x] `src/components/PayfastButton.jsx` — Payfast payment button component
- [x] `src/contexts/AuthContext.jsx` — Clerk-aware auth context (ready, awaiting key)
- [x] `src/lib/supabase.js` — Supabase singleton client

## Phase 3: Supabase Database (DONE)

- [x] Schema: `products` table (name, brand, category, price, stock, description, features, active, image_url)
- [x] Schema: `orders` table (id, customer, email, phone, item_count, total, status, date, items jsonb, delivery_address jsonb, payment fields)
- [x] RLS policies on both tables (anon read for products, authenticated write for orders)
- [x] Supabase Storage bucket `product-images` with public read policy
- [x] `useProducts` hook — fetches products, handles create/update/delete, image upload to Storage
- [x] `useOrders` hook — fetches orders, creates orders, maps `delivery_address` back to `deliveryAddress`
- [x] Realtime subscriptions on both `products` and `orders` tables (INSERT + UPDATE events)
- [x] `decrement_stock` Postgres function to atomically reduce stock on confirmed payment
- [x] Migrations in `supabase/migrations/`

## Phase 4: Payfast Integration (DONE)

- [x] `supabase/functions/payfast-sign/index.ts` — Edge Function that generates a signed Payfast payment URL
- [x] `supabase/functions/payfast-notify/index.ts` — Edge Function that handles the Payfast ITN webhook:
  - Verifies payment signature
  - Updates order status to `paid`
  - Decrements stock for each item in the order by name + brand
- [x] `PayfastButton` component calls `payfast-sign` and redirects to Payfast
- [x] Success and cancel redirect pages

## Phase 5: Admin Dashboard (DONE)

- [x] Dashboard tab — revenue total, order count, product count, low-stock count; recent orders table
- [x] Products tab — searchable product list with inline edit/delete; Add Product form modal with image upload
- [x] Orders tab — full order list with clickable rows opening an order detail modal
- [x] Customers tab — aggregated customer list with total spend, order count; customer modal with all their orders
- [x] Order detail modal shows: customer info, fulfillment method / delivery address, itemised line items, total
- [x] Customer modal order cards show: fulfillment method / delivery address per order
- [x] `delivery_address` field read back from Supabase into `deliveryAddress` on every order (fixed in `dbToOrder`)
- [x] Realtime order updates reflected immediately without refresh
- [x] Mobile-responsive: sidebar on desktop, bottom tab bar on mobile

## Phase 6: Checkout & Fulfillment (DONE)

- [x] Fulfillment selector: Store Pickup (free) vs Delivery
- [x] Delivery sub-methods via Courier Guy:
  - **PUDO Locker** — customer enters closest locker location name; shipping R 80.00
  - **Door-to-Door** — customer enters street address, city, postal code; shipping R 150.00
- [x] Shipping cost calculated live in order summary sidebar and payment summary
- [x] Validation: delivery method + address fields required only when relevant
- [x] `deliveryAddress` object stored in Supabase `orders.delivery_address` with `fulfillment`, `deliveryMethod`, `address`, `city`, `postal`
- [x] Admin correctly displays: "Store Pickup", "PUDO Locker (Courier Guy)", or "Door-to-Door (Courier Guy)" with address

## Phase 7: Clerk Authentication (PENDING — awaiting Publishable Key)

- [ ] Add `VITE_CLERK_PUBLISHABLE_KEY` to `.env`
- [ ] Switch `main.jsx` to always use `ClerkProvider`
- [ ] Replace demo `AuthModal` with Clerk's `<SignIn>` / `<SignUp>` components
- [ ] Map Clerk `useUser()` to app user state (name, email, isAdmin from `publicMetadata`)
- [ ] Wire Clerk `signOut()` to the logout button in StorePage / AdminPage
- [ ] Set `isAdmin: true` on admin users via Clerk dashboard (`publicMetadata`)
