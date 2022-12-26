import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getTournamentListItems } from "~/models/tournament.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const tournamentListItems = await getTournamentListItems({ userId });
  return json({ tournamentListItems });
}

export default function TournamentsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Tournaments</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Tournament
          </Link>

          <hr />

          {data.tournamentListItems.length === 0 ? (
            <p className="p-4">No tournaments yet</p>
          ) : (
            <ol>
              {data.tournamentListItems.map((tournament) => (
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
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
