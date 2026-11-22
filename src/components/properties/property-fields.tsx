"use client";

import { useState } from "react";
import { fieldClass } from "@/components/ui/form";

export function PropertyFieldSet({
  initial,
}: {
  initial?: { name: string; address: string; city: string };
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [city, setCity] = useState(initial?.city ?? "");

  return (
    <>
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
        Address
        <input
          name="address"
          required
          minLength={3}
          maxLength={120}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className={`${fieldClass} h-10`}
        />
      </label>
      <label className="text-xs font-medium text-muted">
        City
        <input
          name="city"
          required
          minLength={2}
          maxLength={60}
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className={`${fieldClass} h-10`}
        />
      </label>
    </>
  );
}
