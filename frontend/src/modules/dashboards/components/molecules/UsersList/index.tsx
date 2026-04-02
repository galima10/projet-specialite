import { Users } from "@stores/features/users";
import { Dispatch, SetStateAction } from "react";

export default function UsersList({
  users,
  setSelectedUser,
  setTab,
  setFormType,
}: {
  users: Users[];
  setSelectedUser: Dispatch<SetStateAction<Users>>;
  setTab: Dispatch<SetStateAction<"home" | "viewProfile" | "setUser">>;
  setFormType: Dispatch<
    SetStateAction<{ type: "create" | "update"; userId?: number }>
  >;
}) {
  return (
    <div>
      <button
        onClick={() => {
          setFormType({
            type: "create",
          });
          setTab("setUser");
        }}
      >
        Ajouter un nouvel utilisateur
      </button>
      <ul>
        {users.map((user) => {
          return (
            <li key={user.id}>
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setTab("viewProfile");
                }}
              >
                {user.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
