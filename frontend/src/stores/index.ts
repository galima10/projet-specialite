import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/users";
import expensesReportReducer from "./features/expensesReports";
import mileageReducer from "./features/mileages";
import associationReducer from "./features/association";

export const store = configureStore({
  reducer: {
    user: userReducer,
    expensesReport: expensesReportReducer,
    mileage: mileageReducer,
    association: associationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
