import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { fetchMileageRatesThunk } from "@stores/thunks/mileages";
import type { Users } from "@stores/features/users";
import { fetchAssociationContactsThunk } from "@stores/thunks/association";
import type { FormData } from "@app-types/FormData";
import type { FieldErrors } from "@app-types/FieldErrors";

export function useExpensesReportsForm(userSelected: Users | null) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    userName: null,
    reason: null,
    budget: null,
    amountWaiver: null,
    waiverMileageRate: null,
    kmMileageRate: null,
    expensesList: null,
    expenseDate: null,
    object: null,
    km: null,
    transportCost: null,
    othersCost: null,
    documents: null,
    userIBAN: null,
    userBIC: null,
    signature: null,
  });
  const [hasKm, setHasKm] = useState(false);
  const [hasTransport, setHasTransport] = useState(false);
  const [hasOther, setHasOther] = useState(false);
  const [hasWaiver, setHasWaiver] = useState(false);
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const { waiverMileageRates, kmMileageRates } = useAppSelector(
    (state) => state.mileage,
  );
  const { contacts } = useAppSelector((state) => state.association);
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
    expenseDate: "",
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
    waiverMileageRate: "",
    kmMileageRate: "",
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
    const target = e.target as HTMLInputElement | HTMLSelectElement;

    const { name, value, type } = target;

    const checked =
      type === "checkbox" ? (target as HTMLInputElement).checked : undefined;

    if (!isExpense && name === "kmMileageRate") {
      if (value !== "") {
        setFieldErrors((prev) => {
          return {
            ...prev,
            kmMileageRate: null,
          };
        });

        if (formData.userBIC === "") {
          setFieldErrors((prev) => {
            return {
              ...prev,
              userBIC: "Veuillez effectuer un BIC",
            };
          });
        }
        if (formData.userIBAN === "") {
          setFieldErrors((prev) => {
            return {
              ...prev,
              userIBAN: "Veuillez effectuer un IBAN",
            };
          });
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          userBIC: "",
          userIBAN: "",
          amountWaiver: 0,
        }));
        setHasWaiver(false);
        setFieldErrors((prev) => {
          return {
            ...prev,
            waiverMileageRate: null,
          };
        });
      }
      const selectedRate = kmMileageRates.find((rate) => rate.label === value);

      setRateTypeSelected(selectedRate?.type as "CAR" | "MOTORCYCLE");

      setFormData((prev) => ({
        ...prev,
        kmMileageRate: value,
        waiverMileageRate: "",
      }));

      return;
    }

    if (formData.userIBAN !== "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          userIBAN: null,
        };
      });
    }
    if (formData.userBIC !== "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          userBIC: null,
        };
      });
    }

    if (name === "userName" && value !== "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          userName: null,
        };
      });
    }
    if (name === "reason" && value !== "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          reason: null,
        };
      });
    }
    if (name === "budget" && value !== "") {
      setFieldErrors((prev) => {
        return {
          ...prev,
          budget: null,
        };
      });
    }
    if (formData.kmMileageRate !== "") {
    } else {
    }

    if (name === "amountWaiver" && Number(value) !== 0) {
      setFieldErrors((prev) => {
        return {
          ...prev,
          amountWaiver: null,
        };
      });
    }
    if (name === "waiverMileageRate") {
      if (value !== "") {
        setFieldErrors((prev) => {
          return {
            ...prev,
            waiverMileageRate: null,
          };
        });
      } else {
        setFormData((prev) => {
          return {
            ...prev,
            amountWaiver: 0,
          };
        });
        setFieldErrors((prev) => {
          return {
            ...prev,
            amountWaiver: null,
          };
        });
      }
    }

    if (!isExpense && name === "amountWaiver") {
      setFormData((prev) => ({
        ...prev,
        amountWaiver: value === "" ? 0 : Number(value),
      }));
      return;
    }

    if (isExpense) {
      if (name === "expenseDate" && value !== "") {
        setFieldErrors((prev) => {
          return {
            ...prev,
            expenseDate: null,
          };
        });
      }
      if (name === "object" && value !== "") {
        setFieldErrors((prev) => {
          return {
            ...prev,
            object: null,
          };
        });
      }
      if (
        (name === "km" && Number(value) !== 0) ||
        (name === "transportCost" && Number(value) !== 0) ||
        (name === "othersCost" && Number(value) !== 0)
      ) {
        setFieldErrors((prev) => {
          return {
            ...prev,
            km: null,
            transportCost: null,
            othersCost: null,
          };
        });
      }
      if (currentDocuments.length !== 0) {
        setFieldErrors((prev) => {
          return {
            ...prev,
            documents: null,
          };
        });
      }
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

  const filteredWaiverMileageRates = waiverMileageRates.filter(
    (rate) => rate.type === rateTypeSelected,
  );
  function handleDocumentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFieldErrors((prev) => {
      return {
        ...prev,
        documents: null,
      };
    });

    setCurrentDocuments((prev) => [
      ...prev,
      {
        name: file.name,
        preview: URL.createObjectURL(file),
        file: file,
      },
    ]);
  }
  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
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
    handleDocumentChange,
    handleInputChange,
    handleSubmit,
    step,
    rateTypeSelected,
    setStep,
    setRateTypeSelected,
    filteredWaiverMileageRates,
    hasKm,
    setHasKm,
    hasOther,
    setHasOther,
    hasTransport,
    setHasTransport,
    hasWaiver,
    setHasWaiver,
    fieldErrors,
    setFieldErrors,
  };
}
