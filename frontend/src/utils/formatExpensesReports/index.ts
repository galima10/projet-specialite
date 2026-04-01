import type {
  ExpensesReport,
  ExpensesDocument,
  ExpensesListItem,
  ReportFile,
} from "@stores/features/expensesReports";
import type {
  InfosRequestsRaw,
  DocumentRaw,
  ListItemRaw,
  ReportFileRaw,
} from "@stores/thunks/expensesReports";
import type { WithRequiredId } from "@app-types/WithRequiredId";

export function formatExpensesReports(
  rawRequests: InfosRequestsRaw[],
  rawDocuments: DocumentRaw[],
  rawListItems: ListItemRaw[],
  rawReportFiles: ReportFileRaw[],
): WithRequiredId<ExpensesReport>[] {
  const treated: WithRequiredId<ExpensesReport>[] = rawRequests.map(
    (request) => {
      const reportFile: ReportFile | null =
        rawReportFiles.find((rf) => rf.infosRequestId === request.id) || null;

      const report: WithRequiredId<ExpensesReport> = {
        id: request.id,
        userId: request.userId,
        createdAt: request.createdAt,
        reason: request.reason,
        waiverMileageRateId: request.waiverMileageRateId ?? 0, // si tu veux un default
        kmMileageRateId: request.kmMileageRateId ?? 0,
        reportDocumentPath: reportFile,
        expensesList: [],
      };

      const expensesListItems: WithRequiredId<ExpensesListItem>[] = rawListItems
        .filter((li) => li.infosRequestId === request.id)
        .map((eli) => {
          const documents: ExpensesDocument[] = rawDocuments
            .filter((d) => d.expensesListId === eli.id)
            .map((d) => ({
              id: d.id,
              name: d.name,
              pathFile: d.pathFile,
            }));
          return {
            id: eli.id,
            date: eli.date,
            object: eli.object,
            km: parseFloat(eli.km),
            transportCost: parseFloat(eli.transportCost),
            othersCost: parseFloat(eli.othersCost),
            documents,
          };
        });

      report.expensesList.push(...expensesListItems);
      return report;
    },
  );
  return treated;
}
