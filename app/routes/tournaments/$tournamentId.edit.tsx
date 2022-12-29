import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import { json, redirect } from "@remix-run/node";
import { useCatch } from "@remix-run/react";
import invariant from "tiny-invariant";
import TournamentForm from "~/components/TournamentForm";
import Modal from "~/components/Modal";
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

// export async function action({ request, params }: ActionArgs) {
//   const userId = await requireUserId(request);
//   invariant(params.tournamentId, "tournamentId not found");

//   await deleteTournament({ userId, id: params.tournamentId });

//   return redirect("/tournaments");
// }

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

export default function TournamentEditPage() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const isOwner = data.tournament.users
    .filter((u) => u.user.id === data.userId)
    .some((me) => me.role === "OWNER");

  function closeHandler() {
    navigate("..");
  }

  return (
    <Modal onClose={closeHandler}>
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
                Delete
              </button>
            </Form>
          </div>
        )}
      </div>
      <TournamentForm />
    </Modal>
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
