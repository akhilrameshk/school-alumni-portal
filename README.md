# Samanvayam – SDV HSS Alumni Association website

Next.js 14 (App Router) · MongoDB (Mongoose) · Material UI · Razorpay

## What is included
**Public site** (common header + footer, mobile friendly)
- Dark green + gold design. `/` Home: school-and-friends hero, next-meet countdown, Register / Renew card, events & announcements, ad spots, photo gallery
- `/about`, `/events` (upcoming, past, announcements), `/committee` (tree of 11 members), `/gallery` (albums + photos), `/contact`, `/privacy`
- Registration (₹100) and Renewal, both paid through Razorpay

**Admin** (`/admin`, login required) – four tabs
1. **Members** – list with Valid until / Days left, search, batch / profession filters, last amount paid, last paid on, total amount paid, total collected, approve / edit / delete, record an offline payment, **Add member**, **Bulk upload (CSV)**, **Export (Excel / CSV)**
2. **Events & Announcements** – add / edit / delete, publish or save as draft
3. **Gallery** – upload several photos, albums, captions, edit / delete
4. **Advertisements** – direct sponsor banners: upload, link, show-from / show-until dates, on / off

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill it (MongoDB URI, `JWT_SECRET`, admin email, Razorpay keys, fees)
3. Create the admin password hash: `npm run hash -- "YourPassword"` and paste the printed `ADMIN_PASSWORD_HASH=...` line into `.env.local`
4. `npm run dev` → http://localhost:3000 and http://localhost:3000/admin

## Razorpay
- Use **Test mode** first. Live mode needs the association's own KYC-approved account.
- Webhook (recommended, it marks payments even if the visitor closes the tab):
  Dashboard → Settings → Webhooks → URL `https://YOUR-DOMAIN/api/razorpay/webhook`, events `payment.captured` and `order.paid`, secret = `RAZORPAY_WEBHOOK_SECRET`.
- The amount is decided on the server from `NEXT_PUBLIC_REGISTRATION_FEE_INR` / `NEXT_PUBLIC_RENEWAL_FEE_INR`.
- Every successful payment is stored once (safe against duplicates) in the member's payment history; the Members tab shows last amount, last date and total.

## Bulk upload (CSV)
- Admin → Members → *Bulk upload (CSV)* → download the template (`name,batch,mobile,email,location,profession`).
- The file is checked in the browser and again on the server. Wrong batches, bad mobile / email and duplicates are listed and skipped; the rest are imported as **approved** members.
- You can mark imported members as *Paid (offline)* with an optional amount; otherwise they stay *Pending* and can pay by using **Register** with the same mobile / email.

## Photos and banners (Cloudinary)
- Admin uploads (gallery photos, event images, sponsor banners) are compressed in the browser (max 1600 px) and sent to **Cloudinary**.
  Only the image URL is saved in MongoDB, so the database and the project stay small.
- Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` (Cloudinary Dashboard -> Settings -> API Keys) in `.env.local`. The secret is used only on the server.
- Photos are shown resized (`f_auto,q_auto`), and deleting a photo / banner / event also deletes the file from Cloudinary.
- If the three variables are empty, uploads fall back to MongoDB so you can test locally.
- Check your Cloudinary plan limits for storage and bandwidth.

## Things to edit
- `lib/config.js` – batch range (`LAST_BATCH`), address, phone, email, **committee names** (tree of 11)
- `public/logo.jpg` – final logo
- `lib/theme.js` – colours and fonts

## Deploy
Vercel + MongoDB Atlas. Add the same environment variables in Vercel (no backslashes before `$` there; the `\$` escaping is only for `.env` files). Allow the deployment in Atlas Network Access.

## Security notes
- `/admin` and `/api/admin/*` are protected by `middleware.js` (JWT in an httpOnly cookie, login rate-limited).
- No public API returns member data. The renewal lookup returns only a masked name.
- Razorpay secrets stay on the server.

## Advertisements (4 spots on every public page)
- Each public page has up to 4 ad spots (Home 4, About 4, Gallery 4, Committee 2, Contact 2). Change how many a page shows in `lib/config.js` → `ADS.perPage`.
  Short pages (Committee, Contact) look better with 2.
- Spot *n* shows the *n*-th active sponsor banner from Admin → Advertisements. A spot with no sponsor shows a **Google AdSense** ad.
- To switch on AdSense: create the account, add your site, then create two ad units (a horizontal banner and a rectangle) and put
  `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT_BANNER` and `NEXT_PUBLIC_ADSENSE_SLOT_RECT` in the environment.
  `/ads.txt` is generated automatically. The page `/privacy` is the privacy policy Google asks for (have it reviewed).
- No ads are loaded in `/admin` or in the payment pop-ups.
- Never click your own ads and ask members not to: Google treats that as invalid activity and can ban the account.
- Expect small earnings from AdSense on a site of this size; sponsor banners usually pay much more.

## Subscription days
Every successful payment (registration, renewal, or an offline payment recorded by the admin) adds `NEXT_PUBLIC_MEMBERSHIP_DAYS` (default 365) to the member's `validUntil`.
If the member is still valid, the days are added to the current end date, otherwise they start from today.
The Renew pop-up shows the member's masked name and how many days are left (or how long ago it expired). The Members tab shows *Valid until* and *Days left*, and the CSV export includes both.

## Design notes
- The public site uses its own dark theme (`lib/siteTheme.js`); the admin keeps the light theme (`lib/theme.js`).
- The hero illustration is in `components/Scene.js`.

## Admin panel: how to get in (step by step)
There is **no admin user in the database**. The login comes from environment variables, so there is nothing to create or migrate.
1. `npm install`, then copy `.env.example` to `.env.local`.
2. Put your MongoDB address in `MONGODB_URI` (the admin screens read and write data there).
3. Choose the admin login in `.env.local`: `ADMIN_USERNAME=...` and `ADMIN_PASSWORD=...` (use `ADMIN_PASSWORD_HASH` instead for extra safety).
4. Add `JWT_SECRET` (any long random text) and the three `CLOUDINARY_*` values.
5. `npm run dev`, open http://localhost:3000/admin and sign in.
- **Default login (development only):** while you run `npm run dev` and have not set a username / password, `admin` / `admin123` works, and the login page says so. In production (`npm run build` / `npm start` / Vercel) there is no default: set the variables or nobody can log in.
- Restart the server after changing `.env.local`.

## Batches grow by themselves
`lib/config.js` computes the batches: first batch 2000, latest batch = last calendar year. So the site shows 26 batches in 2026 (2000-2025) and 27 from January 2027, everywhere:
the hero text, About page, registration / renewal batch list, admin filters and bulk-upload validation. Override with `NEXT_PUBLIC_FIRST_BATCH` / `NEXT_PUBLIC_LAST_BATCH` if the association counts differently.
