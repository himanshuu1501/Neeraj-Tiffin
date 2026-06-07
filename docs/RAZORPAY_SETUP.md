# Razorpay Setup Guide for TiffinHub

## 1. Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up and complete KYC verification
3. For testing, use **Test Mode** (toggle in dashboard)

## 2. Get API Keys

1. Go to **Settings → API Keys**
2. Generate Test/Live keys
3. Copy:
   - Key ID → `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_ID`
   - Key Secret → `RAZORPAY_KEY_SECRET`

## 3. Configure Environment

Add to `.env.local`:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

## 4. Payment Flow

1. Customer places order → redirected to `/payment?orderId=xxx`
2. App creates Razorpay order via `/api/razorpay/create-order`
3. Razorpay checkout modal opens
4. On success, `/api/razorpay/verify` validates signature
5. Payment record updated in `payments` table
6. Order `payment_status` set to `paid`

## 5. Test Cards (Test Mode)

| Card Number       | Result  |
|-------------------|---------|
| 4111 1111 1111 1111 | Success |
| 4000 0000 0000 0002 | Failure |

Use any future expiry date and any CVV.

## 6. Webhooks (Production)

For production, set up webhooks in Razorpay dashboard:
- URL: `https://your-domain.com/api/razorpay/webhook`
- Events: `payment.captured`, `payment.failed`

## 7. Going Live

1. Complete Razorpay KYC
2. Switch to Live mode keys
3. Update environment variables in Vercel
