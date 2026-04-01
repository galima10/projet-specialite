import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ExpensesReport {
  id?: number;
  createdAt: string;
  reason: string;
  waiverMileageRateId: number;
  kmMileageRateId: number;
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
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchUsersThunk.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(
  //       fetchUsersThunk.fulfilled,
  //       (state, action: PayloadAction<Users[]>) => {
  //         state.loading = false;
  //         if (state.users.length === 0) {
  //           state.users = action.payload;
  //         }
  //       },
  //     )
  //     .addCase(fetchUsersThunk.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.error.message ?? "Unknown error";
  //     });
  // },
});

export default expensesReportSlice.reducer;
