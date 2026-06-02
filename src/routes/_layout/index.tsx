import type { InfoHash } from "@/api";
import { createFileRoute } from "@tanstack/react-router";

type TorrentFilterStatus =
  | "downloading"
  | "downloading_queued"
  | "finished"
  | "seeding"
  | "seeding_queued"
  | "paused"
  | "error";

type TorrentSearch = {
  session_id?: number;
  status?: TorrentFilterStatus[];
  selected_info_hash?: InfoHash;
  selected_session_id?: number;
  selected_tab_id?: string;
};

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): TorrentSearch => {
    return {
      session_id: search.session_id ? Number(search.session_id) : undefined,
      status:
        typeof search.status === "undefined"
          ? undefined
          : (search.status as TorrentFilterStatus[]),
    };
  },
});

function RouteComponent() {
  return (
    <div>
      <div className="bg-base-200 p-3">
        <input className="input w-full" placeholder="Search" />
      </div>
      Hello "/"!
    </div>
  );
}
