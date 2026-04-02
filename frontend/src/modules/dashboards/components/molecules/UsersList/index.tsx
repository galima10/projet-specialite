import { Users } from "@stores/features/users";
import { Dispatch, SetStateAction } from "react";

export default function UsersList({
  users,
  setSelectedUser,
  setTab,
}: {
  users: Users[];
  setSelectedUser: Dispatch<SetStateAction<Users>>;
  setTab: Dispatch<SetStateAction<"home" | "viewProfile">>;
}) {
  return (
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
  );
}
