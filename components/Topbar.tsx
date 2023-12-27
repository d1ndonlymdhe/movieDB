import Link from "next/link";

const tabs = ["Search", "Liked", "Watch List", "Watched"] as const
type Tab = typeof tabs[number]
export default function Topbar(props: {
    activeTab: Tab
}) {
    const { activeTab } = props;
    return <div tabIndex={1} className="grid grid-flow-row place-items-center w-screen h-full text-4xl bg-purple-400 text-center text-white">
        <p>Mdhe Movie DB</p>
        <div className="flex flex-row gap-10 text-xl">
            {
                tabs.map(t => {
                    return <Link key={t} className={`hover:underline underline-offset-2 ${t == activeTab ? "underline" : ""}`} href={`/${t.toLowerCase().split(" ").join("")}`}>{t}</Link>
                })
            }

        </div>
    </div>
}