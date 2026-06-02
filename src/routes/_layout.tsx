import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useQuery({
    queryKey: [""],
    queryFn: () =>
      fetch("/api/v1/jsonrpc", {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "sys.status",
        }),
      }).then((r) => r.json()),
  });

  if (query.isLoading) {
    return <>Loading</>;
  }

  if (query.data && query.data.result.status === "setup") {
    return <Navigate to="/setup" />;
  }

  return <Outlet />;
}
