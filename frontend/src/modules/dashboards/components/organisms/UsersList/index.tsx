import { Users } from "@stores/features/users";
import { Dispatch, SetStateAction } from "react";
import styles from "./UserList.module.scss";
import { roles } from "../../molecules/UserForm";
import { useEffect } from "react";

export default function UsersList({
  users,
  setSelectedUser,
  setTab,
  setFormType,
  currentUser,
}: {
  users: Users[];
  setSelectedUser: Dispatch<SetStateAction<Users>>;
  setTab: Dispatch<
    SetStateAction<
      | "home"
      | "viewProfile"
      | "setUser"
      | "addReport"
      | "viewReport"
      | "mileagesManagement"
      | "association"
    >
  >;
  setFormType: Dispatch<
    SetStateAction<{ type: "create" | "update"; userId?: number }>
  >;
  currentUser?: Users;
}) {
  return (
    <div className={styles.userList}>
      {currentUser && currentUser.role === "ROLE_ADMIN" && (
        <button
          className="primary"
          onClick={() => {
            setFormType({
              type: "create",
            });
            setTab("setUser");
          }}
        >
          Ajouter un nouvel utilisateur
        </button>
      )}
      <button className="primary" onClick={() => setTab("association")}>
        Voir le contact de l'association
      </button>
      <ul className={styles.users}>
        {users.map((user) => {
          return (
            <li key={user.id}>
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setTab("viewProfile");
                }}
              >
                <span>Nom : {user.name} </span>
                <span>
                  Role :{" "}
                  {roles.find((r) => r.value === user.role).name.toLowerCase()}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
