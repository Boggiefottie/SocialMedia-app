# SocialConnect (Next.js + Prisma + Supabase)

End-to-end implementation of the assignment using **Next.js (App Router)** and **Prisma** with **PostgreSQL (Supabase)**.

## Quick Start

```bash
npm install
cp .env.example .env  # fill values
npx prisma migrate dev --name init
npm run seed
npm run dev
```

## Notes

- Email verification and password reset return the token in API response for demo (you would email in production).
- Image uploads go to Supabase Storage with server-side validation (PNG/JPEG, <=2MB).
- Realtime notifications: frontend subscribes to INSERT on `Notification` table via Supabase Realtime.
  - Ensure your Supabase project has Realtime enabled for `public.Notification`.
- JWT access/refresh; refresh blacklist stored in `RefreshToken`.
- Admin endpoints require role=ADMIN.
