import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/c/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/c/"!</div>
}
