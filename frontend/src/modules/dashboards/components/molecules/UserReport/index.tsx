import { ExpensesReport } from "@stores/features/expensesReports";
const API_URL = import.meta.env.VITE_API_URL;
import { Dispatch, SetStateAction } from "react";
import styles from "./UserReport.module.scss";
export default function UserReport({
  report,
  setTab,
}: {
  report: ExpensesReport | null;
  setTab: Dispatch<SetStateAction<"home" | "addReport" | "viewReport">>;
}) {
  return (
    <div className={styles.userReports}>
      <h4>Justificatifs de dépenses</h4>
      <button className="secondary" onClick={() => setTab("home")}>
        Retour
      </button>
      {report?.expensesList.map((expense, indexExp) => {
        let counter = 0;
        return expense.documents.map((document, indexDoc) => {
          counter++;
          return (
            <div className={styles.report} key={`doc-${indexExp}-${indexDoc}`}>
              <div>
                <p>n°{counter}</p>
                <p>Dépense : {expense.object}</p>
              </div>
              <div>
                <button
                  onClick={() => {
                    if (
                      document.pathFile &&
                      "pathFile" in report.reportDocumentFile
                    ) {
                      const fileUrl = `${API_URL}/${document.pathFile}`;
                      window.open(fileUrl, "_blank");
                    }
                  }}
                >
                  Voir le justificatif
                </button>
                {document.pathFile &&
                  "pathFile" in report.reportDocumentFile && (
                    <a
                      href={`${API_URL}/${document.pathFile}`}
                      download={document.name || `Justificatif-${counter}`}
                    >
                      <button>Télécharger le justificatif</button>
                    </a>
                  )}
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}
