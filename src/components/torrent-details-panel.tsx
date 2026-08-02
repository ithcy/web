import { type InfoHash } from "@/api";
import { Link, useSearch } from "@tanstack/react-router";
import { X } from "lucide-react";
import GeneralTab from "./general-tab";
import FilesTab from "./files-tab";
import PeersTab from "./peers-tab";
import TrackersTab from "./trackers-tab";

type TorrentDetailsPanelProps = {
  info_hash: InfoHash;
  session_id: number;
};

const tabs = [
  {
    id: "general",
    name: "General",
  },
  {
    id: "files",
    name: "Files",
  },
  {
    id: "peers",
    name: "Peers",
  },
  {
    id: "trackers",
    name: "Trackers",
  },
];

export default function TorrentDetailsPanel({
  info_hash,
  session_id,
}: TorrentDetailsPanelProps) {
  const torrentSearch = useSearch({ from: "/_layout/", shouldThrow: false });

  return (
    <div className="h-90 rounded-tl-md">
      <div className="flex justify-between items-center p-1">
        <div role="tablist" className="tabs tabs-box tabs-sm">
          {tabs.map((t) => (
            <Link
              to="/"
              role="tab"
              className="tab"
              search={{
                ...torrentSearch,
                selected_tab_id: t.id,
              }}
              activeProps={{
                className: "tab-active",
              }}
            >
              {t.name}
            </Link>
          ))}
        </div>
        <div>
          <Link
            to="/"
            search={{
              ...torrentSearch,
              selected_info_hash: undefined,
              selected_session_id: undefined,
              selected_tab_id: undefined,
            }}
            className="btn btn-square btn-xs"
          >
            <X />
          </Link>
        </div>
      </div>

      {torrentSearch?.selected_tab_id === "general" && (
        <GeneralTab info_hash={info_hash} session_id={session_id} />
      )}

      {torrentSearch?.selected_tab_id === "files" && (
        <FilesTab info_hash={info_hash} session_id={session_id} />
      )}

      {torrentSearch?.selected_tab_id === "peers" && (
        <PeersTab info_hash={info_hash} session_id={session_id} />
      )}

      {torrentSearch?.selected_tab_id === "trackers" && (
        <TrackersTab info_hash={info_hash} session_id={session_id} />
      )}
    </div>
  );
}
