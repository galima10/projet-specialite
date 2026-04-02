import type {
  ExpensesReport,
  ExpensesDocument,
  ExpensesListItem,
  ReportFile,
  UserReport,
} from "@stores/features/expensesReports";
import type {
  InfosRequestsRaw,
  DocumentRaw,
  ListItemRaw,
  ReportFileRaw,
} from "@services/expensesReports/index";
import type { WithRequiredId } from "@app-types/WithRequiredId";

interface ReportWithUserId extends ExpensesReport {
  userId: number;
}

export function formatExpensesReports(
  rawRequests: InfosRequestsRaw[],
  rawDocuments: DocumentRaw[],
  rawListItems: ListItemRaw[],
  rawReportFiles: ReportFileRaw[],
): UserReport[] {
  const reports: WithRequiredId<ReportWithUserId>[] = rawRequests.map(
    (request) => {
      const reportFile: ReportFile | null =
        rawReportFiles.find((rf) => rf.infosRequestId === request.id) || null;

      const report: WithRequiredId<ReportWithUserId> = {
        id: request.id,
        userId: request.userId,
        createdAt: request.createdAt,
        reason: request.reason,
        budget: request.budget,
        amountWaiver: parseFloat(request.amountWaiver) ?? 0,
        waiverMileageRateId: request.waiverMileageRateId ?? null,
        kmMileageRateId: request.kmMileageRateId ?? null,
        reportDocumentFile: reportFile,
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

  const userReports = reports.reduce(
    (acc, item) => {
      const key = item.userId;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<number, WithRequiredId<ReportWithUserId>[]>,
  );

  const treated: UserReport[] = Object.entries(userReports).map(
    ([userId, reports]) => ({
      userId: Number(userId),
      reports, // tous les reports de cet utilisateur
    }),
  );

  return treated;
}
