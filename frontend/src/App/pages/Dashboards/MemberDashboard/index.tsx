import ExpensesReportsForm from "@modules/dashboards/components/molecules/ExpensesReportsForm";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import {
  fetchExpensesReportsThunk,
  deleteExepensesReportThunk,
} from "@stores/thunks/expensesReports";
const API_URL = import.meta.env.VITE_API_URL;
import UserReport from "@modules/dashboards/components/molecules/UserReport";
import { ExpensesReport } from "@stores/features/expensesReports";
import styles from "./MemberDashboard.module.scss";

export default function MemberDashboard() {
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
    <div className={styles.dashboard}>
      {tab === "home" ? (
        <div className={styles.home}>
          <h1>Votre tableau de bord</h1>
          <button className="primary" onClick={() => setTab("addReport")}>
            Ajouter une note de frais
          </button>
          <ul className={styles.reports}>
            {userReports?.reports
              ?.slice()
              .reverse()
              .map((report, index) => {
                return (
                  <li key={`report-${index}`} className={styles.report}>
                    <p>
                      n°{index + 1} - {report.createdAt.split("T")[0]} -{" "}
                      {report.reason}
                    </p>
                    <div>
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
                    </div>
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
