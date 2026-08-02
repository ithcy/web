import { useRPC, type InfoHash, type TorrentsGet } from "@/api";

type GeneralTabProps = {
  info_hash: InfoHash;
  session_id: number;
};

export default function GeneralTab({ info_hash, session_id }: GeneralTabProps) {
  const details = useRPC<TorrentsGet>("torrents.get", {
    info_hash,
    session_id,
  });

  return <>{details.data?.torrent.name}</>;
}
