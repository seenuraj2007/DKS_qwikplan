# Quick Start Guide

## 🚀 Development Server

```bash
npm run dev
```

Server will start at: `http://localhost:3000`

---

## 📱 Test URLs

### Main Pages:
- **Landing Page:** `http://localhost:3000/`
- **Auth Page:** `http://localhost:3000/auth`
- **Dashboard:** `http://localhost:3000/dashboard`
- **History:** `http://localhost:3000/dashboard/history`
- **Settings:** `http://localhost:3000/dashboard/settings`

### Demo & Examples:
- **Interactive Demo:** `http://localhost:3000/#demo`
- **Pricing:** `http://localhost:3000/#pricing`
- **Why This:** `http://localhost:3000/#comparison`

---

## ✅ Step 1 Features

### History Page (`/dashboard/history`)
- View all saved strategies
- Filter by platform (Instagram, Facebook, LinkedIn, Twitter, YouTube)
- Delete strategies with confirmation
- Download as CSV
- Empty state messaging

### Input Validation
- Zod schemas on all API routes
- Real-time validation feedback
- Type-safe request handling

### Environment Validation
- Checks required vars on startup
- Fails-fast with clear errors
- Safe `getEnvVar()` helper

---

## ✅ Step 2 Features

### Toast Notification System
- Context-based global state
- 4 toast types: success, error, warning, info
- Auto-dismiss after 5 seconds
- Click-to-dismiss
- Slide-in animations
- Queue support

**Usage:**
```tsx
import { useToast } from '../contexts/ToastContext'

const { showToast } = useToast()

// Show toasts
showToast('Success!', 'success')
showToast('Error occurred', 'error')
showToast('Warning message', 'warning')
showToast('Info message', 'info')
```

### User Settings Page (`/dashboard/settings`)
- View account info (email, user ID)
- Change password
  - Current password required
  - New password (min 8 chars)
  - Confirm password
  - Real-time validation
  - Success/error feedback
- Delete account
  - Type "DELETE" to confirm
  - Double confirmation (input + dialog)
  - Redirects to home on success
- Sign out button

**Important:** Account deletion requires Supabase RPC function `delete_user`. See `STEP2_COMPLETE.md` for SQL.

### Auth Page Improvements
- Real-time email validation
  - Validates on blur
  - Shows inline errors
  - Clears on focus
  - Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Password strength indicator
  - 5-level strength system
  - Visual progress bar
  - Requirements checklist
  - Real-time updates
- Improved focus states
  - Emerald-500 focus rings
  - Smooth transitions
  - Clear error states

### Mobile Navigation
- Hamburger menu for mobile (< 768px)
- Slide-down animation (300ms)
- Full navigation in dropdown
- Desktop nav unchanged

---

## 🔐 Database Schema Requirements

### Existing Tables:
```sql
-- profiles (from Step 1)
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  plan_usage integer default 0,
  monthly_limit integer default 50,
  created_at timestamp with time zone default now()
);

-- strategies (from Step 1)
create table strategies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  niche text not null,
  platform text not null,
  goal text not null,
  strategy_text text not null,
  schedule jsonb not null,
  hashtags text,
  created_at timestamp with time zone default now()
);
```

### Required for Settings Page:
```sql
-- user_streaks (should exist)
create table if not exists user_streaks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  current_streak integer default 0,
  longest_streak integer default 0,
  total_generations integer default 0,
  last_active_date date,
  created_at timestamp with time zone default now()
);

-- feedback (should exist)
create table if not exists feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  user_email text,
  rating integer,
  feedback_text text not null,
  niche_context text,
  platform text,
  created_at timestamp with time zone default now()
);
```

### Required for Account Deletion:
```sql
-- Create this RPC function in Supabase SQL Editor
create or replace function delete_user(user_id uuid)
returns text
language sql
security definer
as $$
begin
  -- Delete user data
  delete from profiles where user_id = $1;
  delete from strategies where user_id = $1;
  delete from feedback where user_id = $1;
  delete from user_streaks where user_id = $1;
  
  -- Delete from Supabase auth
  select supabase_admin_user.delete_user($1);
  
  return 'DELETED';
end;
$$;
```

