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
  return (
    <section>
      <h1>Home</h1>
    </section>
  );
}
