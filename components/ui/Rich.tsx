import { Fragment } from 'react'

// Renders translation strings that mark emphasis with **double asterisks**.
export default function Rich({
  text,
  strongClassName = 'font-medium text-fg',
}: {
  text: string
  strongClassName?: string
}) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith('**') ? (
          <strong
            key={i}
            className={strongClassName}
          >
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}
