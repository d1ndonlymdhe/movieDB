import { PrismaClient } from "@prisma/client";
import MovieCard, { type MovieInfo } from "components/MovieCard";
import Topbar from "components/Topbar";
import { type GetServerSideProps } from "next";
import { type ParsedUrlQuery } from "querystring";
import { useState } from "react";

export default function Liked(props: pageProps) {
    const [watchListedMovies, setWatchListedMovies] = useState(props.watchListedMovies);

    return <>
        <main className="font-mono grid grid-rows-[14vh_auto] place-items-center w-screen h-screen ">
            <Topbar activeTab="Watch List"></Topbar>
            <div className="h-full flex flex-col gap-10 py-4 items-center">
                {(watchListedMovies.length > 0 && <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 grid-flow-row  text-white">
                    {
                        watchListedMovies.map(movie => {
                            return <MovieCard {...{ movie: movie, movies: watchListedMovies, setMovie: setWatchListedMovies }} key={movie.tmdbId}></MovieCard>
                        })
                    }
                </div>) || <div className="h-full w-full text-center"> <p className="text-5xl text-slate-800">You haven't added any movie to watchlist</p></div>}
            </div>
        </main>


    </>
}
type pageProps = {
    watchListedMovies: MovieInfo[]
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

    async function isWatched(tmdbId: string, prisma: PrismaClient, userId: string) {
        const watchedMovie = await prisma.watchedMovie.findFirst({ where: { AND: [{ tmdbId: tmdbId }, { watchedById: userId }] } })
        if (watchedMovie) {
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

    if (token) {
        const dbToken = await prisma.token.findFirst({ where: { value: token } });
        if (dbToken) {
            const watchListedMovies = await prisma.watchListMovie.findMany({ where: { watchListById: dbToken.owner } });

            const results: MovieInfo[] = []
            for (const watchListedMovie of watchListedMovies) {
                if (watchListedMovie) {
                    const url = `https://api.themoviedb.org/3/movie/${watchListedMovie.tmdbId}`;
                    const options = {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`
                        }
                    };
                    const res = await fetch(url, options)
                    const movieData: MovieDetail = (await res.json()) as MovieDetail;
                    const watched = await isWatched(watchListedMovie.tmdbId, prisma, dbToken.owner);
                    const liked = await isLiked(watchListedMovie.tmdbId, prisma, dbToken.owner);
                    results.push({
                        tmdbId: watchListedMovie.tmdbId,
                        backdropPath: `https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`,
                        language: movieData.original_language,
                        overview: movieData.overview,
                        posterPath: `https://image.tmdb.org/t/p/original/${movieData.poster_path}`,
                        releaseDate: movieData.release_date.toString(),
                        title: movieData.title,
                        watchListed: true,
                        watched, liked
                    })
                }
            }




            return {
                props:
                {
                    watchListedMovies: results
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