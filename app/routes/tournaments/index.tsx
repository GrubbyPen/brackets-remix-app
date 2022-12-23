import { Link } from "@remix-run/react";

export default function TournamentIndexPage() {
  return (
    <p>
      No tournament selected. Select a tournament on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new tournament.
      </Link>
    </p>
  );
}
