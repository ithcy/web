import { type SessionsList, type TorrentsCount, useRPC } from "@/api";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeftRight, Check, Download, Pause, TriangleAlert, Upload } from "lucide-react";
import { useEffect } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const torrentSearch = useSearch({ from: "/_layout/", shouldThrow: false });

  const sessions = useRPC<SessionsList>("sessions.list", null, {
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (!torrentSearch) {
      return;
    }

    if (sessions.data && !torrentSearch.session_id) {
      navigate({
        to: "/",
        search: {
          ...torrentSearch,
          session_id: sessions.data.sessions[0].id,
        },
      });
    }
  }, [torrentSearch, sessions]);

  return (
    <div>
      <ul className="menu w-full">
        <li className="menu-title">Sessions</li>
        {sessions.isLoading && (
          <li>
            <span className="loading loading-spinner loading-md"></span>
          </li>
        )}

        {sessions.data?.sessions.map((s) => (
          <li key={`session_${s.id}`}>
            <Link
              to="/"
              className="flex justify-between w-full"
              activeProps={{
                className: "bg-base-100",
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="size-4 aspect-square bg-red-400"></div>
                <span>{s.name}</span>
              </div>
              <span>{s.torrents_total}</span>
            </Link>
          </li>
        ))}
      </ul>

      <TorrentsList session_id={torrentSearch?.session_id} />
    </div>
  );
}

function TorrentsList({ session_id }: { session_id?: Number }) {
  const torrentSearch = useSearch({ from: "/_layout/", shouldThrow: false });

  const count = useRPC<TorrentsCount>(
    "torrents.count",
    { session_id },
    {
      enabled: !!session_id,
      refetchInterval: 1000,
    },
  );

  return (
    <ul className="menu w-full">
      <li className="menu-title">Torrents</li>
      <li>
        <Link
          to="/"
          search={{
            ...torrentSearch,
            status: undefined,
          }}
          activeOptions={{
            exact: true,
          }}
          activeProps={{
            className: "bg-base-100",
          }}
          className="flex justify-between w-full"
        >
          <div className="flex space-x-2 items-center">
            <ArrowLeftRight className="size-4 text-gray-300" />
            <span>All</span>
          </div>
          <span>{count.data?.total}</span>
        </Link>
      </li>
      <li>
        <Link
          to="/"
          search={{
            ...torrentSearch,
            status: ["downloading", "downloading_queued"],
          }}
          activeOptions={{
            exact: true,
          }}
          activeProps={{
            className: "bg-base-100",
          }}
          className="flex justify-between w-full"
        >
          <div className="flex space-x-2 items-center">
            <Download className="size-4 text-green-300" />
            <span>Downloading</span>
          </div>
          <span>
            {count.data &&
              count.data.downloading + count.data.downloading_queued}
          </span>
        </Link>
      </li>
      <li>
        <Link
          to="/"
          search={{
            ...torrentSearch,
            status: ["seeding", "seeding_queued"],
          }}
          activeOptions={{
            exact: true,
          }}
          activeProps={{
            className: "bg-base-100",
          }}
          className="flex justify-between w-full"
        >
          <div className="flex space-x-2 items-center">
            <Upload className="size-4 text-blue-300" />
            <span>Seeding</span>
          </div>
          <span>
            {count.data && count.data.seeding + count.data.seeding_queued}
          </span>
        </Link>
      </li>
      <li>
        <Link
          to="/"
          search={{
            ...torrentSearch,
            status: ["finished"],
          }}
          activeProps={{
            className: "bg-base-100",
          }}
          className="flex justify-between w-full"
        >
          <div className="flex space-x-2 items-center">
            <Check className="size-4 text-purple-300" />
            <span>Finished</span>
          </div>
          <span>{count.data && count.data.finished}</span>
        </Link>
      </li>
      <li>
        <Link
          to="/"
          search={{
            ...torrentSearch,
            status: ["paused"],
          }}
          activeProps={{
            className: "bg-base-100",
          }}
          className="flex justify-between w-full"
        >
          <div className="flex space-x-2 items-center">
            <Pause className="size-4 text-orange-300" />
            <span>Paused</span>
          </div>
          <span>{count.data && count.data.paused}</span>
        </Link>
      </li>
      <li>
        <Link
          to="/"
          search={{
            ...torrentSearch,
            status: ["error"],
          }}
          activeProps={{
            className: "bg-base-100",
          }}
          className="flex justify-between w-full"
        >
          <div className="flex space-x-2 items-center">
            <TriangleAlert className="size-4 text-red-300" />
            <span>Error</span>
          </div>
          <span>{count.data && count.data.error}</span>
        </Link>
      </li>
    </ul>
  );
}
