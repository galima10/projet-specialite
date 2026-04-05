import { Dispatch, SetStateAction } from "react";
import type { FormData } from "@app-types/FormData";
import type { FieldErrors } from "@app-types/FieldErrors";

export function useExpensesFormStep2bis(
  hasKm: boolean,
  currentExpense: {
    expenseDate: string;
    object: string;
    km: number;
    transportCost: number;
    othersCost: number;
    documents: any;
  },
  hasTransport: boolean,
  hasOther: boolean,
  currentDocuments: {
    name: string;
    preview: string;
    file: File;
  }[],
  setCurrentExpense: Dispatch<
    SetStateAction<{
      expenseDate: string;
      object: string;
      km: number;
      transportCost: number;
      othersCost: number;
      documents: any;
    }>
  >,
  setFormData: Dispatch<SetStateAction<FormData>>,
  setCurrentDocuments: Dispatch<
    SetStateAction<
      {
        name: string;
        preview: string;
        file: File;
      }[]
    >
  >,
  setStep: Dispatch<SetStateAction<number>>,
  setFieldErrors: Dispatch<SetStateAction<FieldErrors>>,
) {
  function handleAddExpense() {
    const km =
      hasKm && currentExpense.km
        ? parseFloat(String(currentExpense.km) as string) || 0
        : 0;
    const transport =
      hasTransport && currentExpense.transportCost
        ? parseFloat(String(currentExpense.transportCost) as string) || 0
        : 0;

    const other =
      hasOther && currentExpense.othersCost
        ? parseFloat(String(currentExpense.othersCost) as string) || 0
        : 0;

    if (currentExpense.expenseDate === "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          expenseDate: "Veuillez entrer une date",
        };
      });
    }
    if (currentExpense.object === "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          object: "Veuillez entrer un objet",
        };
      });
    }
    if (km === 0 && transport === 0 && other === 0) {
      setFieldErrors((prev) => {
        return {
          ...prev,
          km: "Veuillez entrer au moins un de ces 3 champs",
          transportCost: "Veuillez entrer au moins un de ces 3 champs",
          othersCost: "Veuillez entrer au moins un de ces 3 champs",
        };
      });
    }
    if (currentDocuments.length === 0) {
      setFieldErrors((prev) => {
        return {
          ...prev,
          documents: "Veuillez sélectionner au moins un justificatif",
        };
      });
    }

    if (
      currentExpense.expenseDate === "" ||
      currentExpense.object === "" ||
      (km === 0 && transport === 0 && other === 0) ||
      currentDocuments.length === 0
    ) {
      return null;
    }

    const finalExpense = {
      ...currentExpense,
      km,
      documents: currentDocuments,
    };

    setCurrentExpense((prev) => ({
      ...prev,
      documents: currentDocuments,
    }));

    setFormData((prev) => ({
      ...prev,
      expensesList: [...prev.expensesList, finalExpense],
    }));

    setCurrentExpense({
      expenseDate: "",
      object: "",
      km: 0,
      transportCost: 0,
      othersCost: 0,
      documents: [],
    });

    setCurrentDocuments([]);
    setFieldErrors((prev) => {
      return {
        ...prev,
        expensesList: null,
        expenseDate: null,
        object: null,
        km: null,
        transportCost: null,
        othersCost: null,
        documents: null,
      };
    });
    setStep(2);
  }
  return { handleAddExpense };
}
