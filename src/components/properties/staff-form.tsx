"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { fieldClass, FormBanner, FormCard } from "@/components/ui/form";
import { emptyActionState } from "@/lib/action-state";
import { createStaffAction } from "@/services/actions";
import { complaintCategories } from "@/types/operations";

function StaffFields() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  function toggleSkill(skill: string) {
    setSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill],
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-medium text-muted">
          Name
          <input
            name="name"
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={`${fieldClass} h-10`}
          />
        </label>
        <label className="text-xs font-medium text-muted">
          Phone
          <input
            name="phone"
            required
            inputMode="numeric"
            placeholder="10 digits"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={`${fieldClass} h-10`}
          />
        </label>
      </div>
      <fieldset>
        <legend className="text-xs font-medium text-muted">Skills</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {complaintCategories.map((skill) => (
            <label key={skill} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="skills"
                value={skill}
                checked={skills.includes(skill)}
                onChange={() => toggleSkill(skill)}
              />
              {skill}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

export function StaffForm() {
  const [state, action, pending] = useActionState(createStaffAction, emptyActionState);

  return (
    <FormCard title="Add staff" description="The person appears in the list and can be assigned on a complaint.">
      <FormBanner error={state.error} message={state.message} revision={state.revision} />
      <form action={action} key={state.savedAt ?? "new-staff"} className="grid gap-4">
        <StaffFields />
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Add staff"}
        </Button>
      </form>
    </FormCard>
  );
}
