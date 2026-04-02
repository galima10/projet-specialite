import { Users } from "@stores/features/users";
import { Dispatch, SetStateAction } from "react";
import { UserReport } from "@stores/features/expensesReports";
const API_URL = import.meta.env.VITE_API_URL;

export default function UserProfile({
  user,
  setTab,
  expensesReports,
}: {
  user: Users;
  setTab: Dispatch<SetStateAction<"home" | "viewProfile" | "addReport">>;
  expensesReports: UserReport[];
}) {
  const userReports = expensesReports.find(
    (report) => report.userId === user.id,
  );

  return (
    <div>
      <button onClick={() => setTab("home")}>Retour</button>
      <p>{user.name}</p>
      {user.role === "ROLE_MEMBER" && (
        <button onClick={() => setTab("addReport")}>
          Ajouter une note de frais à cet utilisateur
        </button>
      )}
      <h3>Liste des notes de frais</h3>
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
  );
}
