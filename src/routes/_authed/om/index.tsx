import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/om/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/om/"!</div>
}
