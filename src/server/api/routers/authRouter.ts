import { TRPCError } from "@trpc/server";
import { z } from "zod"
import crypto from "crypto"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

export const authRouter = createTRPCRouter({
    signup: publicProcedure.input(z.object({ username: z.string(), password: z.string() })).mutation(async ({ input, ctx }) => {
        const { username, password } = input;
        const prisma = ctx.db;

        const user = await prisma.user.findFirst({ where: { username: username } })

        if (user) {
            throw new TRPCError({
                message: "user_exists",
                code: "BAD_REQUEST"
            })
        }

        const salt = hash(username + new Date().getTime());
        const passwordHash = hash(password + salt);
        await prisma.user.create({ data: { hash: passwordHash, salt: salt, username: username } });
        return {
            success: true
        };
    }),
    login: publicProcedure.input(z.object({ username: z.string(), password: z.string() })).mutation(async ({ input, ctx }) => {
        const { username, password } = input;
        const prisma = ctx.db;

        const user = await prisma.user.findFirst({ where: { username: username } })

        if (user) {
            const salt = user.salt;
            const reqHash = hash(password + salt);
            if (user.hash == reqHash) {
                const token = hash(reqHash + new Date().getTime().toString())
                await prisma.token.create({ data: { value: token, owner: user.id } });
                return {
                    success: true,
                    token: token
                }
            } else {
                throw new TRPCError({
                    message: "wrong_password",
                    code: "BAD_REQUEST"
                })
            }
        } else {
            throw new TRPCError({
                message: "no_user",
                code: "BAD_REQUEST"
            })
        }
    })
})


export function hash(input: string) {
    const hash = crypto.createHash('sha256').update(input).digest('base64')
    return hash
}