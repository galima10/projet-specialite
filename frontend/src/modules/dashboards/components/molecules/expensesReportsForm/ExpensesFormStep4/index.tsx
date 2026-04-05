import { useExpensesFormStep4 } from "@modules/dashboards/hooks/expensesForm/useExpensesFormStep4";
import type { FormData } from "@app-types/FormData";
import styles from "@modules/dashboards/components/organisms/ExpensesReportsForm/ExpensesReportForm.module.scss";
import { Dispatch, SetStateAction } from "react";

interface ExpensesFormStep4Props {
  setTab: Dispatch<SetStateAction<FormData>>;
  setStep: Dispatch<SetStateAction<number>>;
  setFormData: Dispatch<SetStateAction<"home" | "addReport">>;
}

export default function ExpensesFormStep4({ setTab, setStep, setFormData }) {
  const { contact, handleSendPdf } = useExpensesFormStep4();
  return (
    <div>
      <p>
        Envoyer directement la note de frais à l'association à l'adresse mail
        suivante : {contact.label} - {contact.email}
      </p>
      <div className={styles.nextPrevButton}>
        <button className="secondary" type="button" onClick={handleSendPdf}>
          Envoyer
        </button>
        <button
          className="primary"
          onClick={() => {
            setTab("home");
            setStep(1);
            setFormData({
              userName: "",
              createdAt: new Date().toISOString(),
              reason: "",
              budget: "",
              amountWaiver: 0,
              waiverMileageRate: null,
              kmMileageRate: null,
              reportDocumentFile: null,
              expensesList: [],
              userIBAN: "",
              userBIC: "",
              signature: "",
            });
          }}
        >
          Revenir au tableau de bord
        </button>
      </div>
    </div>
  );
}
