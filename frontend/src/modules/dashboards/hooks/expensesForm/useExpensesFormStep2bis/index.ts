import { Dispatch, SetStateAction } from "react";
import type { FormData } from "@app-types/FormData";

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

    if (
      currentExpense.expenseDate === "" ||
      currentExpense.object === "" ||
      (km === 0 && transport === 0 && other === 0) ||
      currentDocuments.length === 0
    ) {
      console.log("Il manque des champs");
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
    setStep(2);
  }
  return { handleAddExpense };
}
