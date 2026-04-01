import { useAppDispatch, useAppSelector } from "@modules/shared/hooks/redux";
import { loginThunk } from "@stores/thunks/users";
import type { UserLogin } from "@stores/thunks/users";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@constants/route";

const admin1: UserLogin = {
  email: "admin1@gmail.com",
  password: "admin1",
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.user);
  function handleLogin() {
    dispatch(loginThunk(admin1))
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
      <button onClick={handleLogin}>Connexion</button>
    </>
  );
}
