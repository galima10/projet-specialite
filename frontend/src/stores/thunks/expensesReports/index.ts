import { createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;
import { API_ROUTES } from "@constants/apiroute";
import type { WithRequiredId } from "@app-types/WithRequiredId";
import { formatExpensesReports } from "@utils/formatExpensesReports";

import type {
  ExpensesReport,
  ExpensesListItem,
  ExpensesDocument,
  UserReport,
} from "@stores/features/expensesReports";

export interface InfosRequestsRaw {
  id: number;
  createdAt: string;
  reason: string;
  budget:
    | "ADMINISTRATIVE"
    | "LIBRARY"
    | "EXPEDITION_EQUIPEMENT"
    | "OTHER_EQUIPEMENT"
    | "WEEKENDS_OUTINGS";
  amountWaiver: string;
  userId: number;
  waiverMileageRateId: number | null;
  kmMileageRateId: number | null;
}

export interface ListItemRaw {
  id: number;
  date: string;
  object: string;
  km: string;
  transportCost: string;
  othersCost: string;
  infosRequestId: number;
}

export interface DocumentRaw {
  id: number;
  name: string;
  pathFile: string;
  expensesListId: number;
}

export interface ReportFileRaw {
  id: number;
  name: string;
  pathFile: string;
  infosRequestId: number;
}

export const fetchUsersThunk = createAsyncThunk<UserReport[], void>(
  "users/fetchUsers",
  async () => {
    const resDocuments = await fetch(
      `${API_URL}${API_ROUTES.EXPENSES_DOCUMENTS}`,
    );
    const resListItems = await fetch(`${API_URL}${API_ROUTES.EXPENSES_LISTS}`);
    const resRequests = await fetch(`${API_URL}${API_ROUTES.INFOS_REQUESTS}`);
    const resReportsFiles = await fetch(
      `${API_URL}${API_ROUTES.EXPENSES_REPORTS}`,
    );
    if (
      !resDocuments.ok ||
      !resListItems.ok ||
      !resRequests.ok ||
      !resReportsFiles.ok
    )
      throw new Error(
        "Error fetch expenses documents, lists, files and requests",
      );

    const documents: DocumentRaw[] = await resDocuments.json();
    const listsItems: ListItemRaw[] = await resListItems.json();
    const requests: InfosRequestsRaw[] = await resRequests.json();
    const reportsFiles: ReportFileRaw[] = await resReportsFiles.json();

    return formatExpensesReports(requests, documents, listsItems, reportsFiles);
  },
);
