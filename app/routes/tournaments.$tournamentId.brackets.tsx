import type { LinksFunction } from "@remix-run/node";
import stylesUrl from "~/styles/brackets.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function test() {
  interface Round {
    id: number;
    name: string;
    matches: Game[];
  }

  interface Game {
    id: number;
    round: number;
    competitorA: string;
    competitorB: string;
    winner: string;
  }
  const rounds: Round[] = [
    {
      id: 1,
      name: "quarterfinals",
      matches: [
        {
          id: 1,
          round: 1,
          competitorA: "Team 1",
          competitorB: "Team 2",
          winner: "A",
        },
        {
          id: 2,
          round: 1,
          competitorA: "Team 3",
          competitorB: "Team 4",
          winner: "B",
        },
        {
          id: 3,
          round: 1,
          competitorA: "Team 5",
          competitorB: "Team 6",
          winner: "B",
        },
        {
          id: 4,
          round: 1,
          competitorA: "Team 7",
          competitorB: "Team 8",
          winner: "A",
        },
      ],
    },
    {
      id: 2,
      name: "semifinals",
      matches: [
        {
          id: 5,
          round: 2,
          competitorA: "Team 1",
          competitorB: "Team 4",
          winner: "B",
        },
        {
          id: 6,
          round: 2,
          competitorA: "Team 6",
          competitorB: "Team 7",
          winner: "A",
        },
      ],
    },
    {
      id: 3,
      name: "finals",
      matches: [
        {
          id: 7,
          round: 1,
          competitorA: "Team 4",
          competitorB: "Team 6",
          winner: "A",
        },
      ],
    },
  ];

  return (
    <div className="flex h-full min-h-screen flex-col ">
      <div className="bracket">
        {rounds.map((round) => (
          <section className={`round ${round.name}`} key={round.id}>
            {round.matches
              .reduce((acc, game) => {
                const lastPair = acc[acc.length - 1];
                if (!lastPair || lastPair.length === 2) {
                  acc.push([game]);
                } else {
                  lastPair.push(game);
                }
                return acc;
              }, [])
              .map((matchPair) => (
                <div className="winners" key={matchPair[0].id}>
                  <div className="games">
                    {matchPair.map((game) => (
                      <div className="game" key={game.id}>
                        <div className="participants">
                          <div
                            className={
                              game.winner === "A"
                                ? "participant"
                                : "participant winner"
                            }
                          >
                            <span>{game.competitorA}</span>
                          </div>
                          <div
                            className={
                              game.winner === "B"
                                ? "participant"
                                : "participant winner"
                            }
                          >
                            <span>{game.competitorB}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {round.name !== "finals" && (
                    <div className="connector">
                      <div className="merger"></div>
                      <div className="line"></div>
                    </div>
                  )}
                </div>
              ))}
          </section>
        ))}
      </div>
    </div>
  );
}
