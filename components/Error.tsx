import type { PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge"
export default function Error(props: PropsWithChildren<{ className?: string }>) {

    return <div className={twMerge("px-4 py-2 bg-red-400 rounded-md text-xl", props.className)}>
        {props.children}
    </div>
}
