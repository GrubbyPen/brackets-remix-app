import { Form, useActionData, useMatches, useParams } from "@remix-run/react";
import * as React from "react";
import type { action } from "~/routes/tournaments/$tournamentId";

export default function TournamentForm() {
  const actionData = useActionData<typeof action>();
  const matches = useMatches();
  const params = useParams();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const teamSizeRef = React.useRef<HTMLInputElement>(null);

  const tournaments = matches.find(
    (match) => match.id === "routes/tournaments"
  )?.data;
  const tournamentData = tournaments!.find((t) => t.id === params.tournamentId);

  const defaultValues = tournamentData
    ? {
        title: tournamentData.title,
        description: tournamentData.description,
        teamSize: tournamentData.teamSize,
        signupOpen: tournamentData.signupOpen,
      }
    : {
        title: "",
        description: "",
        teamSize: 2,
        signupOpen: false,
      };
  // console.log("OUTPUTTING", defaultValues);
  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    } else if (actionData?.errors?.teamSize) {
      teamSizeRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method={tournamentData ? "patch" : "post"}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            defaultValue={defaultValues.title}
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Team Size: </span>
          <input
            ref={teamSizeRef}
            type="number"
            name="teamSize"
            defaultValue={defaultValues.teamSize}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.teamSize ? true : undefined}
            aria-errormessage={
              actionData?.errors?.teamSize ? "teamSize-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.teamSize && (
          <label className="flex w-full flex-col gap-1">
            <div className="pt-1 text-red-700" id="teamSize-error">
              {actionData.errors.teamSize}
            </div>
          </label>
        )}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <textarea
            ref={descriptionRef}
            name="description"
            rows={5}
            defaultValue={defaultValues.description}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-errormessage={
              actionData?.errors?.description ? "description-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.description && (
          <div className="pt-1 text-red-700" id="description-error">
            {actionData.errors.description}
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            name="signupOpen"
            type="checkbox"
            className="peer sr-only"
            defaultChecked={defaultValues.signupOpen}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Open the tournament for signup.
          </span>
        </label>
      </div>
      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
