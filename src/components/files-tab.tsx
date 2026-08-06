import { type TorrentsFilesList, useRPC, type InfoHash } from "@/api";
import { filesize } from "filesize";

type FilesTabProps = {
  info_hash: InfoHash;
  session_id: number;
};

export default function FilesTab({ info_hash, session_id }: FilesTabProps) {
  const files = useRPC<TorrentsFilesList>("torrents.files.list", {
    info_hash,
    session_id,
  });

  return (
    <table className="table table-sm">
      <tbody>
        {files.data?.files.map((f) => (
          <tr key={`file_${f.path}`}>
            <td>{f.path}</td>
            <td>{filesize(f.size)}</td>
            <td>{f.symlink ? "symlink" : "-"}</td>
            <td>{f.flags.join(",")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
