import Stripe from "stripe";
import { config } from "../config";
import { prisma } from "./prisma";

export const  stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient()
});


export const createCheckoutSession = async (userId: string) => {
   try{
    const session =  await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: "subscription",
        client_reference_id: userId,
        success_url: `http://localhost:3000/success`,
        cancel_url: `http://localhost:3000/cancel`,
        line_items: [{
            price: config.stripe.proPriceId,
            quantity: 1
        }],
    });

    return {
        url: session.url
    }

   }catch(error){
    console.error("Stripe checkout session error:", error);
    throw error;
   }
}


export const handlerProcessWebhookCheckout = async(event: {object: Stripe.Checkout.Session }) => {
    const clientReferenceId = event.object.client_reference_id as string
    const stripeSubscriptionId =  event.object.subscription as string
    const stripeCustomerId = event.object.customer as string
    const checkoutStatus = event.object.status

    if (checkoutStatus != 'complete') return `status not complete, status current ${checkoutStatus}`

    if(!clientReferenceId || !stripeSubscriptionId || !stripeCustomerId){
        throw new Error('clientReferenceId, stripeSubscriptionId and stripeCustomerId is required')
    }

    const userExists = await prisma.user.findUnique({
        where: {
            id: clientReferenceId
        },
        select:{
            id: true
        }
    })

    if(!userExists){
        throw new Error('user of clientReferenceId not found')
    }

    await prisma.user.update({
        where:{
            id:  userExists.id
        },
        data: {
            stripeCustomerId,
            stripeSubscriptionId
        }
    })




}
export const handlerProcessWebhookUpdateSubcription = async (event: {object: Stripe.Subscription}) => {
    const stripeCustomerId = event.object.customer as string
    const stripeSubscriptionStatus = event.object.status
    const stripeSubscriptionId =  event.object.id as string

    const userExists = await prisma.user.findFirst({
        where: {
            stripeCustomerId
        },
        select: {
            id: true
        }
    })

    if(!userExists){
        throw new Error('user of stripeCustomerId not found')
    }


    await prisma.user.update({
        where: {
            id: userExists.id
        },
        data:{
            stripeCustomerId,
            stripeSubscriptionId,
            stripeSubscriptionStatus

        }
    })







}

