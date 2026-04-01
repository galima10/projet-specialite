import { createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;
import { API_ROUTES } from "@constants/apiroute";
import type { WithRequiredId } from "@app-types/WithRequiredId";

import type { Users } from "@stores/features/users";

interface UserLogin {
  email: string;
  password: string;
}

interface UserRegister {
  name: string;
  email: string;
  password: string;
}

export const fetchUsersThunk = createAsyncThunk<WithRequiredId<Users>[], void>(
  "users/fetchUsers",
  async () => {
    const res = await fetch(`${API_URL}${API_ROUTES.USERS}`);

    if (!res.ok) throw new Error("Error fetch users");

    const data: WithRequiredId<Users>[] = await res.json();
    return data;
  },
);

export const createUserThunk = createAsyncThunk<
  WithRequiredId<Users>,
  { newUser: Users; newPassword: string }
>(
  "users/createUser",
  async ({ newUser, newPassword }: { newUser: Users; newPassword: string }) => {
    const res = await fetch(`${API_URL}${API_ROUTES.USERS}`, {
      method: "POST",
      body: JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        password: newPassword,
      }),
    });
    if (!res.ok) throw new Error("Error create user");
    const data: WithRequiredId<Users> = await res.json();
    return data;
  },
);

export const updateUserThunk = createAsyncThunk<
  WithRequiredId<Users>,
  { newUser: Users; newPassword: string }
>(
  "users/updateUser",
  async ({ newUser, newPassword }: { newUser: Users; newPassword: string }) => {
    const res = await fetch(`${API_URL}${API_ROUTES.USERS}/${newUser.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        password: newPassword,
      }),
    });
    if (!res.ok) throw new Error("Error update user");
    const data: WithRequiredId<Users> = await res.json();
    return data;
  },
);

export const deleteUserThunk = createAsyncThunk<number, number>(
  "users/deleteUser",
  async (userId: number) => {
    const res = await fetch(`${API_URL}${API_ROUTES.USERS}/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Erreur lors de la suppression : ${res.status}`);
    }
    return userId;
  },
);

export const fetchCurrentUserThunk = createAsyncThunk<
  WithRequiredId<Users>,
  void
>("users/fetchCurrentUser", async () => {
  const res = await fetch(`${API_URL}${API_ROUTES.CURRENTUSER}`);

  if (!res.ok) throw new Error("Error fetch current user");

  const data: WithRequiredId<Users> = await res.json();
  return data;
});

export const loginThunk = createAsyncThunk<void, UserLogin>(
  "users/login",
  async (user: UserLogin) => {
    const res = await fetch(`${API_URL}${API_ROUTES.LOGIN}`, {
      method: "POST",
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    });
    if (!res.ok) throw new Error("Error login user");
  },
);

export const logoutThunk = createAsyncThunk<boolean | null, void>(
  "users/logout",
  async () => {
    const res = await fetch(`${API_URL}${API_ROUTES.LOGOUT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Erreur lors de la suppression : ${res.status}`);
    }
    return true;
  },
);

export const registerThunk = createAsyncThunk<void, UserRegister>(
  "users/register",
  async (user: UserRegister) => {
    const res = await fetch(`${API_URL}${API_ROUTES.REGISTER}`, {
      method: "POST",
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password: user.password,
      }),
    });
    if (!res.ok) throw new Error("Error register user");
  },
);
