import { Users } from "@stores/features/users";
import { Dispatch, SetStateAction } from "react";

export default function UserProfile({
  user,
  setTab,
}: {
  user: Users;
  setTab: Dispatch<SetStateAction<"home" | "viewProfile" | "addReport">>;
}) {
  return (
    <div>
      <button onClick={() => setTab("home")}>Retour</button>
      <p>{user.name}</p>
      {user.role === "ROLE_MEMBER" && (
        <button onClick={() => setTab("addReport")}>
          Ajouter une note de frais à cet utilisateur
        </button>
      )}
    </div>
  );
}
