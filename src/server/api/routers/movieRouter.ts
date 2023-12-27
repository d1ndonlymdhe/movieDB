import { TRPCError } from "@trpc/server";
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

export const movieRouter = createTRPCRouter({
    addToWatchList: publicProcedure.input(z.object({ tmdbId: z.string() })).mutation(async ({ input, ctx }) => {
        const { tmdbId } = input;
        const prisma = ctx.db;
        // const { token } = ctx.req;
        const { token } = ctx.req.cookies;

        // const prisma = new PrismaClient();
        if (token) {
            const dbToken = await prisma.token.findFirst({ where: { value: token } });

            if (dbToken) {
                const watchListMovie = await prisma.watchListMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { watchListById: dbToken.owner }] } })
                if (watchListMovie) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "already_watchlisted"
                    })
                } else {
                    await prisma.watchListMovie.create({ data: { tmdbId: tmdbId, watchListById: dbToken.owner } })
                    return {
                        success: true,
                        tmdbId: tmdbId
                    }
                }
            }
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "not_logged_in"
        })
    }),
    removeFromWatchList: publicProcedure.input(z.object({ tmdbId: z.string() })).mutation(async ({ input, ctx }) => {
        const prisma = ctx.db;
        const { token } = ctx.req.cookies;
        const { tmdbId } = input;
        if (token) {
            const dbToken = await prisma.token.findFirst({ where: { value: token } });
            if (dbToken) {
                const watchListMovie = await prisma.watchListMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { watchListById: dbToken.owner }] } })
                if (watchListMovie) {
                    await prisma.watchListMovie.delete({ where: { id: watchListMovie.id } });
                    return {
                        success: true,
                        tmdbId: tmdbId
                    }
                }
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "not_in_wathclist"
                })
            }
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "not_logged_in"
        })
    }),
    addToWatched: publicProcedure.input(z.object({ tmdbId: z.string() })).mutation(async ({ input, ctx }) => {
        const { tmdbId } = input;
        const prisma = ctx.db;
        // const { token } = ctx.req;
        const { token } = ctx.req.cookies;

        // const prisma = new PrismaClient();
        if (token) {
            const dbToken = await prisma.token.findFirst({ where: { value: token } });

            if (dbToken) {
                const watchedMovie = await prisma.watchedMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { watchedById: dbToken.owner }] } })
                if (watchedMovie) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "already_watched"
                    })
                } else {
                    await prisma.watchedMovie.create({ data: { tmdbId: tmdbId, watchedById: dbToken.owner } })
                    return {
                        success: true,
                        tmdbId: tmdbId
                    }
                }
            }
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "not_logged_in"
        })
    }),
    removeFromWatched: publicProcedure.input(z.object({ tmdbId: z.string() })).mutation(async ({ input, ctx }) => {
        const prisma = ctx.db;
        const { token } = ctx.req.cookies;
        const { tmdbId } = input;
        if (token) {
            const dbToken = await prisma.token.findFirst({ where: { value: token } });
            if (dbToken) {
                const watchedMovie = await prisma.watchedMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { watchedById: dbToken.owner }] } })
                if (watchedMovie) {
                    await prisma.watchedMovie.delete({ where: { id: tmdbId } });
                    return {
                        success: true,
                        tmdbId: tmdbId
                    }
                }
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "not_in_wathclist"
                })
            }
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "not_logged_in"
        })
    }),
    addToLiked: publicProcedure.input(z.object({ tmdbId: z.string() })).mutation(async ({ input, ctx }) => {
        const { tmdbId } = input;
        const prisma = ctx.db;
        // const { token } = ctx.req;
        const { token } = ctx.req.cookies;

        // const prisma = new PrismaClient();
        if (token) {
            const dbToken = await prisma.token.findFirst({ where: { value: token } });

            if (dbToken) {
                const likedMovie = await prisma.likedMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { likedById: dbToken.owner }] } })
                if (likedMovie) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "already_liked"
                    })
                } else {
                    await prisma.likedMovie.create({ data: { tmdbId: tmdbId, likedById: dbToken.owner } })
                    return {
                        success: true,
                        tmdbId: tmdbId
                    }
                }
            }
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "not_logged_in"
        })
    }),
    removeFromLiked: publicProcedure.input(z.object({ tmdbId: z.string() })).mutation(async ({ input, ctx }) => {
        const prisma = ctx.db;
        const { token } = ctx.req.cookies;
        const { tmdbId } = input;
        if (token) {
            const dbToken = await prisma.token.findFirst({ where: { value: token } });
            if (dbToken) {
                const likedMovie = await prisma.likedMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { likedById: dbToken.owner }] } })
                if (likedMovie) {
                    await prisma.likedMovie.delete({ where: { id: likedMovie.id } });
                    return {
                        success: true,
                        tmdbId: tmdbId
                    }
                }
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "not_liked"
                })
            }
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "not_logged_in"
        })
    }),
    isInWatchList: publicProcedure.input(z.object({ tmdbId: z.string() })).query(async ({ input, ctx }) => {
        const prisma = ctx.db;
        const { token } = ctx.req.cookies;
        const { tmdbId } = input;
        if (token) {
            const dbToken = await prisma.token.findFirst({ where: { value: token } });
            if (dbToken) {
                const watchListMovie = await prisma.watchListMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { watchListById: dbToken.owner }] } })
                if (watchListMovie) {
                    return {
                        success: true,
                        result: true
                    }
                }
                return {
                    success: true,
                    result: false
                }
            }
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "not_logged_in"
        })
    }),
    isWatched: publicProcedure.input(z.object({ tmdbId: z.string() })).query(async ({ input, ctx }) => {
        const { tmdbId: tmdb_id } = input;
        const prisma = ctx.db;
        // const { token } = ctx.req;
        const { token } = ctx.req.cookies;

        // const prisma = new PrismaClient();
        if (token) {
            const dbToken = await prisma.token.findFirst({ where: { value: token } });

            if (dbToken) {
                const watchedMovie = await prisma.watchedMovie.findFirst({ where: { AND: [{ tmdbId: tmdb_id }, { watchedById: dbToken.owner }] } })
                if (watchedMovie) {
                    return {
                        success: true,
                        result: true
                    }
                } else {
                    return {
                        success: true,
                        result: false
                    }
                }
            }
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "not_logged_in"
        })
    }),
    isLiked: publicProcedure.input(z.object({ tmdbId: z.string() })).query(async ({ input, ctx }) => {
        const { tmdbId: tmdb_id } = input;
        const prisma = ctx.db;
        // const { token } = ctx.req;
        const { token } = ctx.req.cookies;

        // const prisma = new PrismaClient();
        if (token) {
            const dbToken = await prisma.token.findFirst({ where: { value: token } });

            if (dbToken) {
                const likedMovie = await prisma.likedMovie.findFirst({ where: { AND: [{ tmdbId: tmdb_id }, { likedById: dbToken.owner }] } })
                if (likedMovie) {
                    return {
                        success: true,
                        result: true
                    }
                } else {
                    return {
                        success: true,
                        result: false
                    }
                }
            }
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "not_logged_in"
        })
    }),
})

