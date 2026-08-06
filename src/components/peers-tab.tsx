import { type TorrentsPeersList, useRPC, type InfoHash } from "@/api";

type PeersTabProps = {
  info_hash: InfoHash;
  session_id: number;
};

export default function PeersTab({ info_hash, session_id }: PeersTabProps) {
  const peers = useRPC<TorrentsPeersList>(
    "torrents.peers.list",
    {
      info_hash,
      session_id,
    },
    {
      refetchInterval: 2000,
    },
  );

  return (
    <table className="table table-sm">
      <tbody>
        {peers.data?.peers.map((p) => (
          <tr key={`peer_${p.ip[0].replace(":", "_")}_${p.ip[1]}`}>
            <td>{p.ip[0]}:{p.ip[1]}</td>
            <td>{p.connection_type}</td>
            <td>{p.flags.join(",")}</td>
            <td>{p.source.join(",")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
