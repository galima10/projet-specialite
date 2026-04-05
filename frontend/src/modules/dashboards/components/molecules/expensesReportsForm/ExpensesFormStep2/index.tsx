import type { FormData } from "@app-types/FormData";
import styles from "./ExpensesFormStep2.module.scss";
import { Dispatch, SetStateAction } from "react";
import type { FieldErrors } from "@app-types/FieldErrors";

interface ExpensesFormStep2Props {
  setHasKm: Dispatch<SetStateAction<boolean>>;
  setHasTransport: Dispatch<SetStateAction<boolean>>;
  setHasOther: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<number>>;
  removeExpense: (indexToRemove: number) => void;
  formData: FormData;
  setFieldErrors: Dispatch<SetStateAction<FieldErrors>>;
  fieldErrors: FieldErrors;
}

export default function ExpensesFormStep2({
  setHasKm,
  setHasTransport,
  setHasOther,
  setStep,
  formData,
  removeExpense,
  setFieldErrors,
  fieldErrors,
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
        {formData.expensesList.length > 0 ? (
          formData.expensesList.map((item, indexItem) => {
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
          })
        ) : (
          <p
            style={{ textAlign: "center" }}
            className={fieldErrors.expensesList && styles.error}
          >
            {fieldErrors.expensesList
              ? fieldErrors.expensesList
              : "Aucune dépense actuellement"}
          </p>
        )}
      </ul>
      <div className={styles.nextPrevButton}>
        <button
          className="secondary"
          onClick={() => {
            setStep(1);
            setFieldErrors((prev) => {
              return {
                ...prev,
                expensesList: null,
              };
            });
          }}
        >
          Retour
        </button>
        <button
          className="primary"
          onClick={() => {
            if (formData.expensesList.length === 0) {
              console.log("Il n'y a encore aucune dépense d'entrée");
              setFieldErrors((prev) => {
                return {
                  ...prev,
                  expensesList: "Veuillez ajouter une moins une dépense",
                };
              });
              return null;
            }
            setFieldErrors((prev) => {
              return {
                ...prev,
                expensesList: null,
              };
            });
            setStep(3);
          }}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
