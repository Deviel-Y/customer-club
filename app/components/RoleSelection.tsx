"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Role } from "@prisma/client";
import { Key } from "react";

interface Props {
  userRole: Role;
  selectedRole: (role: Key) => void;
}

const RoleSelection = ({ selectedRole, userRole }: Props) => {
  return (
    <Autocomplete
      defaultSelectedKey={userRole}
      aria-label="Role selection"
      isRequired
      onSelectionChange={(value) => selectedRole(value || "User")}
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
