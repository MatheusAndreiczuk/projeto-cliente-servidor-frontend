import { ComponentProps } from 'react';
import { tv, VariantProps } from 'tailwind-variants';
import React from "react";

const buttonVariants = tv({
  base: 'px-2 py-2 mt-3 rounded-md font-semibold cursor-pointer text-lg text-white',
  variants: {
    color: {
      blue: 'bg-blue-500 text-white hover:bg-blue-600 hover:outline-solid hover:outline-3 hover:outline-blue-700',
      red: 'bg-red-500 text-white hover:bg-red-600 hover:outline-solid hover:outline-3 hover:outline-red-700',
    },
    size: {
      sm: 'px-3 py-2 text-md mt-0 bg-transparent hover:bg-gray-200 text-blue-500 hover:text-blue-700',
      md: 'px-4 py-2',
    },
  },
  defaultVariants: {
    color: 'blue',
    size: 'md',
  },
});

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

export function Button({ color, size, className, ...props} : ButtonProps){
  return (
    <button className={buttonVariants({ color, size, className })} {...props}>
      {props.children}
    </button>
  )
}