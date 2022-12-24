import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Owners from "~/components/Owners";

import {
  deleteTournament,
  getTournament,
  applyToTournament,
} from "~/models/tournament.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.tournamentId, "tournamentId not found");

  const tournament = await getTournament({ userId, id: params.tournamentId });
  if (!tournament) {
    const t = await applyToTournament({ userId, id: params.tournamentId });
    if (!t) {
      throw new Response("Not Found", { status: 404 });
    }
    return redirect(`/tournaments/${t.id}/apply`);
  }
  return json({ tournament });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.tournamentId, "tournamentId not found");

  await deleteTournament({ userId, id: params.tournamentId });

  return redirect("/tournaments");
}

export default function TournamentDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.tournament.title}</h3>
      <p className="py-6">{data.tournament.description}</p>
      <hr className="my-4" />
      By{" "}
      <Owners
        owners={data.tournament.users
          .filter((user) => user.role === "OWNER")
          .map((owner) => {
            return {
              id: owner.user.id,
              name: owner.user.name ?? owner.user.email,
            };
          })}
      />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Tournament not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
