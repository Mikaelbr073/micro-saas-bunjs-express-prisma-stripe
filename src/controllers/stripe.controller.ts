import type { Request, Response } from "express";
import { config } from "../config";
import { handlerProcessWebhookCheckout, handlerProcessWebhookUpdateSubcription, stripe } from "../lib/stripe";

export const stripeWebhookController = async (request: Request, response: Response) => {
    let event = request.body

    if (!config.stripe.webhookScret) {
        console.error('STRIPE_WEBHOOK_SECRETE_KEY is not set');
        return response.sendStatus(404);
    }

    const signature = request.headers['stripe-signature'] as string


    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            signature,
            config.stripe.webhookScret,
            undefined,
            stripe.createSubtleCryptoProvider()
        );

    } catch (error) {
        const erroMessage = (error instanceof Error) ? error.message : 'unknown error';
        console.error(erroMessage);
        return response.status(400).json({error: erroMessage});
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handlerProcessWebhookCheckout(event);
                break;
            case 'customer.subscription.created':
            case 'customer.subscription.update':
                await handlerProcessWebhookUpdateSubcription(event)
                break;
            default:
                console.log(`Unhandled event type ${event.type}.`);
        }

        return response.json({ received: true })

    } catch (error) {
        const erroMessage = (error instanceof Error) ? error.message : 'unknown error';
        console.error(erroMessage);
       return response.status(500).json({error: erroMessage})

    }






}