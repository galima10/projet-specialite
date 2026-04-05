import type { FormData } from "@app-types/FormData";
import styles from "@modules/dashboards/components/organisms/ExpensesReportsForm/ExpensesReportForm.module.scss";
import { Dispatch, SetStateAction } from "react";

interface ExpensesFormStep2Props {
  setHasKm: Dispatch<SetStateAction<boolean>>;
  setHasTransport: Dispatch<SetStateAction<boolean>>;
  setHasOther: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<number>>;
  removeExpense: (indexToRemove: number) => void;
  formData: FormData;
}

export default function ExpensesFormStep2({
  setHasKm,
  setHasTransport,
  setHasOther,
  setStep,
  formData,
  removeExpense,
}: ExpensesFormStep2Props) {
  return (
    <div>
      <button
        className={`primary ${styles.addExpense}`}
        onClick={() => {
          setHasKm(false);
          setHasTransport(false);
          setHasOther(false);
          setStep(2.5);
        }}
      >
        Ajouter une dépense
      </button>
      <ul className={styles.expenses}>
        {formData.expensesList.map((item, indexItem) => {
          return (
            <li key={`listItem${indexItem}`}>
              <ul>
                <li>
                  <strong>
                    n°{indexItem + 1} - {item.expenseDate} - {item.object}
                  </strong>
                </li>
                <li>
                  Km : {item.km} - Frais de transport : {item.transportCost} -
                  Autres frais : {item.othersCost}
                </li>
                <button
                  className="tertiary"
                  onClick={() => removeExpense(indexItem)}
                >
                  Supprimer la dépense
                </button>
              </ul>
            </li>
          );
        })}
      </ul>
      <div className={styles.nextPrevButton}>
        <button className="secondary" onClick={() => setStep(1)}>
          Retour
        </button>
        <button
          className="primary"
          onClick={() => {
            if (formData.expensesList.length === 0) {
              console.log("Il n'y a encore aucune dépense d'entrée");
              return null;
            }
            setStep(3);
          }}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
