import Button from "components/Button";
import Input from "components/input";
import Error from "components/Error";
import Head from "next/head";

import Link from "next/link";

import { useRef, useState } from "react";
import Cookies from "js-cookie"
import { api } from "~/utils/api";




enum ERROR {
    NO_USERNAME,
    NO_PASSWORD,
    INVALID_USERNAME,
    INVALID_PASSWORD,
    UNKNOWN,
    NONE
}

function errorToString(e: ERROR) {
    switch (e) {
        case ERROR.NO_USERNAME:
            return "No username provided"
        case ERROR.NO_PASSWORD:
            return "No password provided"
        case ERROR.INVALID_USERNAME:
            return "User does not exist"
        case ERROR.INVALID_PASSWORD:
            return "Wrong Password"
        case ERROR.NONE:
            return ""
        case ERROR.UNKNOWN:
        default:
            return "Unknown error occured"
    }
}


export default function Home() {
    const [error, setError] = useState(ERROR.NONE);
    const loginMutation = api.auth.login.useMutation({
        onSuccess(data) {
            const { token } = data;
            Cookies.set("token", token, {
                expires: 30
            })
            location.href = "/"
        },
        onError(error) {
            const { message } = error
            if (message == "wrong_password") {
                setError(ERROR.INVALID_PASSWORD);
            }
            if (message == "no_user") {
                setError(ERROR.INVALID_USERNAME);
            }
        },
    });
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null)
    return (
        <>
            <Head>
                <title>Mdhe Movie DB</title>
                <meta name="" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="w-screen h-screen font-mono grid grid-rows-[14vh_auto]">
                <div className="grid place-items-center w-screen text-4xl bg-purple-400 text-center text-white">
                    <p>Mdhe Movie DB</p>
                </div>
                <div className="h-full w-full flex flex-col gap-4 justify-center items-center">
                    <div className="w-fit px-4 py-2 border-purple-400 border-2 rounded-md">
                        <div className="w-full flex justify-center">
                            <p className="text-xl">LOGIN</p>
                        </div>
                        <form className="flex flex-col gap-4 w-full" onSubmit={(e) => {
                            e.preventDefault();
                            if (usernameRef.current && passwordRef.current) {
                                const username = usernameRef.current.value;
                                const password = passwordRef.current.value;
                                if (username && password) {
                                    loginMutation.mutate({ username, password });
                                }
                                if (!username) {
                                    setError(ERROR.NO_USERNAME);
                                }
                                if (!password) {
                                    setError(ERROR.NO_PASSWORD);
                                }
                            }
                        }}>
                            <label>
                                Username:
                            </label>
                            <Input type="text" name="username" ref={usernameRef}></Input>
                            <label>
                                Password:
                            </label>
                            <Input type="password" name="password" ref={passwordRef}></Input>
                            <div className="w-full flex justify-center">
                                <Button>
                                    Login
                                </Button>
                            </div>
                            {
                                error != ERROR.NONE && <Error>
                                    {
                                        errorToString(error)
                                    }
                                </Error>
                            }
                        </form>
                    </div>
                    <div className="w-full h-fit grid place-items-center">
                        <Link href="/signup">
                            <Button>
                                Sign Up Instead
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}



