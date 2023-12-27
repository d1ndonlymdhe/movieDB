import { Icon } from "@iconify/react/dist/iconify.js";
import { PrismaClient } from "@prisma/client";
import Topbar from "components/Topbar";
import Input from "components/input";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useRef } from "react";




export default function Home() {
  useEffect(() => {
    document.getElementById("searchBox")?.focus();
  }, [])

  const queryRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Head>
        <title>Mdhe Movie DB</title>
        <meta name="" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="font-mono grid grid-rows-[14vh_auto] place-items-center w-screen h-screen ">
        <Topbar activeTab="Search"></Topbar>
        <form onSubmit={(e) => {
          if (queryRef.current) {
            if (queryRef.current.value == "") {
              e.preventDefault();
            }
          } else {
            e.preventDefault();
          }
        }} action="/search" method="GET" className="flex flex-row justify-center focus:outline-2 outline-dashed outline-2 outline-purple-400 group items-center peer rounded-full px-2 peer">
          <Input ref={queryRef} name="query" id="searchBox" className="rounded-l-full focus:outline-none h-12 w-96 rounded-r-none border-r-0"></Input>
          <div className="h-12 w-fit border-2 border-l-0 rounded-r-full border-black px-2 grid place-items-center">
            <Icon icon="mdi:search" className="text-2xl"></Icon>
          </div>
        </form>
      </main>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = ctx.req.cookies;

  const prisma = new PrismaClient();
  if (token) {
    const dbToken = await prisma.token.findFirst({ where: { value: token } });
    if (dbToken) {
      return {
        props: {
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



