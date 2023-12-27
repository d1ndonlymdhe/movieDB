import { Icon } from "@iconify/react/dist/iconify.js";
import type { Dispatch, SetStateAction } from "react";
import { api } from "~/utils/api";



export type MovieInfo = {
    tmdbId: string,
    title: string,
    language: string,
    posterPath: string,
    backdropPath: string
    overview: string
    releaseDate: string
    liked: boolean
    watched: boolean
    watchListed: boolean
}

export default function MovieCard(props: {
    movie: MovieInfo,
    movies: MovieInfo[],
    setMovie: Dispatch<SetStateAction<MovieInfo[]>>
}) {
    const { movie: res, movies: searchResults, setMovie: setSearchResults } = props;

    const addToLikeMutaiton = api.movie.addToLiked.useMutation(
        {
            onMutate() {
                //TODO: try optimistic updates
            },
            onSuccess(data) {
                if (data.success) {
                    const copyRes = searchResults.map(s => {
                        if (s.tmdbId == data.tmdbId) {
                            s.liked = true;
                        }
                        return s;
                    })
                    setSearchResults(copyRes);
                }
            },
        }
    );
    const addToWatchListMutation = api.movie.addToWatchList.useMutation(
        {
            onMutate() {
                //TODO: try optimistic updates
            },
            onSuccess(data) {
                if (data.success) {
                    const copyRes = searchResults.map(s => {
                        if (s.tmdbId == data.tmdbId) {
                            s.watchListed = true;
                        }
                        return s;
                    })
                    setSearchResults(copyRes);
                }
            },
        }
    );
    const addToWatchedMutation = api.movie.addToWatched.useMutation(
        {
            onMutate() {
                //TODO: try optimistic updates
            },
            onSuccess(data) {
                if (data.success) {
                    const copyRes = searchResults.map(s => {
                        if (s.tmdbId == data.tmdbId) {
                            s.watched = true;
                        }
                        return s;
                    })
                    setSearchResults(copyRes);
                }
            },
        }
    );
    const removeFromLikedMutation = api.movie.removeFromLiked.useMutation(
        {
            onMutate() {
                //TODO: try optimistic updates
            },
            onSuccess(data) {
                if (data.success) {
                    const copyRes = searchResults.map(s => {
                        if (s.tmdbId == data.tmdbId) {
                            s.liked = false;
                        }
                        return s;
                    })
                    setSearchResults(copyRes);
                }
            },
        }
    );
    const removeFromWatchList = api.movie.removeFromWatchList.useMutation(
        {
            onMutate() {
                //TODO: try optimistic updates
            },
            onSuccess(data) {
                if (data.success) {
                    const copyRes = searchResults.map(s => {
                        if (s.tmdbId == data.tmdbId) {
                            s.watchListed = false;
                        }
                        return s;
                    })
                    setSearchResults(copyRes);
                }
            },
        }
    );
    const removeFromWatched = api.movie.removeFromWatched.useMutation(
        {
            onMutate() {
                //TODO: try optimistic updates
            },
            onSuccess(data) {
                if (data.success) {
                    const copyRes = searchResults.map(s => {
                        if (s.tmdbId == data.tmdbId) {
                            s.watched = false;
                        }
                        return s;
                    })
                    setSearchResults(copyRes);
                }
            },
        }
    );

    return <div className="w-[50vh] grid grid-cols-[auto_auto] gap-4 bg-slate-500 rounded-lg p-4" key={res.tmdbId}>
        <div className="flex flex-col gap-4 justify-center">
            <img className="h-64" src={res.posterPath}></img>
            <div className="grid grid-cols-3 gap-2 justify-items-center text-4xl">
                <div role="button" title={res.liked ? "Unlike" : "Like"}>
                    <Icon aria-hidden={false} aria-label={res.liked ? "Unlike" : "Like"} onClick={() => {
                        if (!addToLikeMutaiton.isLoading && !removeFromLikedMutation.isLoading) {
                            if (res.liked) {
                                removeFromLikedMutation.mutate({ tmdbId: res.tmdbId })
                            } else {
                                addToLikeMutaiton.mutate({ tmdbId: res.tmdbId })
                            }
                        }
                    }} icon={`${res.liked ? "mdi:heart" : "mdi:heart-outline"}`}></Icon>
                </div>
                <div role="button" title={res.watchListed ? "Remove from watchlist" : "Add to watchlist"}>

                    <Icon onClick={() => {
                        if (!addToWatchListMutation.isLoading && !removeFromWatchList.isLoading) {
                            if (res.watchListed) {
                                removeFromWatchList.mutate({ tmdbId: res.tmdbId })
                            } else {
                                addToWatchListMutation.mutate({ tmdbId: res.tmdbId })
                            }
                        }
                    }} icon={`${res.watchListed ? "mdi:bookmark" : "mdi:bookmark-outline"}`}></Icon>
                </div>
                <div role="button" title={res.watched ? "Remove from watched" : "Add to watched"}>

                    <Icon onClick={() => {
                        if (!addToWatchedMutation.isLoading && !removeFromWatched.isLoading) {
                            if (res.watched) {
                                removeFromWatched.mutate({ tmdbId: res.tmdbId })
                            } else {
                                addToWatchedMutation.mutate({ tmdbId: res.tmdbId })
                            }
                        }
                    }} icon={`${res.watched ? "mdi:eye" : "mdi:eye-closed"}`}></Icon>
                </div>
            </div>
        </div>
        <div className="">
            <p>Title: {res.title}</p>
            <p>Language: {res.language}</p>
            <p>Relased on: {res.releaseDate ? res.releaseDate : "N/A"}</p>
            <p className="p-4">Overview : {res.overview ? res.overview : "N/A"}</p>
        </div>
    </div>
}