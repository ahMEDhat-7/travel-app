import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Stripe from 'stripe';
import { features } from '@/lib/flags';

const createPaymentIntentSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().default('EGP'),
  bookingId: z.string().uuid().optional(),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    if (!features.STRIPE_ENABLED) {
      return NextResponse.json(
        { success: false, error: 'Payment system is currently disabled' },
        { status: 503 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, error: 'Stripe is not configured' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const body = await request.json();
    const { amount, currency, bookingId, email } = createPaymentIntentSchema.parse(body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      receipt_email: email,
      metadata: {
        bookingId: bookingId || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error: any) {
    console.error('Payment intent error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment intent' },
      { status: 400 }
    );
  }
}