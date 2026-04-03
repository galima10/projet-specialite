import styles from "./LoginForm.module.scss";
import { UserLogin } from "@stores/thunks/users";
import { loginThunk } from "@stores/thunks/users";
import { useAppDispatch } from "@modules/shared/hooks/redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/route";
export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserLogin>({
    email: "",
    password: "",
  });

  useEffect(() => {
    setFormData({
      email: "",
      password: "",
    });
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

  async function sendData() {
    try {
      if (formData.email === "" || formData.password === "") {
        console.log("manque de champs");
        return null;
      }

      const resultAction = await dispatch(loginThunk(formData));

      if (loginThunk.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        console.log("Utilisateur connecté :", user);

        if (user.role === "ROLE_ADMIN") {
          navigate(ROUTES.DASHBOARDS.ADMIN.route);
        } else if (user.role === "ROLE_MEMBER") {
          navigate(ROUTES.DASHBOARDS.MEMBER.route);
        } else if (user.role === "ROLE_TREASURER") {
          navigate(ROUTES.DASHBOARDS.TREASURER.route);
        }
        setFormData({
          email: "",
          password: "",
        });
      } else {
        console.log(
          "Échec de connexion :",
          resultAction.payload || resultAction.error,
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.input}>
        <label htmlFor="email">Votre adresse mail</label>
        <input
          id="email"
          type="email"
          placeholder="Entrez une adresse mail..."
          name="email"
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.input}>
        <label htmlFor="password">Votre mot de passe</label>
        <input
          id="password"
          type="password"
          placeholder="Entrez votre mot de passe associé..."
          name="password"
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.nextPrevButton}>
        <button className="primary" onClick={sendData}>Se connecter</button>
        <button className="tertiary"
          onClick={() => {
            navigate(ROUTES.REGISTER.route);
            console.log("register");
          }}
        >
          Créer un compte
        </button>
      </div>
    </form>
  );
}
