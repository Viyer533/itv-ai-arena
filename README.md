# Vercel + Supabase setup
1. Create a Supabase project.
2. In SQL Editor, run `supabase-setup.sql`.
3. In Supabase Project Settings > API, copy the Project URL and server-side `service_role` key.
4. In Vercel Project Settings > Environment Variables add:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - ADMIN_KEY
   - GAME_ID = ITV-AI-ARENA-NOV2026
5. Remove the old PA_* environment variables.
6. Redeploy the Vercel project.
7. Test `/api/status`, `/host.html`, `/`, and `/leaderboard.html`.

Never commit the service-role key. It belongs only in Vercel environment variables.
