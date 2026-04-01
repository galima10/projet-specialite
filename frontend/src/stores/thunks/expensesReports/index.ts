import { createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;
import { API_ROUTES } from "@constants/apiroute";
import type { WithRequiredId } from "@app-types/WithRequiredId";
import { formatExpensesReports } from "@utils/formatExpensesReports";
import {
  CreateExpensesReportService,
  FetchExpensesReportsService,
  DeleteExpensesReportService,
} from "@services/expensesReports";

import type {
  ExpensesReport,
  ExpensesListItem,
  ExpensesDocument,
  UserReport,
} from "@stores/features/expensesReports";

export const fetchExpensesReportsThunk = createAsyncThunk<UserReport[], void>(
  "expensesReports/fetchExpensesReports",
  async () => {
    const { documents, reportsFiles, requests, listsItems } =
      await FetchExpensesReportsService();
    return formatExpensesReports(requests, documents, listsItems, reportsFiles);
  },
);

export const createExpensesReportThunk = createAsyncThunk<
  { createdExpensesReport: ExpensesReport; userId: number },
  { data: ExpensesReport; userId: number }
>(
  "expensesReports/createExpensesReport",
  async ({ data, userId }: { data: ExpensesReport; userId: number }) => {
    const createdExpensesReport = await CreateExpensesReportService(
      data,
      userId,
    );
    return {
      createdExpensesReport,
      userId,
    };
  },
);

export const deleteExepensesReportThunk = createAsyncThunk<
  {
    expensesReportId: number;
    userId: number;
  },
  {
    expensesReportId: number;
    userId: number;
  }
>(
  "expensesReports/deleteExepensesReport",
  async ({
    expensesReportId,
    userId,
  }: {
    expensesReportId: number;
    userId: number;
  }) => {
    await DeleteExpensesReportService(expensesReportId);
    return {
      expensesReportId,
      userId,
    };
  },
);
