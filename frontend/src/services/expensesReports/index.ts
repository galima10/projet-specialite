import { ExpensesReport } from "@stores/features/expensesReports";
import { API_ROUTES } from "@constants/apiroute";
const API_URL = import.meta.env.VITE_API_URL;

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

export async function FetchExpensesReportsService() {
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

  return { documents, listsItems, reportsFiles, requests };
}

export async function CreateExpensesReportService(
  data: ExpensesReport,
  userId: number,
): Promise<ExpensesReport> {
  const resInfosRequest = await fetch(
    `${API_URL}${API_ROUTES.INFOS_REQUESTS}`,
    {
      method: "POST",
      body: JSON.stringify({
        reason: data.reason,
        budget: data.budget,
        amountWaiver: data.amountWaiver,
        waiverMileageRateId: data.waiverMileageRateId,
        kmMileageRateId: data.kmMileageRateId,
        userId,
      }),
    },
  );
  const infosRequestJson = await resInfosRequest.json();

  const resReportsFiles = await fetch(
    `${API_URL}${API_ROUTES.EXPENSES_REPORTS}`,
    {
      method: "POST",
      body: JSON.stringify({
        name: data.reportDocumentPath?.name,
        pathFile: data.reportDocumentPath?.pathFile,
        infosRequestId: infosRequestJson.id,
      }),
    },
  );
  const reportsFileJson = await resReportsFiles.json();

  const listPromises = data.expensesList.map(async (list) => {
    const resList = await fetch(`${API_URL}${API_ROUTES.EXPENSES_LISTS}`, {
      method: "POST",
      body: JSON.stringify({
        date: String(list.date),
        object: list.object,
        km: list.km != null ? String(list.km) : null,
        transportCost:
          list.transportCost != null ? String(list.transportCost) : null,
        othersCost: list.othersCost != null ? String(list.othersCost) : null,
        infosRequestId: infosRequestJson.id,
      }),
    });
    const listJson = await resList.json();

    const documentsPromises = list.documents.map(async (document) => {
      const resDoc = await fetch(`${API_URL}${API_ROUTES.EXPENSES_DOCUMENTS}`, {
        method: "POST",
        body: JSON.stringify({
          name: document.name,
          pathFile: document.pathFile,
          expensesListId: listJson.id,
        }),
      });
      return (await resDoc.json()) as ExpensesReport["expensesList"][0]["documents"][0];
    });
    const documentsJson = await Promise.all(documentsPromises);

    return {
      id: listJson.id,
      date: listJson.date,
      object: listJson.object,
      km: parseFloat(listJson.km),
      transportCost: parseFloat(listJson.transportCost),
      othersCost: parseFloat(listJson.othersCost),
      documents: documentsJson.map((d) => ({
        id: d.id,
        name: d.name,
        pathFile: d.pathFile,
      })),
    };
  });
  const expensesListWithDocs = await Promise.all(listPromises);

  const expenseReport: ExpensesReport = {
    id: infosRequestJson.id,
    createdAt: infosRequestJson.createdAt,
    reason: infosRequestJson.reason,
    budget: infosRequestJson.budget,
    amountWaiver: parseFloat(infosRequestJson.amountWaiver),
    waiverMileageRateId: infosRequestJson.waiverMileageRateId ?? 0,
    kmMileageRateId: infosRequestJson.kmMileageRateId ?? 0,
    reportDocumentPath: reportsFileJson
      ? {
          id: reportsFileJson.id,
          name: reportsFileJson.name,
          pathFile: reportsFileJson.pathFile,
        }
      : null,
    expensesList: expensesListWithDocs,
  };

  return expenseReport;
}

export async function DeleteExpensesReportService(expensesReportId: number) {
  const res = await fetch(
    `${API_URL}${API_ROUTES.INFOS_REQUESTS}/${expensesReportId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!res.ok) {
    throw new Error(`Erreur lors de la suppression : ${res.status}`);
  }
}
