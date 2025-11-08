import { ComponentPropsWithoutRef } from "react";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
    label?: string;
    istextarea?: boolean;
    required?: boolean;
}

export function Input({ required, label, istextarea, ...rest }: InputProps) {
    return (
        <div className="flex flex-col">
            <label className="pl-1 mb-1 font-medium text-gray-700">
                {required && <span className='text-red-600 pr-1'>*</span>}{label}
            </label>
            {istextarea ? (
                <textarea {...(rest as ComponentPropsWithoutRef<"textarea">)} className="border rounded-md p-2" />
            ) : (
                <input {...rest} className="border rounded-md p-2 w-full" />
            )}
        </div>
    )
}