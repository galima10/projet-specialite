import { Users } from "@stores/features/users";
import { Dispatch, SetStateAction } from "react";
import { UserReport } from "@stores/features/expensesReports";
const API_URL = import.meta.env.VITE_API_URL;
import { useAppDispatch } from "@modules/shared/hooks/redux";
import { deleteUserThunk } from "@stores/thunks/users";
import { logoutThunk } from "@stores/thunks/users";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/route";
import { ExpensesReport } from "@stores/features/expensesReports";
import { deleteExepensesReportThunk } from "@stores/thunks/expensesReports";
import styles from "./UserProfile.module.scss";
import { roles } from "../UserForm";

export default function UserProfile({
  user,
  setTab,
  expensesReports,
  setFormType,
  currentUser,
  setSelectedReport,
}: {
  user: Users;
  currentUser: Users;
  setTab: Dispatch<
    SetStateAction<
      | "home"
      | "viewProfile"
      | "addReport"
      | "setUser"
      | "viewReport"
      | "association"
    >
  >;
  expensesReports: UserReport[];
  setFormType: Dispatch<
    SetStateAction<{ type: "create" | "update"; userId?: number }>
  >;
  setSelectedReport: Dispatch<SetStateAction<ExpensesReport>>;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userReports = expensesReports.find(
    (report) => report.userId === user.id,
  );

  async function deleteAccount(userId: number) {
    await dispatch(deleteUserThunk(userId)).unwrap();
  }

  return (
    <div className={styles.userProfile}>
      <button className="secondary" onClick={() => setTab("home")}>
        Retour
      </button>
      {((currentUser && currentUser.id === user.id) ||
        currentUser.role === "ROLE_ADMIN") && (
        <div className={styles.buttons}>
          <button
            className="tertiary"
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
          {currentUser.id !== user.id && (
            <button className="tertiary" onClick={() => deleteAccount(user.id)}>
              Supprimer le compte
            </button>
          )}
        </div>
      )}
      <div className={styles.infos}>
        <p>Nom d'utilisateur : {user.name}</p>
        <p>Adresse mail : {user.email}</p>
        <p>
          Rôle : {roles.find((r) => r.value === user.role).name.toLowerCase()}
        </p>
      </div>
      {user.role === "ROLE_MEMBER" && (
        <>
          <button className="primary" onClick={() => setTab("addReport")}>
            Ajouter une note de frais à cet utilisateur
          </button>
          <div className={styles.reports}>
            <h3>Liste des notes de frais</h3>
            <ul>
              {userReports?.reports
                ?.slice()
                .reverse()
                .map((report, index) => {
                  return (
                    <li key={`report-${index}`}>
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
                                userId: user.id,
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
        </>
      )}
    </div>
  );
}