### Row Level Security (RLS) Policies:
```sql
-- For strategies table
create policy "Users can view own strategies" 
  on strategies for select 
  using (auth.uid() = user_id);

create policy "Users can insert own strategies" 
  on strategies for insert 
  with check (auth.uid() = user_id);

create policy "Users can delete own strategies" 
  on strategies for delete 
  using (auth.uid() = user_id);

-- For profiles table
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = user_id);

create policy "Users can update own profile" 
  on profiles for update 
  with check (auth.uid() = user_id);
```

---

## 🌐 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
FEEDBACK_TO_EMAILS=admin@yourdomain.com
RESEND_FROM=DKS QwikPlan <noreply@yourdomain.com>
```

---

## 🧪 Testing Checklist

### Toast System:
- [ ] Success toast appears and auto-dismisses
- [ ] Error toast appears and auto-dismisses
- [ ] Warning toast appears and auto-dismisses
- [ ] Info toast appears and auto-dismisses
- [ ] Clicking toast dismisses immediately
- [ ] Multiple toasts stack properly
- [ ] Close button works
- [ ] Icons are correct for each type

### Auth Page:
- [ ] Email validates on blur
- [ ] Invalid email shows red border + error message
- [ ] Valid email shows normal border + no error
- [ ] Password strength updates in real-time
- [ ] Strength bar shows correct level
- [ ] All requirements checked correctly
- [ ] Focus ring appears on all inputs
- [ ] Signup creates account successfully
- [ ] Login works with valid credentials
- [ ] Invalid credentials show error toast

### Settings Page:
- [ ] Account info displays correctly
- [ ] Password change requires current password
- [ ] Password change validates minimum 8 chars
- [ ] Passwords must match
- [ ] Password change shows success toast
- [ ] Account deletion requires "DELETE" text
- [ ] Account deletion shows double confirmation
- [ ] Account deletion redirects to home
- [ ] Sign out button works

### History Page:
- [ ] All strategies display
- [ ] Platform filtering works
- [ ] Strategy count is correct
- [ ] Download CSV works
- [ ] Delete works with confirmation
- [ ] Empty state shows correctly

### Mobile Navigation:
- [ ] Hamburger menu visible on mobile
- [ ] Mobile menu slides down smoothly
- [ ] All nav links work on mobile
- [ ] Desktop nav shows all links
- [ ] Mobile menu closes on link click
- [ ] Desktop nav hidden on mobile

### Responsive Design:
- [ ] Auth page works on mobile (< 640px)
- [ ] Auth page works on tablet (640px - 1024px)
- [ ] Auth page works on desktop (> 1024px)
- [ ] Settings page works on all screen sizes
- [ ] History page works on all screen sizes
- [ ] Dashboard works on all screen sizes
- [ ] Landing page works on all screen sizes

### Accessibility:
- [ ] All buttons can be tabbed to
- [ ] All forms can be submitted with keyboard
- [ ] All interactive elements have ARIA labels
- [ ] Focus states are visible
- [ ] Color contrast is sufficient (4.5:1)
- [ ] Screen reader announces errors

---

## 📋 Build Commands

### Development:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```

### Production Start:
```bash
npm start
```

### Linting:
```bash
npm run lint
```

---

## 🐛 Common Issues & Solutions

### Issue: Database table not found
**Error:** `relation "strategies" does not exist`
**Solution:** Run SQL migration to create strategies table (see Database Schema section)

### Issue: Account deletion doesn't work
**Error:** `function delete_user does not exist`
**Solution:** Create `delete_user` RPC function in Supabase SQL Editor (see Database Schema section)

### Issue: Toasts don't appear
**Error:** Toast container not rendering
**Solution:** Ensure `ToastProvider` is in `app/layout.tsx` and wraps children

### Issue: Mobile menu doesn't work
**Error:** Hamburger button not responsive
**Solution:** Check CSS breakpoints, ensure Tailwind classes match media queries

