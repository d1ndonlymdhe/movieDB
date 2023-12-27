import { PrismaClient } from "@prisma/client";
import MovieCard, { type MovieInfo } from "components/MovieCard";
import Topbar from "components/Topbar";
import type { GetServerSideProps } from "next";
import type { ParsedUrlQuery } from "querystring";
import { useState } from "react";

export default function Liked(props: pageProps) {
    const [likedMovies, setLikedMovies] = useState(props.likedMovies);

    return <>
        <main className="font-mono grid grid-rows-[14vh_auto] place-items-center w-screen h-screen ">
            <Topbar activeTab="Liked"></Topbar>
            <div className="h-full flex flex-col gap-10 py-4 items-center">
                {
                    (likedMovies.length > 0 && <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 grid-flow-row  text-white">
                        {
                            likedMovies.map(movie => {
                                return <MovieCard {...{ movie: movie, movies: likedMovies, setMovie: setLikedMovies }} key={movie.tmdbId}></MovieCard>
                            })
                        }
                    </div>) || <div className="h-full w-full grid place-items-center"> <p className="text-5xl text-slate-800">You haven't liked any movies</p></div>
                }
            </div>
        </main>


    </>
}
type pageProps = {
    likedMovies: MovieInfo[]
}



export interface MovieDetail {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: BelongsToCollection;
    budget: number;
    genres: Genre[];
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    release_date: Date;
    revenue: number;
    runtime: number;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface BelongsToCollection {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface ProductionCompany {
    id: number;
    logo_path: null | string;
    name: string;
    origin_country: string;
}

export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

export interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
}


export const getServerSideProps: GetServerSideProps<pageProps, ParsedUrlQuery> = async (ctx) => {
    const { token } = ctx.req.cookies;
    const prisma = new PrismaClient();

    async function isInWatchList(tmdbId: string, prisma: PrismaClient, userId: string) {
        const watchListMovie = await prisma.watchListMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { watchListById: userId }] } })
        if (watchListMovie) {
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
            const likedMovies = await prisma.likedMovie.findMany({ where: { likedById: dbToken.owner } });

            const results: MovieInfo[] = []
            for (const likedMovie of likedMovies) {
                if (likedMovie) {
                    const url = `https://api.themoviedb.org/3/movie/${likedMovie.tmdbId}`;
                    const options = {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`
                        }
                    };
                    const res = await fetch(url, options)
                    const movieData: MovieDetail = (await res.json()) as MovieDetail;
                    const watched = await isWatched(likedMovie.tmdbId, prisma, dbToken.owner);
                    const watchListed = await isInWatchList(likedMovie.tmdbId, prisma, dbToken.owner);

                    results.push({
                        tmdbId: likedMovie.tmdbId,
                        backdropPath: `https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`,
                        language: movieData.original_language,
                        liked: true,
                        overview: movieData.overview,
                        posterPath: `https://image.tmdb.org/t/p/original/${movieData.poster_path}`,
                        releaseDate: movieData.release_date.toString(),
                        title: movieData.title,
                        watched, watchListed
                    })
                }
            }




            return {
                props:
                {
                    likedMovies: results
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
}