import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/articles/$articleId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/articles/$articleId"!</div>
}
