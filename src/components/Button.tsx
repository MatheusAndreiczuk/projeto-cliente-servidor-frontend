import { ComponentProps } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

const buttonVariants = tv({
  base: 'px-2 py-2 mt-3 rounded-md font-semibold cursor-pointer text-lg text-white',
  variants: {
    color: {
      blue: 'bg-blue-500 text-white hover:bg-blue-600 hover:outline-solid hover:outline-3 hover:outline-blue-700',
      red: 'bg-red-500 text-white hover:bg-red-600 hover:outline-solid hover:outline-3 hover:outline-red-700',
    },
    size: {
      sm: 'px-2 py-1 text-md',
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