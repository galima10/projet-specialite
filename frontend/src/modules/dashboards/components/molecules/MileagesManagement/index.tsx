import styles from "./MileagesManagement.module.scss";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import {
  fetchMileageRatesThunk,
  createMileageRateThunk,
  deleteMileageRateThunk,
} from "@stores/thunks/mileages";
import { MileageRate } from "@stores/features/mileages";

const rateType = [
  {
    name: "Voiture",
    value: "CAR",
  },
  {
    name: "Moto",
    value: "MOTORCYCLE",
  },
];

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
    type: "",
  });
  const dispatch = useAppDispatch();
  const { waiverMileageRates, kmMileageRates } = useAppSelector(
    (state) => state.mileage,
  );
  useEffect(() => {
    dispatch(fetchMileageRatesThunk());
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
    if (
      formData.label === "" ||
      formData.amountPerKm === 0 ||
      formData.type === ""
    ) {
      console.log("manque de champs");
      return null;
    }

    const newMileage: MileageRate = {
      label: formData.label,
      amountPerKm: Number(formData.amountPerKm),
      type: formData.type,
    };

    if (formType === "km")
      dispatch(createMileageRateThunk({ newMileage, type: "KM" }));
    else dispatch(createMileageRateThunk({ newMileage, type: "WAIVER" }));

    setFormData({
      label: "",
      amountPerKm: 0,
      type: "",
    });
    setMileagesTab("list");
  }
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  return (
    <div className={styles.mileage}>
      {mileagesTab === "list" ? (
        <>
          <h4>Liste des barèmes</h4>
          <button
            className="secondary"
            onClick={() => {
              setTab("home");
            }}
          >
            Retour
          </button>
          <h5 style={{ marginTop: "3rem", marginBottom: "1rem" }}>
            Barèmes kilométriques
          </h5>
          <button
            className="primary"
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
                    {item.label} - {item.amountPerKm}/km - Type : {item.type}
                  </p>
                  <button
                    className="tertiary"
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
          <h5 style={{ marginTop: "3rem", marginBottom: "1rem" }}>
            Barèmes d'abandon de frais
          </h5>
          <button
            className="primary"
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
                    {item.label} - {item.amountPerKm}/km - Type : {item.type}
                  </p>
                  <button
                    className="tertiary"
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
          <div className={styles.input}>
            <label htmlFor="type">Type</label>
            <select name="type" id="type" onChange={handleInputChange}>
              <option value="">--Choisissez une option--</option>
              {rateType.map((item, index) => {
                return (
                  <option key={`type-${index}`} value={item.value}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={styles.nextPrevButton}>
            <button
              className="secondary"
              onClick={() => {
                setMileagesTab("list");
                setFormData({
                  label: "",
                  amountPerKm: 0,
                  type: "",
                });
              }}
            >
              Annuler
            </button>
            <button className="primary" onClick={sendData}>
              Enregistrer
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
