import type { User, Tournament } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Tournament } from "@prisma/client";

export function getTournament({
  id,
}: Pick<Tournament, "id"> & {
  userId: User["id"];
}) {
  return prisma.tournament.findFirst({
    select: { id: true, description: true, title: true },
    where: {
      AND: [
        {
          id,
        },
        {
          users: { some: {} },
        },
      ],
    },
  });
}

export function getTournamentListItems({ userId }: { userId: User["id"] }) {
  return prisma.user
    .findUniqueOrThrow({
      where: { id: userId },
    })
    .tournaments();
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
