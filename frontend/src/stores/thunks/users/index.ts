import { createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;
import { API_ROUTES } from "@constants/apiroute";

import type { User } from "@stores/features/users";

export const fetchUsersThunk = createAsyncThunk<User[], void>(
  "users/fetchUsers",
  async () => {
    const res = await fetch(`${API_URL}${API_ROUTES.TEST_USERS}`);
    console.log(`${API_URL}${API_ROUTES.TEST_USERS}`);

    if (!res.ok) {
      throw new Error("Error fetch users");
    }

    const data: User[] = await res.json();
    return data;
  },
);
