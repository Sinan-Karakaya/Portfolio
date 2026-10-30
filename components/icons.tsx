import * as React from 'react'
import { IconSvgProps } from '@/types'

const Svg = ({
  size = 24,
  width,
  height,
  viewBox = '0 0 24 24',
  children,
  ...props
}: IconSvgProps & { viewBox?: string }) => (
  <svg
    aria-hidden='true'
    focusable='false'
    width={width ?? size}
    height={height ?? size}
    viewBox={viewBox}
    {...props}
  >
    {children}
  </svg>
)

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'square' } as const

export const ArrowRight = (props: IconSvgProps) => (
  <Svg
    size={14}
    {...props}
  >
    <path
      {...stroke}
      d='M3 12h17M14 6l6 6-6 6'
    />
  </Svg>
)

export const ArrowLeft = (props: IconSvgProps) => (
  <Svg
    size={14}
    {...props}
  >
    <path
      {...stroke}
      d='M21 12H4M10 6l-6 6 6 6'
    />
  </Svg>
)

export const ArrowUpRight = (props: IconSvgProps) => (
  <Svg
    size={14}
    {...props}
  >
    <path
      {...stroke}
      d='M6 18L18 6M8 6h10v10'
    />
  </Svg>
)

export const ArrowUp = (props: IconSvgProps) => (
  <Svg
    size={14}
    {...props}
  >
    <path
      {...stroke}
      d='M12 21V4M6 10l6-6 6 6'
    />
  </Svg>
)

export const ArrowDown = (props: IconSvgProps) => (
  <Svg
    size={14}
    {...props}
  >
    <path
      {...stroke}
      d='M12 3v17M6 14l6 6 6-6'
    />
  </Svg>
)

export const CopyIcon = (props: IconSvgProps) => (
  <Svg
    size={14}
    {...props}
  >
    <path
      {...stroke}
      d='M8 8h12v12H8zM4 16V4h12'
    />
  </Svg>
)

export const CheckIcon = (props: IconSvgProps) => (
  <Svg
    size={14}
    {...props}
  >
    <path
      {...stroke}
      d='M4 12.5l5 5L20 6.5'
    />
  </Svg>
)

export const GithubIcon = (props: IconSvgProps) => (
  <Svg {...props}>
    <path
      clipRule='evenodd'
      d='M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z'
      fill='currentColor'
      fillRule='evenodd'
    />
  </Svg>
)

export const LinkedinIcon = (props: IconSvgProps) => (
  <Svg
    viewBox='0 0 16 16'
    {...props}
  >
    <path
      clipRule='evenodd'
      d='M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z'
      fill='currentColor'
      fillRule='evenodd'
    />
  </Svg>
)
