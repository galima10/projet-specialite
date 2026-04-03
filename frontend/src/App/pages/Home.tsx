import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/route";
import styles from "./Home.module.scss";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      <h1>Bienvenu sur la plate-forme pour gérer vos notes de frais !</h1>
      <div className={styles.buttons}>
        <button
          className="primary"
          onClick={() => navigate(ROUTES.LOGIN.route)}
        >
          Se connecter
        </button>
        <button
          className="secondary"
          onClick={() => navigate(ROUTES.REGISTER.route)}
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
}
