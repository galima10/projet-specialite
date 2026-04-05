import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import {
  fetchMileageRatesThunk,
  deleteMileageRateThunk,
} from "@stores/thunks/mileages";
import { useEffect, Dispatch, SetStateAction } from "react";
import { rateType } from "@constants/mileageForm";

interface MileageListType {
  setTab: Dispatch<SetStateAction<"home" | "addReport">>;
  setFormType: Dispatch<SetStateAction<"waiver" | "km" | null>>;
  setMileagesTab: Dispatch<SetStateAction<"list" | "setMileage">>;
}

export default function MileageList({
  setTab,
  setFormType,
  setMileagesTab,
}: MileageListType) {
  const dispatch = useAppDispatch();
  const { waiverMileageRates, kmMileageRates } = useAppSelector(
    (state) => state.mileage,
  );
  useEffect(() => {
    dispatch(fetchMileageRatesThunk());
  }, []);
  return (
    <div>
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
                {item.label} - {item.amountPerKm}/km - Type :{" "}
                {rateType.find((rt) => rt.value === item.type).name}
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
                {item.label} - {item.amountPerKm}/km - Type :{" "}
                {rateType.find((rt) => rt.value === item.type).name}
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
    </div>
  );
}
