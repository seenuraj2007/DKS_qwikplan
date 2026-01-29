# Manual Testing Checklist - Step 1 Complete

## 🔍 Test Instructions

### 1. History Page Testing
Navigate to `http://localhost:3000/dashboard/history`

**Empty State:**
- [ ] Shows empty state when no strategies exist
- [ ] "Generate your first strategy" button redirects to dashboard
- [ ] Messaging is clear and helpful

**With Data:**
- [ ] Generates a strategy in dashboard first
- [ ] Click "History" button in dashboard navbar
- [ ] All strategies appear in list
- [ ] Each strategy shows: niche, platform, strategy preview, date
- [ ] Platform badge has correct color coding
- [ ] Strategy count is accurate

**Platform Filtering:**
- [ ] Click "All" button - shows all strategies
- [ ] Click "Instagram" button - shows only Instagram strategies
- [ ] Click "Facebook" button - shows only Facebook strategies
- [ ] Filter button shows correct count
- [ ] Click "Show All Strategies" in empty state - resets to all

**Download CSV:**
- [ ] Click "Download" button on a strategy
- [ ] CSV file downloads successfully
- [ ] Filename includes niche name
- [ ] CSV contains: niche, platform, goal, strategy, schedule, hashtags, date
- [ ] Can open CSV in spreadsheet software

**Delete Strategy:**
- [ ] Click delete icon on a strategy
- [ ] Confirmation dialog appears
- [ ] Click "Cancel" - strategy remains
- [ ] Click "OK" - strategy is removed
- [ ] Loading spinner shows during delete
- [ ] Strategy count updates after delete

**Navigation:**
- [ ] "Back to Dashboard" button works
- [ ] "View Details" button links to correct strategy (when implemented)
- [ ] Page is responsive on mobile
- [ ] Page is responsive on tablet
- [ ] Page is responsive on desktop

---

### 2. Input Validation Testing

**Generate API (`/api/generate`):**
- [ ] Valid data: Generates strategy successfully
- [ ] Missing niche: Returns 400 with error message
- [ ] Empty niche: Returns 400 with error message
- [ ] Niche > 100 chars: Returns 400 with error message
- [ ] Invalid platform (e.g., "tiktok"): Returns 400 with error message
- [ ] Invalid goal (e.g., "money"): Returns 400 with error message
- [ ] Invalid JSON: Returns 400 with "Invalid JSON body"

**Demo Generate API (`/api/demo-generate`):**
- [ ] Valid data: Generates demo strategy
- [ ] Missing niche: Returns 400 with error
- [ ] Missing platform: Returns 400 with error
- [ ] Missing goal: Returns 400 with error
- [ ] All fields too long (>100 chars): Returns 400 with error

**Feedback API (`/api/feedback`):**
- [ ] Valid data: Saves feedback successfully
- [ ] Missing feedback text: Returns 400 with error
- [ ] Feedback > 2000 chars: Returns 400 with error
- [ ] Rating < 1: Returns 400 with error (if sent)
- [ ] Rating > 5: Returns 400 with error (if sent)
- [ ] Unauthenticated: Returns 401 with error

---

### 3. Environment Variable Testing

**Missing Required Variables:**
- [ ] Remove `NEXT_PUBLIC_SUPABASE_URL` - Server fails with clear error
- [ ] Remove `GROQ_API_KEY` - Server fails with clear error
- [ ] Remove `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Server fails with clear error

**Empty Variables:**
- [ ] Set required var to empty string - Warning logged to console
- [ ] App still loads but shows warning

---

### 4. Dashboard Testing

**History Navigation:**
- [ ] "History" button visible in navbar (desktop)
- [ ] "History" button hidden on mobile
- [ ] Clicking "History" navigates to `/dashboard/history`

**Existing Features:**
- [ ] Generate strategy still works
- [ ] Usage card displays correctly
- [ ] Streak card displays correctly
- [ ] Toast notifications work
- [ ] Logout works
- [ ] Welcome animation loads

---

### 5. Security Testing

**SQL Injection Attempt:**
- [ ] Try SQL in niche field: `"; DROP TABLE users; --`
- [ ] Should return validation error, not execute SQL
- [ ] Should not crash the server

