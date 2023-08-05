

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-full  py-4'>
      {children}
    </div>
  )
}