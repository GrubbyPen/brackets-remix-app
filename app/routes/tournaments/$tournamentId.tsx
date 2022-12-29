import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { json, redirect } from "@remix-run/node";
import { useCatch } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  deleteTournament,
  getTournament,
  joinTournament,
  updateTournament,
} from "~/models/tournament.server";
import { requireUserId } from "~/session.server";
import Owners from "~/components/Owners";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.tournamentId, "tournamentId not found");

  const tournament = await getTournament({ userId, id: params.tournamentId });

  if (!tournament) {
    const t = await joinTournament({ userId, id: params.tournamentId });
    if (!t) {
      throw new Response("Not Found", { status: 404 });
    }
    return redirect(`/tournaments/${t.id}/join`);
  }
  return json({ userId, tournament });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.tournamentId, "tournamentId not found");
  const userId = await requireUserId(request);

  if (request.method === "PATCH") {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const teamSize = Number(formData.get("teamSize"));
    const signupOpen = Boolean(formData.get("signupOpen"));
    // const tournamentData = Object.fromEntries(formData);
    console.log("in save ...", params.tournamentId);
    // try {
    //   validateFormInput(tournamentData);
    // } catch (error) {
    //   return error;
    // }

    await updateTournament({
      userId,
      id: params.tournamentId,
      data: {
        title,
        description,
        teamSize,
        signupOpen,
      },
    });

    return redirect("/tournaments");
  } else if (request.method === "DELETE") {
    await deleteTournament({ userId, id: params.tournamentId });
    return redirect("/tournaments");
  }
}

export default function TournamentDetailsPage() {
  const data = useLoaderData<typeof loader>();

  const isOwner = data.tournament.users
    .filter((u) => u.user.id === data.userId)
    .some((me) => me.role === "OWNER");

  return (
    <div>
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
      {isOwner && (
        <div>
          <Form method="delete">
            <button
              type="submit"
              className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Create teams
            </button>
          </Form>
          <Form method="delete">
            <button
              type="submit"
              className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Create round
            </button>
          </Form>
        </div>
      )}
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
