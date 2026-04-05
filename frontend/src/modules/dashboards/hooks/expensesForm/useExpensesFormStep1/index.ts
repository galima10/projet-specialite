import type { FormData } from "@app-types/FormData";
import { Dispatch, SetStateAction } from "react";
import type { FieldErrors } from "@app-types/FieldErrors";

export function useExpensesFormStep1(
  formData: FormData,
  setStep: Dispatch<SetStateAction<number>>,
  setFieldErrors: Dispatch<SetStateAction<FieldErrors>>,
) {
  function handleValidateInfos() {
    if (formData.reason === "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          reason: "Veuillez entrer une raison",
        };
      });
    }
    if (formData.budget === "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          budget: "Veuillez entrer un budget",
        };
      });
    }
    if (formData.userName === "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          userName: "Veuillez entrer un nom de demandeur",
        };
      });
    }
    if (
      formData.reason === "" ||
      formData.budget === "" ||
      formData.userName === ""
    ) {
      return null;
    }
    setFieldErrors((prev) => {
      return {
        ...prev,
        reason: null,
        budget: null,
        userName: null,
      };
    });
    setStep(2);
  }
  return { handleValidateInfos };
}
