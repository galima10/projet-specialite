import ExpensesReportsForm from "@modules/dashboards/components/organisms/ExpensesReportsForm";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { fetchExpensesReportsThunk } from "@stores/thunks/expensesReports";
import UserReports from "@modules/dashboards/components/molecules/UserReports";
import styles from "./MemberDashboard.module.scss";

export default function MemberDashboard() {
  const [tab, setTab] = useState<"home" | "addReport" | "viewReport">("home");
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
    <div className={styles.dashboard}>
      {tab === "home" ? (
        <div className={styles.home}>
          <h1>Votre tableau de bord</h1>
          <button className="primary" onClick={() => setTab("addReport")}>
            Ajouter une note de frais
          </button>
          <ul className={styles.reports}>
            {userReports ? (
              userReports?.reports
                ?.slice()
                .reverse()
                .map((report, index) => {
                  return (
                    <li key={`report-${index}`} className={styles.report}>
                      <UserReports
                        user={currentUser}
                        report={report}
                        index={index}
                      />
                    </li>
                  );
                })
            ) : (
              <li>Aucune note de frais</li>
            )}
          </ul>
        </div>
      ) : (
        <ExpensesReportsForm setTab={setTab} />
      )}
    </div>
  );
}
