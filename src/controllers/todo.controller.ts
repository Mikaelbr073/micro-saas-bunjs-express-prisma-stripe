import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";


export const createTodoController = async (request: Request, response: Response) =>{
    const userId = request.headers['x-user-id']

    if(!userId){
        return response.status(403).send({
            error: "Not autorized"
        })
    }

    const user = await prisma.user.findUnique({
        where:{
            id: userId as string
        },
        select: {
            id: true,
            stripeCustomerId: true,
            stripeSubscriptionStatus: true,
            _count: {
                select: {
                    todos: true
                }
            }
        }
    })

    if(!user){
        return response.status(403).send({
            error: "Not autorized"
        })
    }

    const HasQuotaAvailable = user._count.todos <= 5; 
    const HasActivateSubscription = !!user.stripeCustomerId
    
    if(!HasQuotaAvailable && !HasActivateSubscription && user.stripeSubscriptionStatus != 'active'){

        return response.status(403).send({
            error: "Not quota available. Plase upgrade your plan"
        })
    }

    const { title } = request.body;

    const todo = await prisma.todo.create({
       data: {
        title,
        ownerId: user.id
        
       }
    })


    response.status(201).send(todo)

}