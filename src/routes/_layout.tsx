import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import Sidebar from "../components/sidebar";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useQuery({
    queryKey: ["sys.status"],
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

  return <SysVersionsLayout />;
}

function SysVersionsLayout() {
  const versions = useQuery({
    queryKey: ["sys.versions"],
    queryFn: () =>
      fetch("/api/v1/jsonrpc", {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "sys.versions",
        }),
        credentials: "include",
      }).then((r) => r.json()),
    networkMode: "always",
  });

  if (versions.isLoading) {
    return <>loading versions</>;
  }

  if (versions.data.error && versions.data.error.code === 1001) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-full">
      <div className="bg-base-300 w-64">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
