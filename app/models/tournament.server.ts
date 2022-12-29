import type { User, Tournament, TournamentUsers } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Tournament } from "@prisma/client";

export function getTournament({
  userId,
  id,
}: Pick<Tournament, "id"> & {
  userId: User["id"];
}) {
  const tournament = prisma.tournament.findFirst({
    where: {
      AND: [
        {
          id,
        },
        {
          users: { some: { userId } },
        },
      ],
    },
    include: {
      users: {
        select: {
          role: true,
          user: { select: { id: true, name: true, email: true } },
        },
      },
      players: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }
  // todo add authorisation guard
  // check for name sharing approval

  return tournament;
}

export function joinTournament({
  userId,
  id,
}: Pick<Tournament, "id"> & {
  userId: User["id"];
}) {
  const tournament = prisma.tournament.findFirst({
    where: {
      AND: [{ signupOpen: true }, { id }],
    },
    include: {
      users: {
        where: { role: "OWNER" },
        select: {
          role: true,
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  // todo add authorisation guard
  // check for name sharing approval

  return tournament;
}

export function getTournamentListItems({ userId }: { userId: User["id"] }) {
  return prisma.tournament.findMany({
    where: { users: { some: { userId } } },
    include: {
      users: {
        select: { userId: true, role: true },
      },
    },
  });
}

export function createTournament({
  description,
  title,
  userId,
  teamSize,
  signupOpen,
}: Pick<Tournament, "description" | "title"> & {
  userId: User["id"];
}) {
  return prisma.tournament.create({
    data: {
      title,
      description,
      teamSize,
      signupOpen,
      users: {
        create: {
          user: { connect: { id: userId } },
          role: "OWNER",
        },
      },
    },
  });
}

export function deleteTournament({
  id,
  userId,
}: Pick<Tournament, "id"> & { userId: User["id"] }) {
  // todo add authorisation guard
  return prisma.tournament.deleteMany({
    where: { id },
  });
}

export function applyToTournament({
  id,
  userId,
  role,
}: Pick<Tournament, "id"> & {
  userId: User["id"];
  role: TournamentUsers["role"];
}) {
  // todo add authorisation guard
  return prisma.tournamentUsers.create({
    data: {
      tournament: { connect: { id } },
      user: { connect: { id: userId } },
      role,
    },
  });
}

export function updateTournament({
  userId,
  id,
  data,
}: {
  userId: User["id"];
  id: Tournament["id"];
  data: Tournament;
}) {
  // todo add authorisation guard
  console.log("in update", data, userId, id);
  return prisma.tournament.update({
    where: { id },
    data,
  });
}
