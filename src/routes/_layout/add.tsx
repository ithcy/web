import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/add")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      file: null,
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <input type="file" className="file-input" />
        </div>
        <button type="submit" className="btn btn-primary">
          Add torrent
        </button>
      </form>
    </div>
  );
}
