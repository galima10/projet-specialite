import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMileageRatesThunk,
  createMileageRateThunk,
  deleteMileageRateThunk,
} from "@stores/thunks/mileages";
import type { WithRequiredId } from "@app-types/WithRequiredId";

export interface MileageRate {
  id?: number;
  label: string;
  amountPerKm: number;
  type: string;
}

const initialState = {
  waiverMileageRates: [] as WithRequiredId<MileageRate>[],
  kmMileageRates: [] as WithRequiredId<MileageRate>[],
  loading: false,
  error: null as string | null,
};

export const mileageSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchMileageRatesThunk
    builder
      .addCase(fetchMileageRatesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMileageRatesThunk.fulfilled,
        (
          state,
          action: PayloadAction<{
            waiverRates: WithRequiredId<MileageRate>[];
            kmRates: WithRequiredId<MileageRate>[];
          }>,
        ) => {
          state.loading = false;
          const { waiverRates, kmRates } = action.payload;
          if (state.waiverMileageRates.length === 0 && waiverRates) {
            state.waiverMileageRates = waiverRates.map((rate) => ({
              ...rate,
              amountPerKm: Number(rate.amountPerKm),
            }));
          }

          if (state.kmMileageRates.length === 0 && kmRates) {
            state.kmMileageRates = kmRates.map((rate) => ({
              ...rate,
              amountPerKm: Number(rate.amountPerKm),
            }));
          }
        },
      )
      .addCase(
        fetchMileageRatesThunk.rejected,
        (state, action: ReturnType<typeof fetchMileageRatesThunk.rejected>) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // createMileageRateThunk
    builder
      .addCase(createMileageRateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createMileageRateThunk.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: WithRequiredId<MileageRate>;
            type: "KM" | "WAIVER";
          }>,
        ) => {
          state.loading = false;
          const { data, type } = action.payload;
          if (type === "KM") {
            const exists = state.kmMileageRates.some(
              (item) => item.id === data.id,
            );
            if (!exists) state.kmMileageRates.push(data);
          } else {
            const exists = state.waiverMileageRates.some(
              (item) => item.id === data.id,
            );
            if (!exists) state.waiverMileageRates.push(data);
          }
        },
      )
      .addCase(
        createMileageRateThunk.rejected,
        (state, action: ReturnType<typeof createMileageRateThunk.rejected>) => {
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
        (
          state,
          action: PayloadAction<{ rateId: number; type: "KM" | "WAIVER" }>,
        ) => {
          state.loading = false;
          const { rateId, type } = action.payload;
          if (type === "KM") {
            const exists = state.kmMileageRates.some(
              (item) => item.id === rateId,
            );
            if (exists) {
              state.kmMileageRates = state.kmMileageRates.filter(
                (item) => item.id !== rateId,
              );
            }
          } else {
            const exists = state.waiverMileageRates.some(
              (item) => item.id === rateId,
            );
            if (exists) {
              state.waiverMileageRates = state.waiverMileageRates.filter(
                (item) => item.id !== rateId,
              );
            }
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

export default mileageSlice.reducer;
