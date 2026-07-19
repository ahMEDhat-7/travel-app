# Resend Email Integration

Replacing Gmail SMTP with Resend for transactional email delivery.

---

## Why Resend?

| Factor | Gmail SMTP | Resend |
|--------|-----------|--------|
| Deliverability | Poor (often flagged as spam) | Excellent (dedicated infrastructure) |
| Free tier | N/A | 100 emails/day |
| Setup complexity | Low | Low |
| Reputation | Shared IP | Dedicated sending domain |
| Analytics | None | Open/click tracking |

---

## Files Changed

| # | File | Change |
|---|------|--------|
| 1 | `lib/mail.ts` | Replaced Nodemailer with Resend SDK |
| 2 | `package.json` | Added `resend`, removed `nodemailer` + `@types/nodemailer` |
| 3 | `.env.production` | Replaced Gmail vars with `RESEND_API_KEY` |
| 4 | `.env.example` | Updated email section for Resend |
| 5 | `lib/flags.ts` | Updated `EMAIL_ENABLED` check |

### Files NOT Changed

- `lib/email.ts` — HTML templates stay exactly the same (they call `sendMail()`)
- All API routes — they call email functions, not mail directly

---

## `lib/mail.ts`

```ts
import { Resend } from 'resend';
import { features } from './flags';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  if (!features.EMAIL_ENABLED) {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('  [DEV MODE] Email disabled — would send to:', to);
    console.log('  Subject:', subject);
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    return { success: true, disabled: true };
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Sharm Cloud Tours <noreply@sharmcloudtours.com>',
      to,
      subject,
      html,
    });

    console.log('[Email] Sent successfully to:', to, 'ID:', data.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('[Email] Error:', error.message);
    return { success: false, error: error.message };
  }
}
```

---

## `lib/flags.ts`

```ts
export const features = {
  STRIPE_ENABLED: process.env.NEXT_PUBLIC_STRIPE_ENABLED === 'true',
  EMAIL_ENABLED: !!process.env.RESEND_API_KEY,
  NOTIFICATIONS_ENABLED: true,
};
```

---

## `package.json` Changes

```diff
  "dependencies": {
-   "nodemailer": "^8.0.8",
+   "resend": "^4.0.0",
    ...
  },
  "devDependencies": {
-   "@types/nodemailer": "^8.0.0",
    ...
  }
```

---

## Environment Variables

### Removed (Gmail)

```
GMAIL_EMAIL=youremail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

### Added (Resend)

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@sharmcloudtours.com
```

---

## Resend Setup Steps

### 1. Create Account

1. Go to [resend.com](https://resend.com)
2. Sign up (free tier: 100 emails/day)
3. Create API key in dashboard

### 2. Add Domain

1. In Resend dashboard → Domains → Add Domain
2. Enter: `sharmcloudtours.com`
3. Resend will provide DNS records

### 3. Configure DNS (Cloudflare)

Add these records to Cloudflare:

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| TXT | `_dmarc` | `v=DMARC1; p=none;` | DMARC policy |
| TXT | `resend._domainkey` | (provided by Resend) | DKIM signing |
| CNAME | `send._domainkey` | (provided by Resend) | DKIM verification |

### 4. Verify Domain

- Click "Verify" in Resend dashboard
- DNS propagation takes 5-30 minutes
- Status will change to "Verified"

### 5. Update Environment

```bash
# In .env.production
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@sharmcloudtours.com
```

### 6. Rebuild

```bash
docker compose up -d --build
```

### 7. Test

```bash
# Check logs for email errors
docker compose logs -f app | grep -i email
```

---

## Email Types Sent

| Email | Trigger | Template |
|-------|---------|----------|
| Verification | User signs up | `sendVerificationEmail()` |
| Password Reset | User requests reset | `sendPasswordReset()` |
| Booking Confirmation | Booking created | `sendBookingConfirmation()` |
| Booking Status Update | Admin confirms/cancels | `sendBookingStatusUpdate()` |
| Review Reply | Admin replies to review | `sendReviewReplyNotification()` |
| Admin Notification | New booking received | `sendAdminBookingNotification()` |

---

## Free Tier Limits

| Limit | Value |
|-------|-------|
| Emails per day | 100 |
| Emails per month | 3,000 |
| Cost | $0 |
| Bandwidth | Unlimited |

For hundreds of bookings/year, the free tier is more than sufficient.

---

## Verification Checklist

After setup, verify:

- [ ] `RESEND_API_KEY` is set in `.env.production`
- [ ] `EMAIL_FROM` matches your verified domain
- [ ] Domain shows "Verified" in Resend dashboard
- [ ] DNS records (SPF, DKIM, DMARC) are configured
- [ ] `docker compose up -d --build` completes successfully
- [ ] Health endpoint returns `200`
- [ ] Test email delivery works (sign up for a test account)
- [ ] Emails land in inbox, not spam folder

---

_Last updated: June 2026_
