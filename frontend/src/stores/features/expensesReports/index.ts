import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchExpensesReportsThunk,
  createExpensesReportThunk,
  deleteExepensesReportThunk,
} from "@stores/thunks/expensesReports";

export interface ExpensesReport {
  id?: number;
  createdAt?: string;
  reason: string;
  budget: string;
  amountWaiver: number;
  waiverMileageRateId: number | null;
  kmMileageRateId: number | null;
  reportDocumentPath: ReportFile | null;
  expensesList: ExpensesListItem[];
}

export interface UserReport {
  userId: number;
  reports: ExpensesReport[];
}

export interface ReportFile {
  id?: number;
  name: string;
  pathFile: string;
}

export interface ExpensesListItem {
  id?: number;
  date: string;
  object: string;
  km: number;
  transportCost: number;
  othersCost: number;
  documents: ExpensesDocument[];
}

export interface ExpensesDocument {
  id?: number;
  name: string;
  pathFile: string;
}

const initialState = {
  expensesReports: [] as UserReport[],
  loading: false,
  error: null as string | null,
};

export const expensesReportSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchExpensesReportsThunk
    builder
      .addCase(fetchExpensesReportsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExpensesReportsThunk.fulfilled,
        (state, action: PayloadAction<UserReport[]>) => {
          state.loading = false;
          if (state.expensesReports.length === 0) {
            state.expensesReports = action.payload;
          }
        },
      )
      .addCase(
        fetchExpensesReportsThunk.rejected,
        (
          state,
          action: ReturnType<typeof fetchExpensesReportsThunk.rejected>,
        ) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // createExpensesReportThunk
    builder
      .addCase(createExpensesReportThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createExpensesReportThunk.fulfilled,
        (
          state,
          action: PayloadAction<{
            createdExpensesReport: ExpensesReport;
            userId: number;
          }>,
        ) => {
          state.loading = false;
          const { createdExpensesReport, userId } = action.payload;
          const index = state.expensesReports.findIndex(
            (item) => item.userId === userId,
          );
          if (index === -1) {
            state.expensesReports.push({
              userId: userId,
              reports: [],
            });
          }
          state.expensesReports[index].reports.push(createdExpensesReport);
        },
      )
      .addCase(
        createExpensesReportThunk.rejected,
        (
          state,
          action: ReturnType<typeof createExpensesReportThunk.rejected>,
        ) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );

    // deleteExepensesReportThunk
    builder
      .addCase(deleteExepensesReportThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteExepensesReportThunk.fulfilled,
        (
          state,
          action: PayloadAction<{
            expensesReportId: number;
            userId: number;
          }>,
        ) => {
          state.loading = false;
          const { expensesReportId, userId } = action.payload;
          const index = state.expensesReports.findIndex(
            (item) => item.userId === userId,
          );
          if (index !== -1) {
            state.expensesReports[index].reports = state.expensesReports[
              index
            ].reports.filter((item) => item.id !== expensesReportId);
          }
        },
      )
      .addCase(
        deleteExepensesReportThunk.rejected,
        (
          state,
          action: ReturnType<typeof deleteExepensesReportThunk.rejected>,
        ) => {
          state.loading = false;
          state.error = action.error.message ?? "Erreur inconnue";
        },
      );
  },
});

export default expensesReportSlice.reducer;
