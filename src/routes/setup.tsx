import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup")({
  component: RouteComponent,
});

type AuthInitReq = {
  username: string;
  password: string;
};

function RouteComponent() {
  const authInit = useMutation({
    mutationKey: ["auth.init"],
    mutationFn: (init: AuthInitReq) =>
      fetch("/api/v1/jsonrpc", {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "auth.init",
          params: init,
        }),
      }).then((r) => r.json()),
  });

  const form = useForm({
    defaultValues: {
      username: "foo",
      password: "bar",
    },
    onSubmit: async ({ value }) => {
      const r = await authInit.mutateAsync(value);
      console.log(r);
    },
  });

  return (
    <div className="m-4">
      <h1>Set up Porla</h1>
      <p className="text-sm">
        No existing user account was found, which means you need to create one.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <fieldset className="fieldset">
          <label className="label">Username</label>
          <input type="text" className="input" placeholder="porla-user-ab12" />

          <label className="label">Password</label>
          <input type="password" className="input" />
        </fieldset>
        <button type="submit" className="btn btn-primary">
          Create user
        </button>
      </form>
    </div>
  );
}
