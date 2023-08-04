

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-full max-h-full overflow-y-auto py-4'>
      {children}
    </div>
  )
}