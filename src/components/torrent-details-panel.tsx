import { type TorrentsPeersList, useRPC, type InfoHash } from "@/api";
import { X } from "lucide-react";

type TorrentDetailsPanelProps = {
  info_hash: InfoHash;
  session_id: Number;
};

export default function TorrentDetailsPanel({
  info_hash,
  session_id,
}: TorrentDetailsPanelProps) {
  const peers = useRPC<TorrentsPeersList>("torrents.peers.list", {
    info_hash,
    session_id,
  });

  return (
    <div className="h-120 rounded-tl-md">
      <div className="flex justify-between items-center p-1">
        <div role="tablist" className="tabs tabs-box tabs-sm">
          <a role="tab" className="tab">
            Tab 1
          </a>
          <a role="tab" className="tab tab-active">
            Tab 2
          </a>
          <a role="tab" className="tab">
            Tab 3
          </a>
        </div>
        <div>
          <button className="btn btn-square btn-xs">
            <X />
          </button>
        </div>
      </div>
    </div>
  );
}
