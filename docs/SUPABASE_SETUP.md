# Supabase Setup Guide for TiffinHub

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose organization, name it `tiffinhub`, set a database password
4. Select a region close to your users (e.g., Mumbai for India)
5. Wait for the project to provision

## 2. Run Database Migrations

1. Open **SQL Editor** in your Supabase dashboard
2. Copy and run `supabase/migrations/001_initial_schema.sql`
3. Copy and run `supabase/migrations/002_seed_data.sql` for sample menu items
4. If signup fails with `relation "profiles" does not exist`, run `supabase/migrations/003_fix_schema_qualified_references.sql`

## 3. Configure Authentication

### Email/Password Auth
- Go to **Authentication → Providers → Email**
- Enable Email provider
- Configure email templates if needed

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials (Web application)
3. Add authorized redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
4. In Supabase: **Authentication → Providers → Google**
5. Enable Google and paste Client ID + Client Secret

## 4. Configure Storage

The migration creates a `menu-images` bucket automatically. Verify in **Storage**:
- Bucket `menu-images` exists and is public
- RLS policies are applied

## 5. Enable Realtime

1. Go to **Database → Replication**
2. Ensure `orders` table is enabled for Realtime (migration handles this)

## 6. Get API Keys

1. Go to **Project Settings → API**
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 7. Create Admin User

1. Register a user via the app at `/register`
2. In SQL Editor, promote to admin:
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE email = 'your-admin@email.com';
   ```

## 8. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

## 9. Local Development with Supabase CLI (Optional)

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
```
