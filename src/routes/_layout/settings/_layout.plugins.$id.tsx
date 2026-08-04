import { useInvoker } from "@/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/settings/_layout/plugins/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { id } = Route.useParams();

  const reload = useInvoker("plugins.reload");
  const remove = useInvoker("plugins.remove");

  return (
    <div className="flex space-x-5">
      <button
        disabled={reload.isPending}
        className="btn btn-primary"
        onClick={async () => {
          await reload.mutateAsync({
            id: parseInt(id),
          });
        }}
      >
        Reload
      </button>

      <button
        disabled={remove.isPending}
        className="btn btn-warning"
        onClick={async () => {
          await remove.mutateAsync({
            id: parseInt(id),
          });

          await navigate({ to: "/settings" });
        }}
      >
        Remove
      </button>
    </div>
  );
}
