import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";
import { stripe } from "../utils/stripe.js";
import { PaymentIntent } from "../models/paymentIntent.model.js";
import { Order } from "../models/order.model.js";

const stripeWebhook = asyncHandler(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("event", event);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      console.log("checkout.session.completed");
      const session = event.data.object;
      const metadata = session.metadata;
      const orderId = metadata.orderId;
      const totalAmount = parseFloat(metadata.totalAmount);
      console.log("orderId", orderId);
      console.log("totalAmount", totalAmount);
      console.log("session.id", session.id);
      console.log("metadata", metadata);

      const paymentIntent = await PaymentIntent.findOne({ intentId: session.id });
      if (!paymentIntent) {
        console.log("Payment intent not found for session:", session.id);
        return res.status(200).json({ received: true }); // Don't fail for missing payment intent
      }

      paymentIntent.status = 'paid';
      paymentIntent.totalAmount = totalAmount;
      await paymentIntent.save();

      const order = await Order.findById(orderId);
      if (!order) {
        console.log("Order not found:", orderId);
        return res.status(200).json({ received: true }); // Don't fail for missing order
      }

      console.log("Order before update:", { paymentStatus: order.paymentStatus, totalAmount: order.totalAmount, paymentMethod: order.paymentMethod });

      order.paymentStatus = 'paid';
      order.totalAmount = totalAmount;

      console.log("Order after update:", { paymentStatus: order.paymentStatus, totalAmount: order.totalAmount, paymentMethod: order.paymentMethod });

      await order.save();
      console.log("Order saved successfully");
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

export { stripeWebhook };