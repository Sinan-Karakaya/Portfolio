import { prisma } from "@/app/lib/prisma"
import NewForm from "@/components/admin/NewForm"

export default async function NewProject({ params: { lng, id }}: {
  params: { lng: string, id: string }
}) {
  return (
    <div>
      <NewForm lng={lng} />
    </div>
  )
}