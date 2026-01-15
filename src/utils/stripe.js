import Stripe from 'stripe';
import { getEnv } from '../configs/config.js';

// Initialize Stripe with secret key
const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'));

/**
 * Create a Stripe checkout session
 * @param {Array} items - Array of items to purchase
 * @param {string} successUrl - URL to redirect on successful payment
 * @param {string} cancelUrl - URL to redirect on cancelled payment
 * @param {Object} metadata - Additional metadata for the session
 * @returns {Object} - Returns session URL and status
 */
const createCheckoutSession = async (items, successUrl, cancelUrl, metadata = {}) => {
  try {
    console.log("metadata", metadata);
    console.log("creating checkout session");
    // Transform items to Stripe format
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));
    console.log("lineItems", lineItems);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
      },
    });

    console.log("session------ created", session);

    return {
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
      status: 'created'
    };

  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    return {
      success: false,
      error: error.message,
      status: 'error'
    };
  }
};

/**
 * Retrieve a checkout session by ID
 * @param {string} sessionId - Stripe session ID
 * @returns {Object} - Session details
 */
const retrieveCheckoutSession = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        status: session.status,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency,
      }
    };

  } catch (error) {
    console.error('Stripe session retrieval error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Handle Stripe webhook events
 * @param {string} eventType - The type of webhook event
 * @param {Object} eventData - The event data from Stripe
 * @returns {Object} - Processing result
 */
const handleWebhookEvent = async (eventType, eventData) => {
  try {
    switch (eventType) {
      case 'checkout.session.completed':
        // Handle successful payment
        const session = eventData;
        console.log('Payment successful for session:', session.id);

        // You can update order status, send confirmation emails, etc.
        return {
          success: true,
          message: 'Payment completed successfully',
          sessionId: session.id
        };

      case 'payment_intent.payment_failed':
        // Handle failed payment
        console.log('Payment failed');
        return {
          success: false,
          message: 'Payment failed',
        };

      default:
        return {
          success: true,
          message: `Unhandled event type: ${eventType}`
        };
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export {
  createCheckoutSession,
  retrieveCheckoutSession,
  handleWebhookEvent,
  stripe // Export stripe instance if needed elsewhere
};