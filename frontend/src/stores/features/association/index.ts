import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAssociationContactsThunk,
  createAssociationContactThunk,
  updateAssociationContactThunk,
  deleteMileageRateThunk,
} from "@stores/thunks/association";
import type { WithRequiredId } from "@app-types/WithRequiredId";

export interface Contact {
  id?: number;
  label: string;
  email: string;
}

const initialState = {
  contacts: [] as WithRequiredId<Contact>[],
  loading: false,
  error: null as string | null,
};

export const associationSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchAssociationContactsThunk
    builder
      .addCase(fetchAssociationContactsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAssociationContactsThunk.fulfilled,
        (state, action: PayloadAction<WithRequiredId<Contact>[]>) => {
          state.loading = false;
          if (state.contacts.length === 0) {
            state.contacts = action.payload;
          }
        },
      )
      .addCase(
        fetchAssociationContactsThunk.rejected,
        (
          state,
          action: ReturnType<typeof fetchAssociationContactsThunk.rejected>,
        ) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // createAssociationContactThunk
    builder
      .addCase(createAssociationContactThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createAssociationContactThunk.fulfilled,
        (state, action: PayloadAction<WithRequiredId<Contact>>) => {
          state.loading = false;

          const exists = state.contacts.some(
            (item) => item.id === action.payload.id,
          );
          if (!exists) state.contacts.push(action.payload);
        },
      )
      .addCase(
        createAssociationContactThunk.rejected,
        (
          state,
          action: ReturnType<typeof createAssociationContactThunk.rejected>,
        ) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // updateAssociationContactThunk
    builder
      .addCase(updateAssociationContactThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAssociationContactThunk.fulfilled,
        (state, action: PayloadAction<WithRequiredId<Contact>>) => {
          state.loading = false;

          const unitId = action.payload.id;
          const index = state.contacts.findIndex((item) => item.id === unitId);

          if (index !== -1) {
            state.contacts[index] = action.payload;
          }
        },
      )
      .addCase(
        updateAssociationContactThunk.rejected,
        (
          state,
          action: ReturnType<typeof updateAssociationContactThunk.rejected>,
        ) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // deleteMileageRateThunk
    builder
      .addCase(deleteMileageRateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteMileageRateThunk.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          const exists = state.contacts.some(
            (item) => item.id === action.payload,
          );
          if (exists) {
            state.contacts = state.contacts.filter(
              (item) => item.id !== action.payload,
            );
          }
        },
      )
      .addCase(
        deleteMileageRateThunk.rejected,
        (state, action: ReturnType<typeof deleteMileageRateThunk.rejected>) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );
  },
});

export default associationSlice.reducer;
