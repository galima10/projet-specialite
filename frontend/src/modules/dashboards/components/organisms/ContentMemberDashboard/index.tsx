import ExpensesReportsForm from "../../molecules/ExpensesReportsForm";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { fetchExpensesReportsThunk } from "@stores/thunks/expensesReports";
const API_URL = import.meta.env.VITE_API_URL;

export default function ContentMemberDashboard() {
  const [tab, setTab] = useState<"home" | "addReport">("home");
  const dispatch = useAppDispatch();
  const { expensesReports } = useAppSelector((state) => state.expensesReport);
  const { currentUser } = useAppSelector((state) => state.user);
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
      ) : (
        <ExpensesReportsForm setTab={setTab} />
      )}
    </div>
  );
}
