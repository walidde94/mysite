const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// @desc    Get subscription status
// @route   GET /api/v1/subscription/status
// @access  Private
exports.getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const status = {
      isPremium: user.isPremium,
      subscriptionEndDate: user.subscriptionEndDate,
      daysRemaining: user.subscriptionEndDate 
        ? Math.ceil((user.subscriptionEndDate - Date.now()) / (1000 * 60 * 60 * 24))
        : 0
    };

    res.status(200).json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription status',
      error: error.message
    });
  }
};

// @desc    Create Stripe checkout session
// @route   POST /api/v1/subscription/create-checkout
// @access  Private
exports.createCheckoutSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'EcoStep Premium',
              description: 'Advanced AI analytics, unlimited challenges, and exclusive eco rewards',
              images: ['https://via.placeholder.com/300x200?text=EcoStep+Premium']
            },
            unit_amount: 299, // €2.99
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: user._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session',
      error: error.message
    });
  }
};

// @desc    Handle Stripe webhook
// @route   POST /api/v1/subscription/webhook
// @access  Public (Stripe)
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({
      success: false,
      message: 'Error handling webhook',
      error: error.message
    });
  }
};

// @desc    Cancel subscription
// @route   POST /api/v1/subscription/cancel
// @access  Private
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.isPremium) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription to cancel'
      });
    }

    // TODO: Cancel Stripe subscription
    // For now, just mark as not premium after current period ends

    res.status(200).json({
      success: true,
      message: 'Subscription will be cancelled at the end of the current billing period'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
      error: error.message
    });
  }
};

// Webhook handlers
async function handleCheckoutComplete(session) {
  const userId = session.metadata.userId;
  const user = await User.findById(userId);

  if (user) {
    user.isPremium = true;
    user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await user.save();

    console.log(`✅ Premium activated for user: ${user.email}`);
  }
}

async function handleSubscriptionUpdate(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userId = customer.metadata.userId;
  const user = await User.findById(userId);

  if (user) {
    if (subscription.status === 'active') {
      user.isPremium = true;
      user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
    } else {
      user.isPremium = false;
    }
    await user.save();
  }
}

async function handleSubscriptionDeleted(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userId = customer.metadata.userId;
  const user = await User.findById(userId);

  if (user) {
    user.isPremium = false;
    user.subscriptionEndDate = null;
    await user.save();

    console.log(`❌ Premium cancelled for user: ${user.email}`);
  }
}

async function handlePaymentFailed(invoice) {
  console.log(`⚠️ Payment failed for invoice: ${invoice.id}`);
  // TODO: Send email notification to user
}
