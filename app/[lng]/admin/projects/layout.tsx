import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='py-8'>
      <div>{children}</div>
    </div>
  )
}
