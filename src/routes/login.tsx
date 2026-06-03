import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

type AuthLoginReq = {
  username: string;
  password: string;
};

function RouteComponent() {
  const navigate = Route.useNavigate();

  const authInit = useMutation({
    mutationKey: ["auth.login"],
    mutationFn: (init: AuthLoginReq) =>
      fetch("/api/v1/jsonrpc", {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "auth.login",
          params: init,
        }),
      }).then((r) => r.json()),
  });

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const r = await authInit.mutateAsync(value);
      await navigate({ to: "/" });
    },
  });

  return (
    <div className="m-4">
      <h1>Log in to Porla</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <fieldset className="fieldset">
          <form.Field
            name="username"
            children={(field) => (
              <>
                <label className="label">Username</label>
                <input
                  type="text"
                  className="input"
                  placeholder="porla-user-ab12"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          />
        </fieldset>
        <button
          type="submit"
          className={clsx([
            "btn btn-primary",
            form.state.isSubmitting && "btn-disabled",
          ])}
        >
          Log in
        </button>
      </form>
    </div>
  );
}
