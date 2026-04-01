import { useAppDispatch, useAppSelector } from "@modules/shared/hooks/redux";
import { loginThunk } from "@stores/thunks/users";
import type { UserLogin } from "@stores/thunks/users";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@constants/route";

const admin1: UserLogin = {
  email: "admin1@gmail.com",
  password: "admin1",
};

const treasurer1: UserLogin = {
  email: "treasurer1@gmail.com",
  password: "treasurer1",
};

const member1: UserLogin = {
  email: "member1@gmail.com",
  password: "member1",
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.user);
  function handleLogin(user: UserLogin) {
    dispatch(loginThunk(user))
      .unwrap()
      .then(() => {
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
      })
      .catch((err) => {
        console.error("Login failed:", err);
      });
  }
  return (
    <>
      <h1>Login page</h1>
      <button onClick={() => handleLogin(admin1)}>Connexion Admin 1</button>
      <button onClick={() => handleLogin(treasurer1)}>Connexion Trésorier 1</button>
      <button onClick={() => handleLogin(member1)}>Connexion Membre 1</button>
    </>
  );
}
