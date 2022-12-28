import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import * as React from "react";
import Modal from "~/components/Modal";
import TournamentForm from "~/components/TournamentForm";
import { useNavigate } from "@remix-run/react";

import { createTournament } from "~/models/tournament.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const teamSize = Number(formData.get("teamSize"));
  const signupOpen = Boolean(formData.get("signupOpen"));

  if (typeof title !== "string" || title.length === 0) {
    return json(
      {
        errors: {
          title: "Title is required",
          description: null,
          teamSize: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json(
      {
        errors: {
          description: "Description is required",
          title: null,
          teamSize: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof teamSize !== "number" || teamSize === 0) {
    return json(
      {
        errors: {
          teamSize: "Team Size is required",
          title: null,
          description: null,
        },
      },
      { status: 400 }
    );
  }

  const tournament = await createTournament({
    title,
    description,
    userId,
    teamSize,
    signupOpen,
  });

  return redirect(`/tournaments/${tournament.id}`);
}

export default function NewTournamentPage() {
  const navigate = useNavigate();

  function closeHandler() {
    // navigate programmatically
    navigate("..");
  }

  return (
    <Modal onClose={closeHandler}>
      <TournamentForm />
    </Modal>
  );
}
