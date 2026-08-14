import { createFileRoute } from "@tanstack/react-router";

import { prefixPath } from "@/base";
import { useEffect, useState } from "react";
import { useInvoker, useRPC } from "@/api";
import { useAppForm } from "@/hooks/form";
import { readFile } from "@/utils";

export const Route = createFileRoute("/_layout/settings/_layout/webui")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = useRPC<any>("kv.get", {
    keys: ["porla.webui.repo"],
  });

  const setKey = useInvoker("kv.set");
  const install = useInvoker("webui.install");

  const [releases, setReleases] = useState<any[]>();
  const [version, setVersion] = useState<string>();

  useEffect(() => {
    fetch(prefixPath("version.json"))
      .then((r) => r.json())
      .then((r) => {
        setVersion(r.semver);
      })
      .catch((e) => {});
  }, []);

  const form = useAppForm({
    defaultValues: {
      version: ""
    },
    onSubmit: async ({ value }) => {
      await install.mutateAsync({
        version: value.version
      });

      // TODO: hacky since the key-update signal is posted to the io thread, so we
      // need some space for the UI zip to reload
      setTimeout(() => location.reload(), 1000);
    },
  });

  if (data.isLoading || !data.data) {
    return <>loading</>;
  }

  const repo = data.data.values["porla.webui.repo"] ?? "porla/web";

  return (
    <div>
      <ul>
        <li>Current version: {version ?? "Unknown"}</li>
        <li>
          Available versions
          <button
            className="btn btn-primary"
            onClick={async () => {
              const releases = await fetch(
                `https://api.github.com/repos/${repo}/releases`,
              ).then((r) => r.json());
              setReleases(releases);
            }}
          >
            Load from {repo}
          </button>
        </li>
      </ul>

      {releases && releases.length > 0 && (
        <table className="table">
          <tbody>
            {releases.map((r) => (
              <tr key={`${r.id}`}>
                <td>{r.name}</td>
                <td>
                  {r.assets.find((a: any) => a.name === "webui.zip") && (
                    <a
                      className="btn btn-primary btn-xs"
                      href={r.html_url}
                      target="_blank"
                    >
                      View on GitHub
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-5">
        <h1>Install version</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.AppField
            name="version"
            children={(field) => <field.TextField label="Version to install" />}
          />

          <form.AppForm>
            <form.SubmitButton label="Upload" />
          </form.AppForm>
        </form>
      </div>
    </div>
  );
}
