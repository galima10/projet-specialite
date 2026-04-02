import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { fetchMileageRatesThunk } from "@stores/thunks/mileages";
import { Users } from "@stores/features/users";
import { createExpensesReportThunk } from "@stores/thunks/expensesReports";
import { ExpensesReport } from "@stores/features/expensesReports";

export const budget = [
  {
    name: "Administratif",
    value: "ADMINISTRATIVE",
  },
  {
    name: "Bibliothèque",
    value: "LIBRARY",
  },
  {
    name: "Matos Explo / Spéléo / Canyon",
    value: "EXPEDITION_EQUIPEMENT",
  },
  {
    name: "Matos autre",
    value: "OTHER_EQUIPEMENT",
  },
  {
    name: "Week-ends et sorties",
    value: "WEEKENDS_OUTINGS",
  },
];

export function useExpensesReportsForm() {
  const disptach = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const { waiverMileageRates, kmMileageRates } = useAppSelector(
    (state) => state.mileage,
  );
  useEffect(() => {
    disptach(fetchMileageRatesThunk());
  }, []);

  const [step, setStep] = useState<number>(1);
  const [currentExpense, setCurrentExpense] = useState({
    date: "",
    object: "",
    km: 0,
    transportCost: 0,
    otherCost: 0,
    documents: null,
  });
  const [currentDocuments, setCurrentDocuments] = useState<
    { name: string; preview: string; file: File }[]
  >([]);
  const [formData, setFormData] = useState({
    dateRequest: "",
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
  });

  function removeExpense(indexToRemove: number) {
    setFormData((prev) => ({
      ...prev,
      expensesList: prev.expensesList.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  }

  function calculateTotals() {
    const totalKm = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.km || 0),
      0,
    );

    const rate = kmMileageRates.find(
      (rate) => rate.label === formData.kmMileageRate,
    );

    const totalKmAmount = rate ? totalKm * rate.amountPerKm : 0;

    const totalTransportCost = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.transportCost || 0),
      0,
    );

    const totalOtherCost = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.othersCost || 0),
      0,
    );

    const totalAll = totalKmAmount + totalTransportCost + totalOtherCost;

    return {
      totalAll,
      totalKm,
      totalKmAmount,
      totalTransportCost,
      totalOtherCost,
    };
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    isExpense = false,
  ) {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;

    const { name, value, type } = target;

    const checked =
      type === "checkbox" ? (target as HTMLInputElement).checked : undefined;

    const files =
      type === "file" ? (target as HTMLInputElement).files : undefined;

    if (isExpense) {
      setCurrentExpense((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "file"
              ? (files?.[0] ?? null)
              : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "file"
              ? (files?.[0] ?? null)
              : value,
      }));
    }
  }
  function handleDocumentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentDocuments((prev) => [
      ...prev,
      {
        name: file.name,
        preview: URL.createObjectURL(file),
        file: file,
      },
    ]);
  }
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }
  function sendData(userSelected: Users | null = null) {
    console.log(formData);
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
    if (hasKm && formData.kmMileageRate === null) {
      console.log(
        "Il faut sélectionner un kmMileageRate pour les dépenses avec km",
      );
      return null;
    }

    if (formData.amountWaiver > 0 && formData.waiverMileageRate === null) {
      console.log(
        "Il faut sélectionner un waiverMileageRate si amountWaiver > 0",
      );
      return null;
    }

    let userId: number, kmMileageRateId: number, waiverMileageRateId: number;
    if (currentUser.role === "ROLE_ADMIN") {
      if (userSelected) userId = userSelected.id;
      else userId = currentUser.id;
    } else {
      userId = currentUser.id;
    }

    if (formData.kmMileageRate && kmMileageRates.length !== 0) {
      kmMileageRateId = kmMileageRates.find(
        (km) => km.label === formData.kmMileageRate,
      ).id;
    }

    if (formData.waiverMileageRate && waiverMileageRates.length !== 0) {
      waiverMileageRateId = waiverMileageRates.find(
        (wv) => wv.label === formData.waiverMileageRate,
      ).id;
    }

    const request: ExpensesReport = {
      createdAt: formData.createdAt,
      reason: formData.reason,
      budget: formData.budget,
      amountWaiver: formData.amountWaiver,
      waiverMileageRateId: waiverMileageRateId,
      kmMileageRateId: kmMileageRateId,
      reportDocumentFile: formData.reportDocumentFile,
      expensesList: formData.expensesList,
    };

    console.log(userId);

    disptach(createExpensesReportThunk({ data: request, userId: userId }));

    console.log(request);
  }

  function generateHtml() {
    // --- Totaux ---
    const totalKm = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.km || 0),
      0,
    );

    const rate = kmMileageRates.find(
      (rate) => rate.label === formData.kmMileageRate,
    );

    const totalKmAmount = rate ? totalKm * rate.amountPerKm : 0;

    const totalTransportCost = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.transportCost || 0),
      0,
    );

    const totalOtherCost = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.othersCost || 0),
      0,
    );

    const totalAll = totalKmAmount + totalTransportCost + totalOtherCost;

    // --- Justificatifs HTML ---
    const expensesRows = formData.expensesList
      .map(
        (exp) => `
      <tr>
        <td>${exp.date}</td>
        <td>${exp.object}</td>
        <td>${exp.km}</td>
        <td>${exp.transportCost} €</td>
        <td>${exp.othersCost} €</td>
      </tr>
    `,
      )
      .join("");

    // --- Frais d'abandon ---
    let realAmountWaiver = 0;
    if (formData.waiverMileageRate) {
      const waiverRate = waiverMileageRates.find(
        (r) => r.label === formData.waiverMileageRate,
      );
      realAmountWaiver = waiverRate
        ? totalKm * waiverRate.amountPerKm * (1 - 0.66)
        : 0;
    }

    // --- Génération HTML ---
    return `
    <div style="padding:20px;font-family:Arial">
      <h1>Note de frais</h1>
  
      <h3>Informations</h3>
      <p><strong>Nom:</strong> ${formData.userName}</p>
      <p><strong>Date demande:</strong> ${formData.createdAt}</p>
      <p><strong>Motif:</strong> ${formData.reason}</p>
      <p><strong>Budget:</strong> ${budget.find((b) => b.value === formData.budget).name}</p>
  
      <h3>Dépenses</h3>
      <table border="1" cellspacing="0" cellpadding="5" width="100%">
        <thead>
          <tr>
            <th>Date</th>
            <th>Objet</th>
            <th>Km</th>
            <th>Transport</th>
            <th>Autres</th>
          </tr>
        </thead>
        <tbody>
          ${expensesRows}
        </tbody>
      </table>
  
      <h3>Totaux</h3>
      <ul>
        <li>Total km : ${totalKm}</li>
        <li>Total frais km : ${totalKmAmount.toFixed(2)} €</li>
        <li>Total frais transport : ${totalTransportCost.toFixed(2)} €</li>
        <li>Total autres frais : ${totalOtherCost.toFixed(2)} €</li>
        <li>Total général : ${totalAll.toFixed(2)} €</li>
      </ul>
  
      ${
        formData.waiverMileageRate
          ? `
        <h3>Frais d'abandon</h3>
        <p>Barème choisi : ${formData.waiverMileageRate}</p>
        <p>Après déduction d’impôts, le montant réel dépensé sera de : ${realAmountWaiver.toFixed(2)} €</p>
      `
          : ""
      }
  
      <h3>Coordonnées bancaires</h3>
      <p>IBAN: ${formData.userIBAN}</p>
      <p>BIC: ${formData.userBIC}</p>
    </div>
    `;
  }

  async function handleGeneratePdf() {
    if (
      formData.reason.trim() === "" ||
      formData.budget.trim() === "" ||
      formData.amountWaiver === null ||
      formData.expensesList.length === 0 ||
      formData.userBIC === "" ||
      formData.userIBAN === ""
    ) {
      console.log("manque de champs");
      return null;
    }

    const hasKm = formData.expensesList.some((item) => item.km > 0);
    if (hasKm && formData.kmMileageRate === null) {
      console.log(
        "Il faut sélectionner un kmMileageRate pour les dépenses avec km",
      );
      return null;
    }

    if (formData.amountWaiver > 0 && formData.waiverMileageRate === null) {
      console.log(
        "Il faut sélectionner un waiverMileageRate si amountWaiver > 0",
      );
      return null;
    }
    const element = document.createElement("div");
    element.innerHTML = generateHtml();

    const opt = {
      margin: 10,
      filename: "note-de-frais.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const pdfBlob = await window
      .html2pdf()
      .set(opt)
      .from(element)
      .outputPdf("blob");

    const pdfFile = new File([pdfBlob], "note-de-frais.pdf", {
      type: "application/pdf",
    });

    formData.reportDocumentFile = pdfFile;

    window.html2pdf().set(opt).from(element).save();
  }

  function handleValidateInfos() {
    if (
      formData.reason === "" ||
      formData.budget === "" ||
      formData.userName === ""
    ) {
      console.log("Il manque des champs");
      return null;
    }
    setStep(2);
  }

  function handleAddExpense() {
    console.log(currentExpense);
    if (
      currentExpense.date === "" ||
      currentExpense.object === "" ||
      (Number(currentExpense.km) === 0 &&
        Number(currentExpense.transportCost) === 0 &&
        Number(currentExpense.otherCost) === 0) ||
      currentDocuments.length === 0
    ) {
      console.log("Il manque des champs");
      return null;
    }
    const finalExpense = {
      ...currentExpense,
      documents: currentDocuments,
    };

    setFormData((prev) => ({
      ...prev,
      expensesList: [...prev.expensesList, finalExpense],
    }));
    setCurrentExpense({
      date: "",
      object: "",
      km: 0,
      transportCost: 0,
      otherCost: 0,
      documents: [],
    });
    setCurrentDocuments([]);
    setStep(2);
  }

  return {
    formData,
    setFormData,
    currentDocuments,
    setCurrentDocuments,
    currentExpense,
    setCurrentExpense,
    calculateTotals,
    removeExpense,
    currentUser,
    kmMileageRates,
    waiverMileageRates,
    handleDocumentChange,
    handleGeneratePdf,
    handleInputChange,
    handleSubmit,
    sendData,
    step,
    setStep,
    handleAddExpense,
    handleValidateInfos,
  };
}

export function useExportsFormHasFields() {
  const [hasKm, setHasKm] = useState(false);
  const [hasTransport, setHasTransport] = useState(false);
  const [hasOther, setHasOther] = useState(false);
  const [hasWaiver, setHasWaiver] = useState(false);
  return {
    hasKm,
    setHasKm,
    hasOther,
    setHasOther,
    hasTransport,
    setHasTransport,
    hasWaiver,
    setHasWaiver,
  };
}
