import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import sharedStyles from "~/styles/shared.css";
import tournamentsStyles from "~/styles/tournaments.css";

import { getTournamentListItems } from "~/models/tournament.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import Navbar from "~/components/Navbar";
import type { LinksFunction } from "@remix-run/react/dist/routeModules";
// import TournamentsList from "~/components/TournamentList";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: sharedStyles },
    // { rel: "stylesheet", href: tournamentsStyles },
  ];
};

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const tournamentListItems = await getTournamentListItems({ userId });
  return json(tournamentListItems);
}

export default function TournamentsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Navbar user={user} />

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Tournament
          </Link>

          <hr />

          {data.length === 0 ? (
            <p className="p-4">No tournaments yet</p>
          ) : (
            <ol>
              {data.map((tournament) => (
                <li key={tournament.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={tournament.id}
                  >
                    📝 {tournament.title}
                    <small className="block text-sm text-gray-500">
                      {tournament.users
                        .filter((u) => u.userId === user.id)
                        .map((owner) => {
                          return owner.role;
                        })}
                    </small>
                    <small className="block text-sm text-gray-500">
                      <Link to={`${tournament.id}/edit`}>edit</Link>
                    </small>
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>
        <hr />
        {/* <TournamentsList tournaments={data} /> */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
