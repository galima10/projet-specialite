import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsersThunk } from "@stores/thunks/users";

export interface Users {
  id: number;
  name: string;
  email: string;
  role: string
}

const initialState = {
  users: [] as Users[],
  loading: false,
  error: null as string | null,
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsersThunk.fulfilled,
        (state, action: PayloadAction<Users[]>) => {
          state.loading = false;
          if (state.users.length === 0) {
            state.users = action.payload;
          }
        },
      )
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export default userSlice.reducer;