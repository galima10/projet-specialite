import styles from "./Header.module.scss";

import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@modules/shared/hooks/redux";

import { ROUTES } from "@constants/route";

export default function Header() {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const { currentUser } = useAppSelector((state) => state.user);
  function handleDashboard() {
    if (!currentUser) return;
    switch (currentUser.role) {
      case "ROLE_ADMIN":
        navigate(ROUTES.DASHBOARDS.ADMIN.route);
        break;
      case "ROLE_TREASURER":
        navigate(ROUTES.DASHBOARDS.TREASURER.route);
        break;
      case "ROLE_MEMBER":
        navigate(ROUTES.DASHBOARDS.MEMBER.route);
        break;
      default:
        navigate(ROUTES.HOME.route);
    }
  }
  return (
    <header className={styles.header}>
      <button className={styles.headerButton} onClick={handleDashboard}>
        Dashboard
      </button>
      <button
        className={styles.headerButton}
        onClick={() => navigate(ROUTES.PROFILE.route)}
      >
        Profil
      </button>
    </header>
  );
}
