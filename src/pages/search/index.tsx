import { Icon } from "@iconify/react/dist/iconify.js";
import { PrismaClient } from "@prisma/client";
import MovieCard from "components/MovieCard";
import type { MovieInfo } from "components/MovieCard";
import Topbar from "components/Topbar";
import Input from "components/input";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";




export default function Search(props: pageProps) {
    const { searchResults: _searchResults } = props;
    const [searchResults, setSearchResults] = useState(_searchResults);
    const queryRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        document.getElementById("searchBox")?.focus();
    }, [])


    return (
        <>
            <Head>
                <title>Mdhe Movie DB</title>
                <meta name="" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="font-mono grid grid-rows-[14vh_auto] place-items-center w-screen h-screen ">
                <Topbar activeTab="Search"></Topbar>
                <div className="h-full flex flex-col gap-10 py-4 items-center">
                    <form
                        onSubmit={(e) => {
                            if (queryRef.current) {
                                if (queryRef.current.value == "") {
                                    e.preventDefault();
                                }
                            } else {
                                e.preventDefault();
                            }
                        }} action="/search" method="GET" className="flex flex-row w-fit justify-center focus:outline-2 outline-dashed outline-2 outline-purple-400 group items-center peer rounded-full px-2 peer">
                        <Input ref={queryRef} name="query" id="searchBox" className="rounded-l-full focus:outline-none h-12 w-96 rounded-r-none border-r-0"></Input>
                        <div className="h-12 w-fit border-2 border-l-0 rounded-r-full border-black px-2 grid place-items-center">
                            <Icon icon="mdi:search" className="text-2xl"></Icon>
                        </div>
                    </form>
                    {(searchResults.length > 0 && <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 grid-flow-row  text-white">
                        {
                            searchResults.map(res => {
                                return <MovieCard {...{ movie: res, movies: searchResults, setMovie: setSearchResults }} key={res.tmdbId}></MovieCard>
                            })
                        }
                    </div>) || <div className="h-full w-full text-center"> <p className="text-5xl text-slate-800">No results found</p></div>}
                </div>
            </main>
        </>
    );
}



export interface ResultMeta {
    page: number;
    results: Result[];
    total_pages: number;
    total_results: number;
}

export interface Result {
    adult: boolean;
    backdrop_path: null | string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: Date;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}



type pageProps = {
    searchResults: MovieInfo[]
}

export const getServerSideProps: GetServerSideProps<pageProps, { query: string }> = async (ctx) => {
    const { token } = ctx.req.cookies;

    const prisma = new PrismaClient();

    async function isInWatchList(tmdbId: string, prisma: PrismaClient, userId: string) {
        const watchListMovie = await prisma.watchListMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { watchListById: userId }] } })
        if (watchListMovie) {
            return true;
        }
        return false;
    }
    async function isLiked(tmdbId: string, prisma: PrismaClient, userId: string) {
        const likedMovie = await prisma.likedMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { likedById: userId }] } })
        console.log(likedMovie);
        if (likedMovie) {
            return true;
        }
        return false;
    }
    async function isWatched(tmdbId: string, prisma: PrismaClient, userId: string) {
        const watchedMovie = await prisma.watchedMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { watchedById: userId }] } })
        if (watchedMovie) {
            return true;
        }
        return false;

    }

    if (token) {
        const dbToken = await prisma.token.findFirst({ where: { value: token } });
        if (dbToken) {
            if (ctx.query) {
                const query = ctx.query.query as string;
                console.log(query);
                if (query) {
                    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query.split(" ").join("+")}&api_key=${process.env.TMDB_KEY}`)
                    const data: ResultMeta = (await res.json()) as ResultMeta;
                    const searchResults: MovieInfo[] = [];
                    for (const res of data.results) {
                        if (res?.poster_path) {
                            const tmdbId = res.id.toString();
                            const liked = await isLiked(tmdbId, prisma, dbToken.owner);
                            const watched = await isWatched(tmdbId, prisma, dbToken.owner);
                            const watchListed = await isInWatchList(tmdbId, prisma, dbToken.owner);
                            searchResults.push({
                                tmdbId: res.id.toString(),
                                title: res.title,
                                language: res.original_language,
                                posterPath: `https://image.tmdb.org/t/p/original/${res.poster_path}`,
                                backdropPath: `https://image.tmdb.org/t/p/original/${res.backdrop_path}`,
                                overview: res.overview,
                                releaseDate: res.release_date.toString(),
                                watched, watchListed, liked
                            })
                        }
                    }
                    return {
                        props: {
                            searchResults: searchResults
                        }
                    }
                }
                return {
                    redirect: {
                        permanent: false,
                        destination: "/"
                    }
                }
            }
        }
    }

    return {
        redirect: {
            permanent: false,
            destination: "/login"
        }
    }


};


