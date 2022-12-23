interface Props {
  owners: {
    id: string;
    name: string;
  }[];
}

export default function Owners(props: Props) {
  return (
    <>
      {props.owners && props.owners.length === 0 ? (
        <span>No Owners</span>
      ) : (
        props.owners.map((owner, index) => (
          <span key={owner.id} className="owner">
            {owner.name}
            {index! < props.owners.length - 2 && ", "}
            {index == props.owners.length - 2 && " and "}
          </span>
        ))
      )}
    </>
  );
}
