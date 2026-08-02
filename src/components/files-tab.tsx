import { type TorrentsFilesList, useRPC, type InfoHash } from "@/api";

type FilesTabProps = {
  info_hash: InfoHash;
  session_id: number;
};

export default function FilesTab({ info_hash, session_id }: FilesTabProps) {
  const files = useRPC<TorrentsFilesList>("torrents.files.list", {
    info_hash,
    session_id,
  });

  return <>{files.data?.files.length}</>;
}
