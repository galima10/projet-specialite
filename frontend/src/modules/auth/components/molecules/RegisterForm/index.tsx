import styles from "./Register.module.scss";
import { UserRegister } from "@stores/thunks/users";
import { registerThunk, fetchCountUsersThunk } from "@stores/thunks/users";
import { useAppDispatch } from "@modules/shared/hooks/redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/route";
import { useAppSelector } from "@modules/shared/hooks/redux";

export default function RegisterForm() {
  const { countUsers } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserRegister>({
    email: "",
    name: "",
    password: "",
  });

  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      name: "",
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

      const resultAction = await dispatch(registerThunk(formData));

      if (registerThunk.fulfilled.match(resultAction)) {
        dispatch(fetchCountUsersThunk());
        navigate(ROUTES.LOGIN.route);
        setFormData({
          email: "",
          password: "",
          name: "",
        });
      } else {
        console.log(
          "Échec de l'enregistrement :",
          resultAction.payload || resultAction.error,
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      {countUsers === 0 && (
        <h5 style={{ textAlign: "center" }}>
          Vous êtes le premier utilisateur de la plate-forme ! <br /> Vous avez
          automatiquement le rôle ADMIN
        </h5>
      )}
      <div className={styles.input}>
        <label htmlFor="name">Votre nom d'utilisateur</label>
        <input
          id="name"
          type="text"
          placeholder="Entrez un nom d'utilisateur..."
          name="name"
          onChange={handleInputChange}
        />
      </div>
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
          placeholder="Entrez un mot de passe..."
          name="password"
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.input}>
        <p className={styles.labelRole}>Rôle</p>
        <p className={styles.role}>{countUsers > 0 ? "MEMBRE" : "ADMIN"}</p>
      </div>

      <div className={styles.nextPrevButton}>
        <button onClick={sendData}>Créer un compte</button>
        <button
          onClick={() => {
            navigate(ROUTES.LOGIN.route);
          }}
        >
          Vous possédez déjà un compte ?
        </button>
      </div>
    </form>
  );
}
