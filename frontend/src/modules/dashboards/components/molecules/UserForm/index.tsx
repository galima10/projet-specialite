import { useAppDispatch } from "@modules/shared/hooks/redux";
import { createUserThunk, updateUserThunk } from "@stores/thunks/users";
import styles from "./UserForm.module.scss";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Users } from "@stores/features/users";
import { useUserForm } from "@modules/dashboards/hooks/useUserForm";
import InputField from "../../atoms/InputField";
import SelectField from "../../atoms/SelectField";

export const roles = [
  {
    name: "MEMBRE",
    value: "ROLE_MEMBER",
  },
  {
    name: "TRÉSORIER",
    value: "ROLE_TREASURER",
  },
  {
    name: "ADMIN",
    value: "ROLE_ADMIN",
  },
];

export default function UserForm({
  type,
  userId,
  setTab,
  users,
  currentUser,
}: {
  type: "update" | "create" | null;
  userId?: number;
  setTab: Dispatch<SetStateAction<"home" | "addReport">>;
  users: Users[];
  currentUser: Users;
}) {
  const {
    handleSubmit,
    handleInputChange,
    selectedUser,
    adminsCount,
    setFormData,
    sendData,
    fieldErrors,
  } = useUserForm(users, userId, setTab, type);

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        handleInputChange={handleInputChange}
        label="Nom d'utilisateur"
        id="name"
        name="name"
        type="text"
        placeholder="Entrez un nom..."
        error={fieldErrors.name}
        defaultValue={selectedUser && selectedUser.name}
      />
      <InputField
        handleInputChange={handleInputChange}
        label="Email"
        id="email"
        name="email"
        type="email"
        placeholder="Entrez un email..."
        error={fieldErrors.email}
        defaultValue={selectedUser && selectedUser.email}
      />
      <InputField
        handleInputChange={handleInputChange}
        label="Mot de passe"
        id="password"
        name="password"
        type="text"
        placeholder="Entrez un email..."
        error={fieldErrors.password}
      />
      <SelectField
        handleInputChange={handleInputChange}
        label="Rôle"
        id="role"
        name="role"
        options={roles}
        error={fieldErrors.role}
        defaultValue={selectedUser && selectedUser.role}
        disabled={
          adminsCount.length === 1 &&
          currentUser.role === "ROLE_ADMIN" &&
          currentUser.id === userId
        }
      />
      <div className={styles.nextPrevButton}>
        <button
          className="secondary"
          onClick={() => {
            setTab("home");
            setFormData({
              name: "",
              email: "",
              role: "",
              password: "",
            });
          }}
        >
          Annuler
        </button>
        <button className="primary" onClick={sendData}>
          Enregistrer
        </button>
      </div>
    </form>
  );
}
