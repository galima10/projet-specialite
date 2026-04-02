import { Users } from "@stores/features/users";
import { Dispatch, SetStateAction } from "react";
import { UserReport } from "@stores/features/expensesReports";
const API_URL = import.meta.env.VITE_API_URL;
import { useAppDispatch } from "@modules/shared/hooks/redux";
import { deleteUserThunk } from "@stores/thunks/users";

export default function UserProfile({
  user,
  setTab,
  expensesReports,
  setFormType,
}: {
  user: Users;
  setTab: Dispatch<
    SetStateAction<"home" | "viewProfile" | "addReport" | "setUser">
  >;
  expensesReports: UserReport[];
  setFormType: Dispatch<
    SetStateAction<{ type: "create" | "update"; userId?: number }>
  >;
}) {
  const dispatch = useAppDispatch();
  const userReports = expensesReports.find(
    (report) => report.userId === user.id,
  );

  return (
    <div>
      <button onClick={() => setTab("home")}>Retour</button>
      <button
        onClick={() => {
          setFormType({
            type: "update",
            userId: user.id,
          });
          setTab("setUser");
        }}
      >
        Modifier le compte
      </button>
      <button onClick={() => dispatch(deleteUserThunk(user.id))}>
        Supprimer le compte
      </button>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>{user.role}</p>
      {user.role === "ROLE_MEMBER" && (
        <>
          <button onClick={() => setTab("addReport")}>
            Ajouter une note de frais à cet utilisateur
          </button>
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
        </>
      )}
    </div>
  );
}
