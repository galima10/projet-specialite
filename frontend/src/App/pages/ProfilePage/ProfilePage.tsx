import { useAppDispatch, useAppSelector } from "@modules/shared/hooks/redux";
import { logoutThunk } from "@stores/thunks/users";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/route";
import styles from "./ProfilePage.module.scss";
import { roles } from "@modules/dashboards/components/molecules/UserForm";

export default function ProfilePage() {
  const { currentUser } = useAppSelector((state) => state.user);
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
  return (
    <div className={styles.profilePage}>
      <h1>Votre profil</h1>
      <div>
        <p>Nom : {currentUser.name}</p>
        <p>Email: {currentUser.email}</p>
        <p>
          Rôle:{" "}
          {roles.find((r) => r.value === currentUser.role).name.toLowerCase()}
        </p>
      </div>
      <div className={styles.buttons}>
        <button className="secondary" onClick={() => handleDashboard()}>
          Retour
        </button>
        <button className="tertiary" onClick={handleLogout}>
          Déconnecter
        </button>
      </div>
    </div>
  );
}
