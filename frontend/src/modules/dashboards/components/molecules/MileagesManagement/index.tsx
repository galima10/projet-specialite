import styles from "./MileagesManagement.module.scss";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import {
  fetchMileageRatesThunk,
  createMileageRateThunk,
  deleteMileageRateThunk,
} from "@stores/thunks/mileages";
import { MileageRate } from "@stores/features/mileages";

export default function MileagesManagement({
  setTab,
}: {
  setTab: Dispatch<SetStateAction<"home" | "addReport">>;
}) {
  const [mileagesTab, setMileagesTab] = useState<"list" | "setMileage">("list");
  const [formType, setFormType] = useState<"waiver" | "km" | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    amountPerKm: 0,
  });
  const dispatch = useAppDispatch();
  const { waiverMileageRates, kmMileageRates } = useAppSelector(
    (state) => state.mileage,
  );
  useEffect(() => {
    dispatch(fetchMileageRatesThunk());
    console.log("test");
  }, []);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;

    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function sendData() {
    console.log(formData);
    if (formData.label === "" || formData.amountPerKm === 0) {
      console.log("manque de champs");
      return null;
    }

    const newMileage: MileageRate = {
      label: formData.label,
      amountPerKm: Number(formData.amountPerKm),
    };

    if (formType === "km")
      dispatch(createMileageRateThunk({ newMileage, type: "KM" }));
    else dispatch(createMileageRateThunk({ newMileage, type: "WAIVER" }));

    setFormData({
      label: "",
      amountPerKm: 0,
    });
    setMileagesTab("list");
  }
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  return (
    <div>
      {mileagesTab === "list" ? (
        <>
          <h4>Liste des barèmes</h4>
          <button
            onClick={() => {
              setTab("home");
            }}
          >
            Retour
          </button>
          <h5>Barèmes kilométriques</h5>
          <button
            onClick={() => {
              setFormType("km");
              setMileagesTab("setMileage");
            }}
          >
            Ajouter dans le barème kilométrique
          </button>
          <ul>
            {kmMileageRates.map((item, index) => {
              return (
                <li key={`km-${index}`}>
                  <p>
                    {item.label} - {item.amountPerKm}/km
                  </p>
                  <button
                    onClick={() =>
                      dispatch(
                        deleteMileageRateThunk({ rateId: item.id, type: "KM" }),
                      )
                    }
                  >
                    Supprimer
                  </button>
                </li>
              );
            })}
          </ul>
          <h5>Barèmes d'abandon de frais</h5>
          <button
            onClick={() => {
              setFormType("waiver");
              setMileagesTab("setMileage");
            }}
          >
            Ajouter dans le barème d'abandon de frais
          </button>
          <ul>
            {waiverMileageRates.map((item, index) => {
              return (
                <li key={`km-${index}`}>
                  <p>
                    {item.label} - {item.amountPerKm}/km
                  </p>
                  <button
                    onClick={() =>
                      dispatch(
                        deleteMileageRateThunk({
                          rateId: item.id,
                          type: "WAIVER",
                        }),
                      )
                    }
                  >
                    Supprimer
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.input}>
            <label htmlFor="label">Label</label>
            <input
              id="label"
              type="text"
              placeholder="Entrez un label..."
              name="label"
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="amountPerKm">Montant par km</label>
            <input
              id="amountPerKm"
              type="number"
              step="0.001"
              placeholder="Entrez un label..."
              name="amountPerKm"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*([.,]\d{0,3})?$/.test(value) || value === "") {
                  handleInputChange(e);
                }
              }}
              onBlur={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  e.target.value = value.toFixed(3);
                }
              }}
            />
          </div>
          <div className={styles.nextPrevButton}>
            <button
              onClick={() => {
                setMileagesTab("list");
                setFormData({
                  label: "",
                  amountPerKm: 0,
                });
              }}
            >
              Annuler
            </button>
            <button onClick={sendData}>Enregistrer</button>
          </div>
        </form>
      )}
    </div>
  );
}
