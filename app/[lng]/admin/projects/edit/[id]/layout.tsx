import { prisma } from "@/app/lib/prisma"
import { Button } from "@nextui-org/button"
import { useRouter } from "next/navigation"

export default async function EditLayout({ children, params: { lng, id }}: {
  children: React.ReactNode
  params: { lng: string, id: string }
}) {

  return (
    <div className='py-8'>
      {children}
    </div>
  )
}