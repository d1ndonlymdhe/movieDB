import { useState, type InputHTMLAttributes, type ForwardedRef } from "react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@iconify/react"
import { forwardRef } from "react";

const Input = forwardRef(InnerInput)
export default Input;

export function InnerInput(props: InputHTMLAttributes<HTMLInputElement>, ref: ForwardedRef<HTMLInputElement>) {

    const { className } = props;
    const [passwordShown, setPasswordShown] = useState(false);
    if (props.type == "password") {
        const newProps = { ...props };
        delete newProps.type;
        return <div className="relative">
            <input type={passwordShown ? "text" : "password"} {...newProps} ref={ref} className={twMerge("w-full my-2 px-4 py-2 border-black border-2 rounded-md focus:outline-dashed outline-purple-400 outline-offset-4 outline-2", className)}>
            </ input>
            <div className="absolute grid place-items-center w-fit top-0 right-2 h-full">
                <Icon onClick={() => {
                    setPasswordShown(!passwordShown);
                }} className="hover:cursor-pointer" icon={passwordShown ? "mdi:eye" : "mdi:eye-outline"}></Icon>
            </div>
        </div>
    }

    return <input {...props} ref={ref} className={twMerge("my-2 px-4 py-2 border-black border-2 rounded-md focus:outline-dashed outline-purple-400 outline-offset-4 outline-2", className)}>
    </ input>
}