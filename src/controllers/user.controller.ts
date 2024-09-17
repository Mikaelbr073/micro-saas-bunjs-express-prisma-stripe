import type { Request, Response } from "express"
import { prisma } from "../lib/prisma"


export const listUsersController = async(resquest: Request, response: Response) =>{
    const users = await prisma.user.findMany({})
    response.send({users})
}

export const listOneUserController = async(request: Request, response: Response) =>{
    const {userId} = request.params

    const user = await prisma.user.findUnique({
        where:{
            id: userId
        }
    })

    if(!user){
        return response.status(404).send(
            {
                erro: "not found"
            }
        )
    }


    response.send({user})
}


export const createUserController = async (request: Request, response: Response) => {
    const { nome, email } = request.body;

    if (!nome || !email) {
        return response.send({
            error: "Name or email is invalid"
        });
    }

    const userEmailAlreadyExists = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            id: true
        }
    });

    if (userEmailAlreadyExists) {
        return response.status(400).send({
            error: "Email already in use"
        });
    }

    const user = await prisma.user.create({
        data: {
            nome,
            email
        }
    });

    return response.send({ user });
};

