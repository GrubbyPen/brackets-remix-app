import TournamentListItem from "./TournamentListItem";

function TournamentsList({ tournaments }) {
  return (
    <ol id="tournaments-list">
      {tournaments.map((tournament) => (
        <li key={tournament.id}>
          <TournamentListItem
            id={tournament.id}
            title={tournament.title}
            amount={tournament.amount}
          />
        </li>
      ))}
    </ol>
  );
}

export default TournamentsList;
