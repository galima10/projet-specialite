import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { fetchMileageRatesThunk } from "@stores/thunks/mileages";
import { Users } from "@stores/features/users";
import { createExpensesReportThunk } from "@stores/thunks/expensesReports";
import { ExpensesReport } from "@stores/features/expensesReports";
import { fetchAssociationContactsThunk } from "@stores/thunks/association";
const API_URL = import.meta.env.VITE_API_URL;
import { API_ROUTES } from "@constants/apiroute";

interface FormData {
  userName: string;
  createdAt: string;
  reason: string;
  budget: string;
  amountWaiver: number;
  waiverMileageRate: string | null;
  kmMileageRate: string | null;
  reportDocumentFile: File | null;
  expensesList: {
    date: string;
    object: string;
    km: number;
    transportCost: number;
    othersCost: number;
    documents: { name: string; preview: string; file: File }[] | null;
  }[];
  userIBAN: string;
  userBIC: string;
  signature: string;
}

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

export function useExpensesReportsForm(userSelected: Users | null) {
  const dispatch = useAppDispatch();
  const { currentUser, users } = useAppSelector((state) => state.user);
  const { waiverMileageRates, kmMileageRates } = useAppSelector(
    (state) => state.mileage,
  );
  const { contacts } = useAppSelector((state) => state.association);
  const { expensesReports } = useAppSelector((state) => state.expensesReport);
  useEffect(() => {
    if (waiverMileageRates.length === 0 || kmMileageRates.length === 0)
      dispatch(fetchMileageRatesThunk());
    if (contacts.length === 0) {
      dispatch(fetchAssociationContactsThunk());
    }
  }, []);
  const [rateTypeSelected, setRateTypeSelected] = useState<
    "CAR" | "MOTORCYCLE"
  >(null);

  const [step, setStep] = useState<number>(1);
  const [currentExpense, setCurrentExpense] = useState({
    date: "",
    object: "",
    km: 0,
    transportCost: 0,
    othersCost: 0,
    documents: null,
  });
  const [currentDocuments, setCurrentDocuments] = useState<
    { name: string; preview: string; file: File }[]
  >([]);
  const [formData, setFormData] = useState<FormData>({
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

    const totalOthersCost = formData.expensesList.reduce(
      (sum, item) => sum + Number(item.othersCost || 0),
      0,
    );

    const totalAll = totalKmAmount + totalTransportCost + totalOthersCost;

    return {
      totalAll,
      totalKm,
      totalKmAmount,
      totalTransportCost,
      totalOthersCost,
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

    if (!isExpense && name === "kmMileageRate") {
      const selectedRate = kmMileageRates.find((rate) => rate.label === value);

      setRateTypeSelected(selectedRate?.type as "CAR" | "MOTORCYCLE");

      setFormData((prev) => ({
        ...prev,
        kmMileageRate: value,
        waiverMileageRate: "",
      }));

      return;
    }

    if (!isExpense && name === "amountWaiver") {
      setFormData((prev) => ({
        ...prev,
        amountWaiver: value === "" ? 0 : Number(value),
      }));
      return;
    }

    if (isExpense) {
      setCurrentExpense((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }
  function handleSignatureChange(dataUrl: string) {
    console.log(formData);
    setFormData((prev) => ({
      ...prev,
      signature: dataUrl,
    }));
  }
  const filteredWaiverMileageRates = waiverMileageRates.filter(
    (rate) => rate.type === rateTypeSelected,
  );
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

  const {
    totalAll,
    totalKm,
    totalKmAmount,
    totalTransportCost,
    totalOthersCost,
  } = calculateTotals();

  function generateHtmlPages() {
    const budgetFound = budget.find((b) => b.value === formData.budget).name;
    const wvRate = waiverMileageRates.find(
      (r) => r.label === formData.waiverMileageRate,
    );
    const kmRate = kmMileageRates.find(
      (r) => r.label === formData.kmMileageRate,
    );

    const totalAmountWaiver = wvRate ? totalKm * wvRate.amountPerKm : 0;
    const effectiveAmountWaiver = Math.min(
      totalAmountWaiver,
      formData.amountWaiver,
    );
    const realAmountWaiver = effectiveAmountWaiver * (1 - 0.66);
    const pages: string[] = [];

    const expensesPerPage = 15;
    const totalPages = Math.ceil(
      formData.expensesList.length / expensesPerPage,
    );

    for (let i = 0; i < totalPages; i++) {
      const slice = formData.expensesList.slice(
        i * expensesPerPage,
        (i + 1) * expensesPerPage,
      );

      const rows = slice
        .map(
          (exp) => `
      <tr>
        <td style="font-size: 0.85rem; border: 1px solid black; padding: .35rem">${exp.date}</td>
        <td style="font-size: 0.85rem; border: 1px solid black; padding: .35rem">${exp.object}</td>
        <td style="font-size: 0.85rem; border: 1px solid black; padding: .35rem">${Number(exp.km).toFixed(2)}</td>
        <td style="font-size: 0.85rem; border: 1px solid black; padding: .35rem">${Number(exp.transportCost).toFixed(2)} €</td>
        <td style="font-size: 0.85rem; border: 1px solid black; padding: .35rem">${Number(exp.othersCost).toFixed(2)} €</td>
      </tr>
    `,
        )
        .join("");

      pages.push(`
      <div style="max-width: 100%; padding: 0; width: 100%; height: 100%; box-sizing: border-box; font-family: Arial; margin-bottom: .1rem">
        <h1 style="font-size: 2.35rem; text-align: center; margin-bottom: 2rem">Note de frais</h1>
        <h3 style="font-size: 1.5rem; margin-bottom: .5rem; margin-top: .85rem">Informations</h3>
        <p style="font-size: 0.85rem; margin-bottom: .35rem"><strong>Nom du demandeur :</strong> ${formData.userName}</p>
        <p style="font-size: 0.85rem; margin-bottom: .35rem"><strong>Date de la demande demande :</strong> ${formData.createdAt.split("T")[0]}</p>
        <p style="font-size: 0.85rem; margin-bottom: .35rem"><strong>Raison de la dépense :</strong> ${formData.reason}</p>
        <p style="font-size: 0.85rem"><strong>Budget :</strong> ${budgetFound}</p>

        <h3 style="font-size: 1.5rem; margin-bottom: .5rem; margin-top: .85rem">Dépenses</h3>
        <table cellspacing="0" cellpadding="5" width="100%">
          <thead>
            <tr>
              <th style="font-size: 0.85rem; border: 1px solid black; background-color: #EBEFF2; padding: .35rem">Date<br/><small style="font-size: 0.75rem;">de la dépense</small></th>
              <th style="font-size: 0.85rem; border: 1px solid black; background-color: #EBEFF2; padding: .35rem">Objet de la dépense</th>
              <th style="font-size: 0.85rem; border: 1px solid black; background-color: #EBEFF2; padding: .35rem">Km<br/><small style="font-size: 0.75rem;">effectués</small></th>
              <th style="font-size: 0.85rem; border: 1px solid black; background-color: #EBEFF2; padding: .35rem">Péages,<br/>autres transports</th>
              <th style="font-size: 0.85rem; border: 1px solid black; background-color: #EBEFF2; padding: .35rem">Autres</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr>
              <td style="font-size: 0.85rem; padding: .35rem"></td>
              <td style="font-size: 0.65rem; opacity: .75; font-style: italic; text-align: end; padding: .35rem">Total de km :</td>
              <td style="font-size: 0.85rem; border: 1px solid black; padding: .35rem">${totalKm > 0 ? totalKm.toFixed(2) : 0} km</td>
              <td style="font-size: 0.85rem; padding: .35rem"></td>
              <td style="font-size: 0.85rem; padding: .35rem"></td>
            </tr>
            <tr>
              <td style="font-size: 0.85rem; padding: .35rem"></td>
              <td style="font-size: 0.65rem; opacity: .75; font-style: italic; text-align: end; padding: .35rem">Barème kilométrique :</td>
              <td style="font-size: 0.85rem; border: 1px solid black; padding: .35rem">${formData.kmMileageRate ? kmRate.amountPerKm.toFixed(3) : 0}/km</td>
              <td style="font-size: 0.85rem; padding: .35rem"></td>
              <td style="font-size: 0.85rem; padding: .35rem"></td>
            </tr>
            <tr>
              <td style="font-size: 0.85rem; padding: .35rem"></td>
              <td style="font-size: 0.65rem; opacity: .75; font-style: italic; text-align: end; padding: .35rem">Totaux par catégorie :</td>
              <td style="font-size: 0.85rem; border: 1px solid black; padding: .35rem">${totalKmAmount && totalKmAmount > 0 ? totalKmAmount.toFixed(2) : 0} €</td>
              <td style="font-size: 0.85rem; border: 1px solid black; padding: .35rem">${totalTransportCost > 0 ? totalTransportCost.toFixed(2) : 0} €</td>
              <td style="font-size: 0.85rem; border: 1px solid black; padding: .35rem">${totalOthersCost > 0 ? totalOthersCost.toFixed(2) : 0} €</td>
            </tr>
          </tbody>
        </table>
        <p style="margin-top: .65rem"><strong style="font-size: 0.85rem">Total des frais : ${totalAll > 0 ? totalAll.toFixed(2) : 0} €</strong></p>
        ${
          formData.waiverMileageRate
            ? `
          <h3 style="font-size: 1.5rem; margin-bottom: .5rem; margin-top: .85rem">Abandon de frais</h3>
          <p style="font-size: 0.75rem; margin-bottom: .75rem">
            Il vous est possible de faire don au CST du total ou d'une partie de cette somme.
            Dans ce cas, conformément à l’article 41 de la loi 2000 627 du 6 juillet 2000 modifiant la loi du 16 juillet 1984 relative à l’organisation et la promotion des activités physiques et sportives, vous bénéficierez d’une réduction d’impôts égale à 66 % de la somme concernée (dans la limite de 20 % du revenu imposable). Un reçu fiscal vous sera envoyé.
            Attention le barême kilomètrique est différent dans ce cas.
          </p>
          <p><strong style="font-size: 0.85rem">J'abandonne le remboursement de la somme de : ${formData.amountWaiver > 0 ? formData.amountWaiver : 0} €</strong></p>
          <p><em style="font-size: 0.65rem; opacity: .75">Barème d'abandon de frais : ${formData.waiverMileageRate ? wvRate.amountPerKm.toFixed(3) : 0}/km</em></p>
          <p><small style="font-size: 0.75rem">Après déduction d'impôts, le montant réel dépensé sera de : ${realAmountWaiver.toFixed(2)} €</small></p>
        `
            : ""
        }
        <h3 style="font-size: 1.5rem; margin-bottom: .5rem; margin-top: .85rem">Remboursement</h3>
        <p><strong style="font-size: 0.85rem">Je souhaite que le CST me rembourse : ${(Math.round((totalAll - (formData.amountWaiver ?? 0)) * 100) / 100).toFixed(2)} €</strong></p>
        ${
          parseFloat(
            (
              Math.round((totalAll - (formData.amountWaiver ?? 0)) * 100) / 100
            ).toFixed(2),
          ) > 0
            ? `<p style="font-size: 0.85rem; text-decoration: underline; margin-top: 0.5rem; margin-bottom: .5rem">Sur le compte : </p>
        <p><strong style="font-size: 0.85rem">IBAN :</strong> ${formData.userIBAN}</p>
        <p><strong style="font-size: 0.85rem">BIC :</strong> ${formData.userBIC}</p>`
            : ""
        }
        

        ${
          formData.signature
            ? `
  <h4 style="font-size: 0.8rem; margin-top: 1rem; margin-bottom: .5rem; text-align: right;">Signature :</h4>
  <img src="${formData.signature}" style="width: 10rem; height: auto; display: block; margin-left: auto; margin-top: 0.5rem;"/>
`
            : ""
        }

        <div style="page-break-after: always;"></div>
      </div>
    `);
    }

    formData.expensesList.forEach((exp) => {
      (exp.documents || []).forEach((doc: { preview: string }) => {
        pages.push(`
      <div style="max-width: 100%; height: 100%; padding: 0; width: 100%; box-sizing: border-box; font-family: Arial; display: flex; flex-direction: column; align-item: center; margin-bottom: .2rem">
        <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem; text-align:center;">Document justificatif pour ${exp.object}</h3>
        <img src="${doc.preview}" style="width: 90%; height: 175mm; object-fit: fill; page-break-inside: avoid;"/>
        <div style="page-break-after: always;"></div>
      </div>
    `);
      });
    });

    return pages.join("");
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
    element.innerHTML = generateHtmlPages();

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
    console.log(formData);
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

    if (formData.amountWaiver > 0 && !formData.waiverMileageRate) {
      console.log(
        "Il faut sélectionner un waiverMileageRate si amountWaiver > 0",
      );
      return null;
    }

    const pdfFile = await generatePdf();
    await sendData(userSelected, pdfFile);

    setStep(4);
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
    const km =
      typeof currentExpense.km === "string"
        ? parseFloat(currentExpense.km) || 0
        : currentExpense.km || 0;
    const transport =
      typeof currentExpense.transportCost === "string"
        ? parseFloat(currentExpense.transportCost) || 0
        : currentExpense.transportCost || 0;
    const other =
      typeof currentExpense.othersCost === "string"
        ? parseFloat(currentExpense.othersCost) || 0
        : currentExpense.othersCost || 0;

    if (
      currentExpense.date === "" ||
      currentExpense.object === "" ||
      (km === 0 && transport === 0 && other === 0) ||
      currentDocuments.length === 0
    ) {
      console.log("Il manque des champs");
      return null;
    }
    const finalExpense = {
      ...currentExpense,
      documents: currentDocuments,
    };
    setCurrentExpense((prev) => {
      return {
        ...prev,
        documents: currentDocuments,
      };
    });

    setFormData((prev) => ({
      ...prev,
      expensesList: [...prev.expensesList, finalExpense],
    }));
    setCurrentExpense({
      date: "",
      object: "",
      km: 0,
      transportCost: 0,
      othersCost: 0,
      documents: [],
    });
    setCurrentDocuments([]);
    setStep(2);
  }

  async function handleSendPdf() {
    // const user = userSelected
    //   ? users.find((u) => u.id === userSelected.id)
    //   : currentUser;
    // const report: File = expensesReports
    //   .find((e) => e.userId === user.id)
    //   .reports.find((r) => r.reason === formData.reason).file;
    // const res = await fetch(
    //   `${API_URL}${API_ROUTES.ASSOCIATION_CONTACTS}/send/${report.id}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     credentials: "include",
    //   },
    // );
    // if (!res.ok) throw new Error("Error create contact");
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
    contact: contacts[0],
    handleSendPdf,
    rateTypeSelected,
    setRateTypeSelected,
    filteredWaiverMileageRates,
    handleSignatureChange,
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
