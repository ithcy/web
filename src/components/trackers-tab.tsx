import { type TorrentsTrackersList, useRPC, type InfoHash } from "@/api";

type TrackersTabProps = {
  info_hash: InfoHash;
  session_id: number;
};

export default function TrackersTab({
  info_hash,
  session_id,
}: TrackersTabProps) {
  const trackers = useRPC<TorrentsTrackersList>("torrents.trackers.list", {
    info_hash,
    session_id,
  });

  return (
    <table className="table table-sm table-zebra">
      <thead>
        <tr>
          <th className="w-3">#</th>
          <th>Url</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {trackers.data?.trackers.map((t) => (
          <tr key={t.url}>
            <td>{t.tier}</td>
            <td>{t.url}</td>
            <td>{t.verified ? "1" : "0"}</td>
            <td>
              <ul>
                {t.endpoints.map((e) => (
                  <li>
                    {e.enabled ? "1" : "0"}:{" "}
                    {e.local_endpoint[0] + ":" + e.local_endpoint[1]}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
