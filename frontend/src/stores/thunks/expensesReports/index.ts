import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ROUTES } from "@constants/apiroute";
const API_URL = import.meta.env.VITE_API_URL;

import type {
  ExpensesReport,
  UserReport,
} from "@stores/features/expensesReports";

export const fetchExpensesReportsThunk = createAsyncThunk<UserReport[], void>(
  "expensesReports/fetchExpensesReports",
  async () => {
    const res = await fetch(`${API_URL}${API_ROUTES.EXPENSES_REPORTS}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error fetch users");

    const data: UserReport[] = await res.json();
    return data;
  },
);

export const createExpensesReportThunk = createAsyncThunk<
  { createdExpensesReport: ExpensesReport; userId: number },
  { data: ExpensesReport; userId: number }
>("expensesReports/createExpensesReport", async ({ data, userId }) => {
  console.log(data);
  const formData = new FormData();

  formData.append("createdAt", data.createdAt ?? "");
  formData.append("reason", data.reason);
  formData.append("budget", data.budget);
  formData.append("amountWaiver", String(data.amountWaiver));
  formData.append(
    "waiverMileageRateId",
    String(data.waiverMileageRateId ?? null),
  );
  formData.append("kmMileageRateId", String(data.kmMileageRateId ?? null));

  if (data.reportDocumentFile instanceof File) {
    formData.append("reportDocumentFile", data.reportDocumentFile);
  }

  data.expensesList.forEach((list, i) => {
    formData.append(`expensesList[${i}][date]`, list.date);
    formData.append(`expensesList[${i}][object]`, list.object);
    formData.append(`expensesList[${i}][km]`, String(list.km));
    formData.append(
      `expensesList[${i}][transportCost]`,
      String(list.transportCost),
    );
    formData.append(`expensesList[${i}][othersCost]`, String(list.othersCost));

    list.documents.forEach((doc, j) => {
      if (doc.file) {
        formData.append(`expensesList[${i}][documents][${j}]`, doc.file);
      }
    });
  });

  const res = await fetch(`${API_URL}${API_ROUTES.EXPENSES_REPORTS}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) throw new Error("Error create report");

  const createdExpensesReport: ExpensesReport = await res.json();

  return {
    createdExpensesReport,
    userId,
  };
});

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
    const res = await fetch(
      `${API_URL}${API_ROUTES.EXPENSES_REPORTS}/${expensesReportId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error(`Erreur lors de la suppression : ${res.status}`);
    }
    return {
      expensesReportId,
      userId,
    };
  },
);
