import ProjectForm from '@/components/admin/ProjectForm'

export default function NewProject({ params: { lng } }: { params: { lng: string } }) {
  return (
    <div>
      <h1 className='display wdth-125 mb-10 text-[clamp(40px,6vw,96px)]'>New project</h1>
      <ProjectForm lng={lng} />
    </div>
  )
}
