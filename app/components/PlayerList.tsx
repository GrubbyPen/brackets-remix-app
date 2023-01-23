import invariant from "tiny-invariant";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { Form } from "@remix-run/react";

interface Props {
  players: {
    id: string;
    name: string;
  }[];
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.tournamentId, "tournamentId not found");
  const userId = await requireUserId(request);
}

export default function PlayersList(props: Props) {
  const players = props.players;

  return (
    <>
      <div>
        <h2>Players</h2>
        <Form method="post">
          <input name="playerInput" autoFocus />
          <div></div>
          <button
            type="submit"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Add
          </button>
        </Form>
      </div>
      {players && players.length === 0 ? (
        <span>No Players</span>
      ) : (
        players.map((player, index) => (
          <li key={player.id} className="player">
            {player.name}
          </li>
        ))
      )}
    </>
  );
}
