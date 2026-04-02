import ExpensesReportsForm from "../../molecules/ExpensesReportsForm";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import {
  fetchExpensesReportsThunk,
  deleteExepensesReportThunk,
} from "@stores/thunks/expensesReports";
const API_URL = import.meta.env.VITE_API_URL;
import UserReport from "../../molecules/UserReport";
import { ExpensesReport } from "@stores/features/expensesReports";

export default function ContentMemberDashboard() {
  const [tab, setTab] = useState<"home" | "addReport" | "viewReport">("home");
  const dispatch = useAppDispatch();
  const { expensesReports } = useAppSelector((state) => state.expensesReport);
  const { currentUser } = useAppSelector((state) => state.user);
  const [selectedReport, setSelectedReport] = useState<ExpensesReport | null>(
    null,
  );
  useEffect(() => {
    if (!expensesReports || expensesReports.length === 0) {
      dispatch(fetchExpensesReportsThunk());
    }
  }, []);
  const userReports = expensesReports.find(
    (report) => report.userId === currentUser.id,
  );
  return (
    <div>
      {tab === "home" ? (
        <div>
          <button onClick={() => setTab("addReport")}>
            Ajouter une note de frais
          </button>
          <ul>
            {userReports?.reports
              ?.slice()
              .reverse()
              .map((report, index) => {
                return (
                  <li key={`report-${index}`}>
                    <p>
                      n°{index + 1} - {report.createdAt.split("T")[0]}
                    </p>
                    <p>
                      {report.reportDocumentFile &&
                      "pathFile" in report.reportDocumentFile
                        ? report.reportDocumentFile.pathFile
                        : "Pas de fichier"}
                    </p>
                    <button
                      onClick={() => {
                        setTab("viewReport");
                        setSelectedReport(report);
                      }}
                    >
                      Voir les détails
                    </button>
                    <button
                      onClick={() => {
                        dispatch(
                          deleteExepensesReportThunk({
                            expensesReportId: report.id,
                            userId: currentUser.id,
                          }),
                        );
                      }}
                    >
                      Supprimer
                    </button>
                    {report.reportDocumentFile &&
                      "pathFile" in report.reportDocumentFile && (
                        <button
                          onClick={() => {
                            if (
                              report.reportDocumentFile &&
                              "pathFile" in report.reportDocumentFile
                            ) {
                              const fileUrl = `${API_URL}/${report.reportDocumentFile.pathFile}`;
                              window.open(fileUrl, "_blank");
                            }
                          }}
                        >
                          Voir le pdf
                        </button>
                      )}
                  </li>
                );
              }) || <li>Aucune note de frais</li>}
          </ul>
        </div>
      ) : tab === "addReport" ? (
        <ExpensesReportsForm setTab={setTab} />
      ) : (
        tab === "viewReport" && (
          <UserReport report={selectedReport} setTab={setTab} />
        )
      )}
    </div>
  );
}
