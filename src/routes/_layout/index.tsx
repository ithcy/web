import { type TorrentsList, useRPC, type InfoHash, type Torrent } from "@/api";
import TorrentDetailsPanel from "@/components/torrent-details-panel";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

type TorrentFilterStatus =
  | "downloading"
  | "downloading_queued"
  | "finished"
  | "seeding"
  | "seeding_queued"
  | "paused"
  | "error";

type TorrentSearch = {
  page?: number;
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
      page: search.page ? Number(search.page) : undefined,
      session_id: search.session_id ? Number(search.session_id) : undefined,
      status:
        typeof search.status === "undefined"
          ? undefined
          : (search.status as TorrentFilterStatus[]),
    };
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const pageSize = 50;

  const torrents = useRPC<TorrentsList>(
    "torrents.list",
    {
      filters: {
        session_id: search.session_id,
        status: search.status,
      },
      page: search.page ? search.page - 1 : 0,
      pageSize,
    },
    {
      refetchInterval: 1000,
    },
  );

  return (
    <div className="flex flex-col h-full">
      <div className="bg-base-300 p-3">
        <input className="input w-full" placeholder="Search" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 bg-base-300">
        <TorrentsTable torrents={torrents.data?.torrents ?? []} />
      </div>

      <div className="bg-base-300 p-3 flex justify-between">
        <div></div>

        {torrents.data && (
          <Pager
            currentPage={search.page ?? 1}
            onPageChange={(page) =>
              navigate({ to: "/", search: { ...search, page } })
            }
            pageSize={pageSize}
            totalItems={torrents.data.torrents_total}
          />
        )}
      </div>
      {search.selected_info_hash && search.selected_session_id && (
        <TorrentDetailsPanel
          info_hash={search.selected_info_hash}
          session_id={search.selected_session_id}
        />
      )}
    </div>
  );
}

type PagerProps = {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

function Pager({
  currentPage,
  onPageChange,
  pageSize,
  totalItems,
}: PagerProps) {
  const pageCount = Math.ceil(totalItems / pageSize);

  return (
    <div className="join">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`join-item btn ${page === currentPage ? "btn-active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

type TorrentsTableProps = {
  torrents: Torrent[];
};

function TorrentsTable({ torrents }: TorrentsTableProps) {
  const search = Route.useSearch();

  return (
    <table className="table table-zebra">
      <thead>
        <tr>
          <th className="text-right w-4">#</th>
          <th>Name</th>
          <th>Size</th>
          <th>Progress</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {torrents.map((t) => (
          <tr key={`${t.info_hash[0]}`}>
            <td className="text-right">
              {t.queue_position < 0 ? (
                <span className="text-gray-600">-</span>
              ) : (
                `${t.queue_position + 1}`
              )}
            </td>
            <td>
              <Link
                to="/"
                search={{
                  ...search,
                  selected_info_hash: t.info_hash,
                  selected_session_id: search.session_id,
                }}
                className="hover:underline"
              >
                {t.name}
              </Link>
            </td>
            <td>{t.total_done}</td>
            <td>
              <progress value={t.progress} max={1}></progress>
            </td>
            <td className="text-right">
              <button
                className="btn btn-xs btn-square"
                popoverTarget={`popover_${t.info_hash[0]}`}
                style={{ anchorName: `--anchor-${t.info_hash[0]}` }}
              >
                <Menu className="size-4" />
              </button>

              <ul
                className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
                popover="auto"
                id={`popover_${t.info_hash[0]}`}
                style={{ positionAnchor: `--anchor-${t.info_hash[0]}` }}
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
