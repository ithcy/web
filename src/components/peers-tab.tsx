import { type TorrentsPeersList, useRPC, type InfoHash } from "@/api";

type PeersTabProps = {
  info_hash: InfoHash;
  session_id: number;
};

export default function PeersTab({ info_hash, session_id }: PeersTabProps) {
  const peers = useRPC<TorrentsPeersList>("torrents.peers.list", {
    info_hash,
    session_id,
  });

  return <>{peers.data?.peers.length}</>;
}
