import AdminShell from '@/components/admin/AdminShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='gutter py-[6vh]'>
      <p className='label mb-8 flex items-center gap-2 border-b border-line pb-4 text-muted'>
        <span className='inline-block h-[7px] w-[7px] bg-signal' />
        SK/OS — Admin
      </p>
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
