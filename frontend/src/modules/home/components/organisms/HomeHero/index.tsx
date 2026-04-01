import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { fetchUsersThunk, fetchCurrentUserThunk } from "@stores/thunks/users";
import { useEffect } from "react";
import type { UserLogin } from "@stores/thunks/users";
import { loginThunk } from "@stores/thunks/users";

const member1: UserLogin = {
  email: "member1@gmail.com",
  password: "member1",
};

export default function HomeHero() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  // useEffect(() => {
  //   dispatch(loginThunk(member1));
  //   // dispatch(fetchUsersThunk());
  //   dispatch(fetchCurrentUserThunk());
  //   // console.log("test", users);
  // }, []);
  function handleConnect() {
    dispatch(loginThunk(member1));
    dispatch(fetchCurrentUserThunk());
    // console.log("test", currentUser);
  }
  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, [dispatch]);

  useEffect(() => {
    console.log("test", currentUser);
  }, [currentUser]);
  return (
    <section>
      <h1>Home</h1>
      <h2>Utilisateurs</h2>
      <button onClick={handleConnect}>Connecter</button>
      <p>{currentUser.name}</p>
      {/* <ul>
        {users.map((u, index) => {
          return (
            <li key={index}>
              <p>
                {u.id} : {u.name} - {u.email}
              </p>
            </li>
          );
        })}
      </ul> */}
    </section>
  );
}