**XSS Attempt:**
- [ ] Try HTML/JS in feedback: `<script>alert('xss')</script>`
- [ ] Should be saved as text, not executed
- [ ] Should be escaped in database

**Rate Limiting:**
- [ ] Make 6+ requests in under 60 seconds
- [ ] Should receive 429 error
- [ ] Should include "Retry-After" header

**Authentication:**
- [ ] Access `/api/generate` without auth - Returns 401
- [ ] Access `/api/feedback` without auth - Returns 401
- [ ] Expired session - Returns 401 or redirects to auth

---

### 6. Responsive Design Testing

**Mobile (< 640px):**
- [ ] History page filters stack vertically
- [ ] Strategy cards are 1 column
- [ ] Buttons are tappable (44px+ height)
- [ ] No horizontal scroll
- [ ] Text is readable

**Tablet (640px - 1024px):**
- [ ] History page shows 2 columns on desktop
- [ ] Navbar shows all buttons
- [ ] Layout doesn't break

**Desktop (> 1024px):**
- [ ] History page shows 2 columns
- [ ] Navbar shows all items
- [ ] Plenty of whitespace
- [ ] Hover effects work

---

### 7. Error Handling Testing

**Network Errors:**
- [ ] Disconnect internet during generation
- [ ] Shows appropriate error message
- [ ] Doesn't crash the app

**Database Errors:**
- [ ] Supabase connection fails
- [ ] Shows error or falls back gracefully
- [ ] Logs error to console for debugging

**Server Errors:**
- [ ] API returns 500
- [ ] Client shows error message
- [ ] Can retry after error

---

### 8. Browser Testing

**Test in Chrome:**
- [ ] History page loads correctly
- [ ] CSV download works
- [ ] Filters work
- [ ] Delete works
- [ ] No console errors

**Test in Firefox:**
- [ ] History page loads correctly
- [ ] CSV download works
- [ ] Filters work
- [ ] Delete works
- [ ] No console errors

**Test in Safari:**
- [ ] History page loads correctly
- [ ] CSV download works
- [ ] Filters work
- [ ] Delete works
- [ ] No console errors

---

### 9. Performance Testing

**Page Load Time:**
- [ ] History page loads in < 2 seconds
- [ ] Dashboard loads in < 2 seconds
- [ ] LCP < 2.5s (Lighthouse)
- [ ] FID < 100ms (Lighthouse)
- [ ] CLS < 0.1 (Lighthouse)

**API Response Time:**
- [ ] Generate API responds in < 5 seconds
- [ ] History fetch responds in < 1 second
- [ ] Delete responds in < 500ms

---

### 10. Accessibility Testing

**Keyboard Navigation:**
- [ ] Can tab through all buttons
- [ ] Can tab through filters
- [ ] Can navigate to history from dashboard
- [ ] Enter key triggers buttons

**Screen Reader:**
- [ ] All images have alt text
- [ ] Buttons have accessible labels
- [ ] Form inputs have labels
- [ ] Error messages are announced

**Contrast:**
- [ ] Text has sufficient contrast (4.5:1)
- [ ] Platform badges are readable
- [ ] No low contrast on text

---

## 🐛 Bug Tracking

### Bugs Found During Testing:
1. [ ] Description:
   - Severity: Low/Medium/High
   - Steps to reproduce:
   - Expected behavior:
   - Actual behavior:

2. [ ] Description:
   - Severity: Low/Medium/High
   - Steps to reproduce:
   - Expected behavior:
   - Actual behavior:

---

## ✅ Final Sign-off

**All tests passed?** Yes/No

**Issues to fix before launch:**

**Ready for users?** Yes/No

**Notes:**
