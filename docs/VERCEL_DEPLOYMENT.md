# Vercel Deployment Guide for TiffinHub

## Prerequisites

- GitHub account with TiffinHub repo pushed
- Supabase project configured (see `SUPABASE_SETUP.md`)
- Razorpay keys (see `RAZORPAY_SETUP.md`)

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial TiffinHub release"
git remote add origin https://github.com/your-username/tiffinhub.git
git push -u origin main
```

## 2. Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your GitHub repository
4. Framework Preset: **Next.js** (auto-detected)
5. Root Directory: `.` (default)

## 3. Environment Variables

Add these in Vercel Project Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_OWNER_PHONE` | Owner WhatsApp number |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID |
| `RAZORPAY_KEY_ID` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |

## 4. Update Supabase Auth Redirect

In Supabase **Authentication → URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/auth/callback`

## 5. Update Google OAuth

Add production redirect URI in Google Cloud Console:
```
https://your-project.supabase.co/auth/v1/callback
```

## 6. Deploy

Click **Deploy**. Vercel will build and deploy automatically.

## 7. Custom Domain (Optional)

1. Vercel Project → Settings → Domains
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` and Supabase redirect URLs

## 8. Post-Deployment Checklist

- [ ] Register admin user and promote via SQL
- [ ] Test Google login
- [ ] Test email/password login
- [ ] Place a test order
- [ ] Verify WhatsApp notification opens
- [ ] Test Razorpay payment in test mode
- [ ] Verify admin dashboard access
- [ ] Test realtime order tracking
