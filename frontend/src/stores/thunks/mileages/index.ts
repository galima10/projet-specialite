import { createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;
import { API_ROUTES } from "@constants/apiroute";
import type { WithRequiredId } from "@app-types/WithRequiredId";

import type { MileageRate } from "@stores/features/mileages";
import { ROUTES } from "@constants/route";

export const fetchMileageRatesThunk = createAsyncThunk<
  {
    waiverRates: WithRequiredId<MileageRate>[];
    kmRates: WithRequiredId<MileageRate>[];
  },
  void
>("mileage/fetchMileageRates", async () => {
  const res = await fetch(`${API_URL}${API_ROUTES.MILEAGE_RATES}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error fetch mileage rates");
  const data = await res.json();
  const kmRates: WithRequiredId<MileageRate>[] = data["kmMileageRates"];
  const waiverRates: WithRequiredId<MileageRate>[] = data["waiverMileageRates"];

  return {
    waiverRates,
    kmRates,
  };
});

export const createMileageRateThunk = createAsyncThunk<
  {
    data: WithRequiredId<MileageRate>;
    type: "KM" | "WAIVER";
  },
  {
    newMileage: MileageRate;
    type: "KM" | "WAIVER";
  }
>(
  "mileage/createMileageRate",
  async ({
    newMileage,
    type,
  }: {
    newMileage: MileageRate;
    type: "KM" | "WAIVER";
  }) => {
    const res = await fetch(
      `${API_URL}${API_ROUTES.MILEAGE_RATES}/${type.toLowerCase()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          label: newMileage.label,
          amountPerKm: newMileage.amountPerKm,
          type: newMileage.type,
        }),
      },
    );
    if (!res.ok) throw new Error("Error create rate");
    const data: WithRequiredId<MileageRate> = await res.json();
    return {
      data,
      type,
    };
  },
);

export const deleteMileageRateThunk = createAsyncThunk<
  { rateId: number; type: "KM" | "WAIVER" },
  { rateId: number; type: "KM" | "WAIVER" }
>(
  "mileage/deleteMileageRate",
  async ({ rateId, type }: { rateId: number; type: "KM" | "WAIVER" }) => {
    const res = await fetch(
      `${API_URL}${API_ROUTES.MILEAGE_RATES}/${type.toLowerCase()}/${rateId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error(`Erreur lors de la suppression : ${res.status}`);
    }
    return { rateId, type };
  },
);
