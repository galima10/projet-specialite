import { createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;
import { API_ROUTES } from "@constants/apiroute";
import type { WithRequiredId } from "@app-types/WithRequiredId";

import type { MileageRate } from "@stores/features/mileages";

export const fetchMileageRatesThunk = createAsyncThunk<
  {
    waiverRates: WithRequiredId<MileageRate>[];
    kmRates: WithRequiredId<MileageRate>[];
  },
  void
>("mileage/fetchMileageRates", async () => {
  const resWaiverRates = await fetch(
    `${API_URL}${API_ROUTES.WAIVER_MILEAGE_RATES}`,
    { credentials: "include" },
  );
  const resKmRates = await fetch(`${API_URL}${API_ROUTES.KM_MILEAGE_RATES}`, {
    credentials: "include",
  });

  if (!resWaiverRates.ok || !resKmRates.ok)
    throw new Error("Error fetch mileage rates");
  const waiverRates: WithRequiredId<MileageRate>[] =
    await resWaiverRates.json();
  const kmRates: WithRequiredId<MileageRate>[] = await resKmRates.json();
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
    let ROUTE = null;
    if (type === "KM") ROUTE = API_ROUTES.KM_MILEAGE_RATES;
    else ROUTE = API_ROUTES.WAIVER_MILEAGE_RATES;
    if (!ROUTE) throw new Error("Route not exists");
    const res = await fetch(`${API_URL}${ROUTE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        label: newMileage.label,
        amountPerKm: newMileage.amountPerKm,
      }),
    });
    if (!res.ok) throw new Error("Error create rate");
    const data: WithRequiredId<MileageRate> = await res.json();
    return {
      data,
      type,
    };
  },
);

export const updateMileageRateThunk = createAsyncThunk<
  {
    data: WithRequiredId<MileageRate>;
    type: "KM" | "WAIVER";
  },
  {
    newMileage: MileageRate;
    type: "KM" | "WAIVER";
  }
>(
  "mileage/updateMileageRate",
  async ({
    newMileage,
    type,
  }: {
    newMileage: WithRequiredId<MileageRate>;
    type: "KM" | "WAIVER";
  }) => {
    let ROUTE = null;
    if (type === "KM") ROUTE = API_ROUTES.KM_MILEAGE_RATES;
    else ROUTE = API_ROUTES.WAIVER_MILEAGE_RATES;
    if (!ROUTE) throw new Error("Route not exists");
    const res = await fetch(`${API_URL}${ROUTE}/${newMileage.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        label: newMileage.label,
        amountPerKm: newMileage.amountPerKm,
      }),
    });
    if (!res.ok) throw new Error("Error update rate");
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
    let ROUTE = null;
    if (type === "KM") ROUTE = API_ROUTES.KM_MILEAGE_RATES;
    else ROUTE = API_ROUTES.WAIVER_MILEAGE_RATES;
    if (!ROUTE) throw new Error("Route not exists");
    const res = await fetch(`${API_URL}${ROUTE}/${rateId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Erreur lors de la suppression : ${res.status}`);
    }
    return { rateId, type };
  },
);
