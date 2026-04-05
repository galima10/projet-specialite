import { useAppDispatch, useAppSelector } from "@modules/shared/hooks/redux";
import {
  logoutThunk,
  deleteUserThunk,
  fetchCurrentUserThunk,
} from "@stores/thunks/users";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/route";
import styles from "./ProfilePage.module.scss";
import { roles } from "@modules/dashboards/components/molecules/UserForm";
import { useState, useEffect } from "react";
import UserForm from "@modules/dashboards/components/molecules/UserForm";

export default function ProfilePage() {
  const { currentUser, users } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logoutThunk());
    navigate(ROUTES.PROFILE.route);
  }
  function handleDashboard() {
    if (currentUser.role === "ROLE_ADMIN") {
      navigate(ROUTES.DASHBOARDS.ADMIN.route);
    } else if (currentUser.role === "ROLE_TREASURER") {
      navigate(ROUTES.DASHBOARDS.TREASURER.route);
    } else if (currentUser.role === "ROLE_MEMBER") {
      navigate(ROUTES.DASHBOARDS.MEMBER.route);
    }
  }

  async function handleDeleteAccount() {
    await dispatch(deleteUserThunk(currentUser.id)).unwrap();
  }

  const [tab, setTab] = useState<"home" | "modify" | "addReport">("home");
  return (
    <div className={styles.profilePage}>
      {tab === "home" ? (
        <>
          <h1>Votre profil</h1>
          <div>
            <p>Nom : {currentUser.name}</p>
            <p>Email: {currentUser.email}</p>
            <p>
              Rôle:{" "}
              {roles
                .find((r) => r.value === currentUser.role)
                .name.toLowerCase()}
            </p>
          </div>
          <div className={styles.buttons}>
            <button className="secondary" onClick={() => setTab("modify")}>
              Modifier le compte
            </button>
            {(currentUser.role !== "ROLE_ADMIN" ||
              users.filter((u) => u.role === "ROLE_ADMIN").length !== 1) && (
              <button className="tertiary" onClick={handleDeleteAccount}>
                Supprimer le compte
              </button>
            )}
          </div>
          <div className={styles.buttons}>
            <button className="secondary" onClick={() => handleDashboard()}>
              Retour
            </button>
            <button className="tertiary" onClick={handleLogout}>
              Déconnecter
            </button>
          </div>
        </>
      ) : (
        <UserForm type="update" userId={currentUser.id} setTab={setTab} />
      )}
    </div>
  );
}
