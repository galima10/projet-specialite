import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUsersThunk,
  createUserThunk,
  deleteUserThunk,
  updateUserThunk,
  fetchCurrentUserThunk,
  logoutThunk,
  loginThunk,
} from "@stores/thunks/users";
import type { WithRequiredId } from "@app-types/WithRequiredId";

export interface Users {
  id?: number;
  name: string;
  email: string;
  role: string;
}

const initialState = {
  users: [] as WithRequiredId<Users>[],
  currentUser: null as WithRequiredId<Users> | null,
  loading: false,
  error: null as string | null,
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchUsersThunk
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsersThunk.fulfilled,
        (state, action: PayloadAction<WithRequiredId<Users>[]>) => {
          state.loading = false;
          if (state.users.length === 0) {
            state.users = action.payload;
          }
        },
      )
      .addCase(
        fetchUsersThunk.rejected,
        (state, action: ReturnType<typeof fetchUsersThunk.rejected>) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // fetchCurrentUserThunk
    builder
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCurrentUserThunk.fulfilled,
        (state, action: PayloadAction<WithRequiredId<Users>>) => {
          state.loading = false;
          state.currentUser = action.payload;
        },
      )
      .addCase(
        fetchCurrentUserThunk.rejected,
        (state, action: ReturnType<typeof fetchCurrentUserThunk.rejected>) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // loginThunk
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginThunk.fulfilled,
        (state, action: PayloadAction<WithRequiredId<Users>>) => {
          state.loading = false;
          if (action.payload) {
            state.currentUser = action.payload;
          }
        },
      )
      .addCase(
        loginThunk.rejected,
        (state, action: ReturnType<typeof loginThunk.rejected>) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // logoutThunk
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        logoutThunk.fulfilled,
        (state, action: PayloadAction<boolean | null>) => {
          state.loading = false;
          if (action.payload) {
            state.currentUser = null;
          }
        },
      )
      .addCase(
        logoutThunk.rejected,
        (state, action: ReturnType<typeof logoutThunk.rejected>) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // createUserThunk
    builder
      .addCase(createUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createUserThunk.fulfilled,
        (state, action: PayloadAction<WithRequiredId<Users>>) => {
          state.loading = false;

          const exists = state.users.some(
            (item) => item.id === action.payload.id,
          );
          if (!exists) state.users.push(action.payload);
        },
      )
      .addCase(
        createUserThunk.rejected,
        (state, action: ReturnType<typeof createUserThunk.rejected>) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // updateUserThunk
    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateUserThunk.fulfilled,
        (state, action: PayloadAction<WithRequiredId<Users>>) => {
          state.loading = false;

          const userId = action.payload.id;
          const index = state.users.findIndex((item) => item.id === userId);

          if (index !== -1) {
            state.users[index] = action.payload;
          }
        },
      )
      .addCase(
        updateUserThunk.rejected,
        (state, action: ReturnType<typeof updateUserThunk.rejected>) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // deleteUserThunk
    builder
      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteUserThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          const exists = state.users.some((item) => item.id === action.payload);
          if (exists) {
            state.users = state.users.filter(
              (item) => item.id !== action.payload,
            );
          }
        },
      )
      .addCase(
        deleteUserThunk.rejected,
        (state, action: ReturnType<typeof deleteUserThunk.rejected>) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );
  },
});

export default userSlice.reducer;
