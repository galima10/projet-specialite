import type { FormData } from "@app-types/FormData";
import type { Users } from "@stores/features/users";
import type { ExpensesReport } from "@stores/features/expensesReports";
import { useAppDispatch, useAppSelector } from "@modules/shared/hooks/redux";
import { createExpensesReportThunk } from "@stores/thunks/expensesReports";
import { pdfHtmlTemplate } from "@utils/pdfHtmlTemplate";
import { Dispatch, SetStateAction } from "react";

export function useExpensesFormStep3(
  formData: FormData,
  userSelected: Users,
  totalKm: number,
  totalKmAmount: number,
  totalTransportCost: number,
  totalOthersCost: number,
  totalAll: number,
  setStep: Dispatch<SetStateAction<number>>,
  setFormData: Dispatch<SetStateAction<FormData>>,
) {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const { waiverMileageRates, kmMileageRates } = useAppSelector(
    (state) => state.mileage,
  );

  function calculateTaxDeduction() {
    const rate = waiverMileageRates.find(
      (r) => r.label === formData.waiverMileageRate,
    );

    const totalAmount = rate ? totalKm * rate.amountPerKm : 0;

    const effectiveAmount = Math.min(totalAmount, formData.amountWaiver);

    const realAmount = effectiveAmount * (1 - 0.66);
    return realAmount.toFixed(2);
  }

  async function sendData(userSelected: Users | null = null, pdfFile: File) {
    if (
      formData.reason.trim() === "" ||
      formData.budget.trim() === "" ||
      formData.amountWaiver === null ||
      formData.expensesList.length === 0
    ) {
      console.log("manque de champs");
      return null;
    }

    const hasKm = formData.expensesList.some((item) => item.km > 0);
    if (hasKm && formData.kmMileageRate === "") {
      console.log(
        "Il faut sélectionner un kmMileageRate pour les dépenses avec km",
      );
      return null;
    }

    if (formData.amountWaiver > 0 && formData.waiverMileageRate === "") {
      console.log(
        "Il faut sélectionner un waiverMileageRate si amountWaiver > 0",
      );
      return null;
    }

    let userId: number;
    if (
      currentUser.role === "ROLE_ADMIN" ||
      currentUser.role === "ROLE_TREASURER"
    ) {
      if (userSelected) userId = userSelected.id;
      else userId = currentUser.id;
    } else {
      userId = currentUser.id;
    }

    const request: ExpensesReport = {
      reason: formData.reason,
      file: pdfFile,
    };

    dispatch(createExpensesReportThunk({ data: request, userId: userId }));
  }

  async function generatePdf() {
    const element = document.createElement("div");
    element.style.width = "100%";
    element.style.minHeight = "297mm";
    element.style.margin = "0";
    element.style.padding = "0";
    element.style.display = "block";
    element.style.boxSizing = "border-box";
    element.style.position = "relative";
    element.innerHTML = pdfHtmlTemplate(
      formData,
      waiverMileageRates,
      kmMileageRates,
      totalKm,
      totalKmAmount,
      totalTransportCost,
      totalOthersCost,
      totalAll,
    );

    const opt = {
      margin: 10,
      filename: "note-de-frais.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: -5,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    window.html2pdf().set(opt).from(element).save();

    const pdfBlobRaw = await window
      .html2pdf()
      .set(opt)
      .from(element)
      .outputPdf("blob");

    const pdfBlob = new Blob([pdfBlobRaw], { type: "application/pdf" });

    const pdfFile = new File([pdfBlob], "note-de-frais.pdf", {
      type: "application/pdf",
    });

    return pdfFile;
  }
  async function handleGeneratePdf() {
    if (
      formData.reason.trim() === "" ||
      formData.budget.trim() === "" ||
      formData.amountWaiver === null ||
      formData.expensesList.length === 0 ||
      formData.signature === "" ||
      (parseFloat(
        (
          Math.round((totalAll - (formData.amountWaiver ?? 0)) * 100) / 100
        ).toFixed(2),
      ) > 0 &&
        (formData.userBIC === "" || formData.userIBAN === ""))
    ) {
      console.log("manque de champs");
      return null;
    }

    const hasKm = formData.expensesList.some((item) => item.km > 0);
    if (hasKm && !formData.kmMileageRate) {
      console.log(
        "Il faut sélectionner un kmMileageRate pour les dépenses avec km",
      );
      return null;
    }

    if (formData.amountWaiver > 0 && formData.waiverMileageRate === "") {
      console.log(
        "Il faut sélectionner un waiverMileageRate si amountWaiver > 0",
      );
      return null;
    }

    const pdfFile = await generatePdf();
    await sendData(userSelected, pdfFile);

    setStep(4);
  }

  function handleSignatureChange(dataUrl: string) {
    setFormData((prev) => ({
      ...prev,
      signature: dataUrl,
    }));
  }
  return {
    handleGeneratePdf,
    kmMileageRates,
    handleSignatureChange,
    calculateTaxDeduction
  };
}
