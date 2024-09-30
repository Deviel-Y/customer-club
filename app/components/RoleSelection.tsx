"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Role } from "@prisma/client";
import { Key } from "react";

interface Props {
  selectedRole: (role: Key) => void;
}

const RoleSelection = ({ selectedRole }: Props) => {
  return (
    <Autocomplete
      aria-label="Role selection"
      isRequired
      onSelectionChange={(value) => selectedRole(value || "User")}
      size="lg"
      label="سطح دسترسی"
    >
      {roles.map((role) => (
        <AutocompleteItem key={role.value}>{role.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default RoleSelection;

const roles: { label: string; value: Role }[] = [
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
];
