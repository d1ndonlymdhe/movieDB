import Button from "components/Button";
import Input from "components/input";
import Error from "components/Error"
import Head from "next/head";
// import Link from "next/link";
import { useState } from "react";
import { useRef } from "react";
import { api } from "~/utils/api";
import Link from "next/link";

enum ERROR {
    MATCH,
    NO_USERNAME,
    NO_PASSWORD,
    INVALID_USERNAME,
    UNKNOWN,
    NONE
}

function errorToString(e: ERROR) {
    switch (e) {
        case ERROR.MATCH:
            return "Passwords do not match"
        case ERROR.NO_USERNAME:
            return "No username provided"
        case ERROR.NO_PASSWORD:
            return "No password provided"
        case ERROR.INVALID_USERNAME:
            return "Username is already used"
        case ERROR.NONE:
            return ""
        case ERROR.UNKNOWN:
        default:
            return "Unknown error occured"
    }
}

export default function Home() {
    // const router = useRouter();
    const passwordRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState(ERROR.NONE);
    const signupMutation = api.auth.signup.useMutation({
        onSuccess() {
            location.href = "/login";
        },
        onError(error) {
            if (error.message == "user_exists") {
                setError(ERROR.INVALID_USERNAME);
            } else {
                setError(ERROR.UNKNOWN);
            }
        },
    });
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
                            <p className="text-xl">SIGN UP</p>
                        </div>
                        <form className="flex flex-col gap-4 w-full" onSubmit={(e) => {
                            e.preventDefault();
                            if (passwordRef.current && usernameRef.current) {
                                const password = passwordRef.current.value;
                                const username = usernameRef.current.value;
                                if (password && username && (error == ERROR.NONE)) {
                                    signupMutation.mutate({ username, password });
                                }
                                if (!password) {
                                    setError(ERROR.NO_PASSWORD);
                                }
                                if (!username) {
                                    setError(ERROR.NO_USERNAME);
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
                            <label>
                                Verify Password:
                            </label>
                            <Input type="password" name="verify" onChange={(e) => {
                                if (passwordRef.current) {
                                    if (e.target.value != passwordRef.current.value) {
                                        setError(ERROR.MATCH)
                                    } else {
                                        setError(ERROR.NONE);
                                    }
                                }
                            }}></Input>
                            {error != ERROR.NONE && <Error>
                                {errorToString(error)}
                            </Error>}
                            <div className="w-full flex justify-center">
                                <Button>
                                    Sign Up
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className="w-full h-fit grid place-items-center">
                        <Link href="/login">
                            <Button>
                                Login Instead
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}



