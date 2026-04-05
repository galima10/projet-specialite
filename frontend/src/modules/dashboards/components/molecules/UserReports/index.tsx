import { useAppDispatch } from "@modules/shared/hooks/redux";
import { deleteExepensesReportThunk } from "@stores/thunks/expensesReports";
const API_URL = import.meta.env.VITE_API_URL;
import styles from "./UserReports.module.scss";

export default function UserReports({ report, index, user }) {
  const dispatch = useAppDispatch();
  return (
    <div className={styles.report}>
      <p>
        n°{index + 1} - {report.createdAt.split("T")[0]} - {report.reason}
      </p>
      <div>
        <button
          onClick={() => {
            console.log(report.id);
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
        {report.pathFile && (
          <button
            onClick={() => {
              if (report.pathFile) {
                const fileUrl = `${API_URL}/${report.pathFile}`;
                window.open(fileUrl, "_blank");
              }
            }}
          >
            Voir le pdf
          </button>
        )}
      </div>
    </div>
  );
}
