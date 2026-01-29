# Payment Integration Guide - Razorpay

This guide explains how to set up payment processing using Razorpay for DKS QwikPlan.

## Prerequisites

1. Get Razorpay API credentials:
    - Sign up at https://razorpay.com
    - Navigate to API Settings
    - Generate Key ID and Key Secret
    - Generate a Webhook Secret

2. Set up environment variables:
    ```bash
    cp .env.example .env.local
    ```

3. Edit `.env.local`:
    ```bash
    RAZORPAY_KEY_ID=your-razorpay-key-id
    RAZORPAY_KEY_SECRET=your-razorpay-key-secret
    RAZORPAY_WEBHOOK_SECRET=your-random-webhook-secret
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

## How It Works

### 1. User Initiates Subscription

- User clicks "Upgrade to Pro" on `/pricing` page
- `handleSubscribe()` function calls `/api/create-checkout-session`
- Supabase auth verifies the user

### 2. Create Order

**Route:** `/api/create-checkout-session`

- Receives: `userId`, `plan`
- Calls Razorpay API to create order
- Returns: `{ orderId, amount, currency, key }`
- User is redirected to Razorpay checkout page

### 3. User Completes Payment

- User completes payment on Razorpay's hosted checkout
- Razorpay redirects to `successUrl` or `cancelUrl`

**Success URL:** `/dashboard?payment=success`
**Cancel URL:** `/pricing?payment=cancelled`

### 4. Webhook Notification

**Route:** `/api/webhook/razorpay`

- Receives webhook POST from Razorpay
- Validates webhook signature using `RAZORPAY_WEBHOOK_SECRET`
- Handles events:
  - `payment.captured` → Updates user to Pro
  - `payment.authorized` → Updates user to Pro
- Updates `profiles` table:
  ```sql
  UPDATE profiles
  SET plan_type = 'pro',
      monthly_limit = 500
  WHERE user_id = 'user-id'
  ```

## Plan Pricing

| Plan  | Price     | Generations | Features                                      |
|--------|-----------|-------------|-----------------------------------------------|
| Free   | ₹0/month  | 50          | Basic AI, CSV export, history, streaks      |
| Pro    | ₹5/month  | 500         | Advanced AI, priority support, search, early access |

## Database Schema

### Profile Updates

When user upgrades/downgrades, `profiles` table is updated:

**Upgrade to Pro:**
```sql
plan_type = 'pro'
monthly_limit = 500
```

**Downgrade to Free:**
```sql
plan_type = 'free'
monthly_limit = 50
```

## Testing

### Test Mode

Razorpay provides test mode. Use test API keys for development:

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  // Use test keys
  // Razorpay will not charge real cards
}
```

### Test Cards

Use Razorpay's test card numbers:
```
Success: 4242 4242 4242 4242
Fail: 4000 0000 0000 0002
```

### Webhook Testing

Use tools like ngrok to test webhooks locally:

```bash
ngrok http 3000
```

Then set Razorpay webhook URL to:
```
https://your-ngrok-id.ngrok.io/api/webhook/razorpay
```

## Pro Features

When `plan_type = 'pro'`, users get:

1. **Higher Limits**
   - 500 generations/month (vs 50 for free)

2. **Advanced AI Models**
   - Access to GPT-4, Claude (future)
   - Better quality responses

3. **Priority Support**
   - Faster response times
   - Direct email support

4. **Enhanced History**
   - Search functionality
   - Better organization

5. **Streak Leaderboards**
   - Compete with other users
   - Rankings

6. **Early Access**
   - New features first
   - Beta testing

7. **No Watermarks**
   - Clean exports
   - Professional output

## Security

1. **Webhook Validation**
    - Verify webhook signature using HMAC-SHA256 on all webhook calls
    - Use `RAZORPAY_WEBHOOK_SECRET` for signature generation
    - Reject unauthorized requests

2. **User Verification**
   - Ensure user owns the profile being updated
   - Use Supabase auth in API routes

3. **Idempotency**
   - Handle duplicate webhook events safely
   - Check current plan before updating

## Handling Cancellations

When user cancels via Razorpay dashboard:

1. Monitor cancellations manually
2. User downgraded to `free` plan
3. `monthly_limit` resets to 50
4. Usage retained (not reset)

## Error Handling

### Common Errors

**"Payment service not configured"**
- Missing `RAZORPAY_KEY_ID` or `RAZORPAY_KEY_SECRET`
- Check `.env.local`

**"Failed to create order"**
- Invalid plan or API key
- Check Razorpay dashboard for API key status

**"Webhook processing failed"**
- Webhook signature mismatch
- Invalid webhook URL in Razorpay settings

## Monitoring

Monitor webhook events:

```bash
# Check server logs
tail -f logs/your-app.log | grep "Razorpay Webhook"
```

Key events to watch:
- `payment.captured` → Confirm upgrades
- `payment.authorized` → Confirm upgrades
- Failed webhooks → Investigate immediately

## Production Checklist

- [ ] Set production Razorpay API keys
- [ ] Set production webhook URL
- [ ] Set production `NEXT_PUBLIC_APP_URL`
- [ ] Test successful payment flow
- [ ] Test failed payment flow
- [ ] Test subscription cancellation
- [ ] Monitor webhook events for 24h
- [ ] Set up error alerting (Sentry, etc.)

## Support

- **Razorpay Docs:** https://razorpay.com/docs
- **Razorpay Support:** support@razorpay.com
- **Issues:** Create GitHub issue with webhook payload

## Next Steps

1. Get Razorpay credentials
2. Set environment variables
3. Test in development mode
4. Deploy webhook URL
5. Test full payment flow
6. Monitor webhook events

---

**Last Updated:** January 6, 2026
