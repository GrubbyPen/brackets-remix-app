import { Form, Link, useFetcher, useSubmit } from "@remix-run/react";

function TournamentListItem({ id, title, amount }) {
  // const submit = useSubmit();
  const fetcher = useFetcher();
  function deleteTournamentItemHandler() {
    const proceed = confirm("Are you sure? Do you want to delete this item?");
    // submit(null, {
    //   method: 'delete',
    //   action: `/tournaments/${id}`,
    // });
    if (!proceed) {
      return;
    }
    fetcher.submit(null, { method: "delete", action: `/tournaments/${id}` });
  }

  if (fetcher.state !== "idle") {
    return (
      <article className="tournament-item locked">
        <p>Deleting...</p>
      </article>
    );
  }

  return (
    <article className="tournament-item">
      <div>
        <h2 className="tournament-title">{title}</h2>
        {/* <p className="tournament-amount">${amount.toFixed(2)}</p> */}
      </div>
      <menu className="tournament-actions">
        <button onClick={deleteTournamentItemHandler}>Delete</button>
        {/* <Form method='delete' action={`/tournaments/${id}`}>
          <button>Delete</button>
        </Form> */}
        <Link to={id}>Edit</Link>
      </menu>
    </article>
  );
}

export default TournamentListItem;
