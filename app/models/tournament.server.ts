import type { User, Tournament } from "@prisma/client";

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
    },
  });
  if (!tournament) {
    throw new Error("Tournament not found");
  }
  if (tournament.users.length === 0) {
    throw new Error("Tournament has no users");
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
        select: { role: true },
      },
    },
  });
}

export function createTournament({
  description,
  title,
  userId,
}: Pick<Tournament, "description" | "title"> & {
  userId: User["id"];
}) {
  return prisma.tournament.create({
    data: {
      title,
      description,
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
