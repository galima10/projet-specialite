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
} from "@stores/thunks/expensesReports";
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
        waiverMileageRateId: request.waiverMileageRateId ?? null,
        kmMileageRateId: request.kmMileageRateId ?? null,
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

  const userReports = reports.reduce(
    (acc, item) => {
      const key = item.userId;
      if (!acc[key]) {
        acc[key] = {
          id: item.id,
          createdAt: item.createdAt,
          reason: item.reason,
          waiverMileageRateId: item.waiverMileageRateId,
          kmMileageRateId: item.kmMileageRateId,
          reportDocumentPath: item.reportDocumentPath,
          expensesList: item.expensesList,
        };
      }
      return acc;
    },
    {} as Record<number, any>,
  );
  const treated: UserReport[] = Object.entries(userReports).map(
    ([userId, ur]) => ({
      userId: Number(userId),
      reports: Array.isArray(ur) ? ur : [ur],
    }),
  );

  return treated;
}
