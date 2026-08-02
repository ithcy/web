import { useInvoker } from "@/api";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";

export const Route = createFileRoute("/_layout/settings/_layout/presets/add")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const add = useInvoker("presets.add", {
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["presets.list"] }),
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      const result = await add.mutateAsync(value);

      if (
        !!result &&
        typeof result === "object" &&
        "id" in result &&
        typeof result.id === "number"
      ) {
        await navigate({
          to: "/settings/presets/$id",
          params: { id: result.id.toString() },
        });
      }
    },
  });

  return (
    <div className="card bg-base-200 shadow-sm w-full">
      <div className="card-body">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <>
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="long-term-seeding"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          />
          <button
            type="submit"
            className={clsx([
              "btn btn-primary",
              form.state.isSubmitting && "btn-disabled",
            ])}
          >
            Add preset
          </button>
        </form>
      </div>
    </div>
  );
}
