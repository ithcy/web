import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/settings/_layout/plugins/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/settings/_layout/plugins/$id"!</div>
}
