import type { ButtonHTMLAttributes, PropsWithChildren } from "react"
export default function Button(props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
    const { className } = props;
    delete props.className;
    return <button {...props} className={`bg-purple-400 rounded-md w-fit px-4 py-2 focus:border-2 ${className}`}>
        {props.children}
    </button>
}