### Issue: Build fails
**Error:** TypeScript compilation error
**Solution:** Check specific error message, ensure types are correct, restart dev server

### Issue: Port already in use
**Error:** `Error: listen EADDRINUSE: address already in use :::3000`
**Solution:** Kill process using port 3000 or run `PORT=3001 npm run dev`

---

## 📊 Performance Metrics

### Target Metrics:
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTI (Time to Interactive):** < 3.5s

### Optimization:
- ✅ Next.js 16 with Turbopack (fast builds)
- ✅ Image optimization with Next.js `<Image>`
- ✅ CSS animations (GPU accelerated)
- ✅ Lazy loading not needed (small components)
- ✅ Minimal re-renders (optimized state)

---

## 🎨 Styling Guide

### Color Palette:
- **Primary:** Emerald-600 (#059669)
- **Secondary:** Teal-600 (#0d9488)
- **Error:** Red-500 (#ef4444)
- **Success:** Emerald-500 (#10b981)
- **Warning:** Amber-500 (#f59e0b)
- **Info:** Blue-600 (#2563eb)
- **Neutral:** Slate-500 (#64748b)
- **Background:** Slate-50 (#f8fafc)
- **Border:** Slate-200 (#e2e8f0)

### Spacing:
- **xs:** 2 (8px)
- **sm:** 3 (12px)
- **md:** 4 (16px)
- **lg:** 6 (24px)
- **xl:** 8 (32px)

### Border Radius:
- **lg:** 1rem (16px)
- **xl:** 1.5rem (24px)
- **2xl:** 1.75rem (28px)
- **3xl:** 2rem (32px)

### Shadows:
- **sm:** Shadow-sm
- **md:** Shadow-lg
- **xl:** Shadow-2xl
- **glow:** Shadow-emerald-500/20

---

## 🔒 Security Checklist

- [ ] All API routes use Zod validation
- [ ] Password minimum 8 characters enforced
- [ ] Passwords must match on signup/change
- [ ] Email format validated
- [ ] SQL injection protected (Zod + parameterized queries)
- [ ] XSS protected (inputs sanitized, Supabase RLS)
- [ ] Session management with Supabase auth
- [ ] Rate limiting on public APIs
- [ ] Environment variables not in git
- [ ] CORS configured in Supabase
- [ ] HTTPS in production
- [ ] Row Level Security enabled

---

## 📝 Development Workflow

### Branching:
```bash
git checkout -b feature/improvements
git add .
git commit -m "Step 1 & 2: UX enhancements + user settings"
git push origin feature/improvements
```

### Testing:
```bash
# Test locally
npm run dev

# Run tests when available
npm test

# Build for production
npm run build

# Test production build locally
npm start
```

---

## 🚀 Deployment Checklist

### Before Deploying:
- [ ] All environment variables set in production
- [ ] Database migrations run
- [ ] RPC functions created
- [ ] RLS policies enabled
- [ ] Build succeeds without errors
- [ ] All features tested manually

### Production:
- [ ] Deploy to Vercel/Netlify/etc.
- [ ] Verify environment variables in platform
- [ ] Test deployed application
- [ ] Check for console errors
- [ ] Monitor error tracking (Sentry/etc.)
- [ ] Test authentication flow
- [ ] Test database connections

---

## 📚 Additional Resources

### Documentation:
- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Zod:** https://zod.dev
- **Lucide Icons:** https://lucide.dev

### Community:
- **GitHub Issues:** https://github.com/seenuraj2007/DKS_qwikplan/issues
- **Discussions:** https://github.com/seenuraj2007/DKS_qwikplan/discussions

---

## ✅ Status

**Step 1:** ✅ Complete (History, Validation, Environment)
**Step 2:** ✅ Complete (Toast, Settings, Mobile Menu, Real-time Validation)
**Overall Progress:** 🟢 Ready for Testing

---

**Next Steps:**
1. Test all features thoroughly
2. Collect user feedback
3. Iterate based on feedback
4. Deploy to production when satisfied
