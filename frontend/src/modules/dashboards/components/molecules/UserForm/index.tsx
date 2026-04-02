import { useAppDispatch } from "@modules/shared/hooks/redux";
import { createUserThunk, updateUserThunk } from "@stores/thunks/users";
import styles from "./UserForm.module.scss";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Users } from "@stores/features/users";

const roles = [
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
  const adminsCount = users.filter((u) => u.role === "ROLE_ADMIN");
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Users & { password: string }>({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const selectedUser = userId ? users.find((u) => u.id === userId) : null;
  useEffect(() => {
    if (userId) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        password: "",
      });
    }
  }, []);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;

    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  function sendData() {
    console.log(formData);
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.role === ""
    ) {
      console.log("manque de champs");
      return null;
    }

    const newUser: Users = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };
    const newPassword = formData.password;
    if (type === "create") dispatch(createUserThunk({ newUser, newPassword }));
    else {
      newUser.id = userId;
      dispatch(updateUserThunk({ newUser, newPassword }));
    }
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setTab("home");
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.input}>
        <label htmlFor="name">Nom d'utilisateur</label>
        <input
          id="name"
          type="text"
          placeholder="Entrez un nom..."
          name="name"
          onChange={handleInputChange}
          defaultValue={selectedUser && selectedUser.name}
        />
      </div>
      <div className={styles.input}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Entrez un email..."
          name="email"
          onChange={handleInputChange}
          defaultValue={selectedUser && selectedUser.email}
        />
      </div>
      <div className={styles.input}>
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="text"
          placeholder="Entrez un mot de passe..."
          name="password"
          onChange={handleInputChange}
        />
      </div>
      <div
        className={`${styles.input} ${adminsCount.length === 1 && currentUser.role === "ROLE_ADMIN" && currentUser.id === userId && "disabled"}`}
      >
        <label htmlFor="role">Rôle</label>
        <select
          name="role"
          id="role"
          onChange={handleInputChange}
          defaultValue={selectedUser && selectedUser.role}
        >
          <option value="">--Choisissez un role--</option>
          {roles.map((item, index) => {
            return (
              <option key={`role-${index}`} value={item.value}>
                {item.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className={styles.nextPrevButton}>
        <button
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
        <button onClick={sendData}>Enregistrer</button>
      </div>
    </form>
  );
}
