'use client'

import { usePathname } from 'next/navigation'
import Decode from '@/components/motion/Decode'
import { Link } from '@/components/motion/Transition'

export type NavItem = { href: string; label: string; index: string }

export const isActive = (pathname: string, href: string, home: string) =>
  href === home ? pathname === home : pathname === href || pathname.startsWith(`${href}/`)

export default function NavLinks({ items, home }: { items: NavItem[]; home: string }) {
  const pathname = usePathname()

  return (
    <ul className='flex items-center gap-0.5'>
      {items.map((item) => {
        const active = isActive(pathname, item.href, home)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              label={item.label}
              aria-current={active ? 'page' : undefined}
              className='navlink label'
            >
              <span className='navlink-index tabular'>{item.index}</span>
              <Decode
                text={item.label}
                hover
              />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
