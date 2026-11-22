"use client";

import { useState } from "react";
import { complaintCategories, complaintPriorities } from "@/types/operations";
import { fieldClass } from "@/components/ui/form";

export function ComplaintDraftFields() {
  const [category, setCategory] = useState<string>(complaintCategories[0]);
  const [priority, setPriority] = useState("Medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <>
      <label className="text-xs font-medium text-muted">
        Category
        <select
          name="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={`${fieldClass} h-10`}
        >
          {complaintCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-medium text-muted">
        Priority
        <select
          name="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          className={`${fieldClass} h-10`}
        >
          {complaintPriorities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-medium text-muted sm:col-span-2">
        Title
        <input
          name="title"
          required
          minLength={3}
          maxLength={80}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={`${fieldClass} h-10`}
        />
      </label>
      <label className="text-xs font-medium text-muted sm:col-span-2">
        Description
        <textarea
          name="description"
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={fieldClass}
        />
      </label>
    </>
  );
}
