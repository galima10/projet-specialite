import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { fetchUsersThunk } from "@stores/thunks/users";
import { useEffect } from "react";

export default function HomeHero() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, []);
  return (
    <section>
      <h1>Home</h1>
      <h2>Utilisateurs</h2>
      <ul>
        {users.map((u, index) => {
          return (
            <li key={index}>
              <p>
                {u.id} : {u.name} - {u.email}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
