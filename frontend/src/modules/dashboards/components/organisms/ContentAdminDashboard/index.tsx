import { useState, useEffect } from "react";
import UsersList from "../../molecules/UsersList";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { fetchUsersThunk } from "@stores/thunks/users";
import { Users } from "@stores/features/users";
import UserProfile from "../../molecules/UserProfile";
import ExpensesReportsForm from "../../molecules/ExpensesReportsForm";
import { fetchExpensesReportsThunk } from "@stores/thunks/expensesReports";
import UserForm from "../../molecules/UserForm";
import MileagesManagement from "../../molecules/MileagesManagement";
import UserReport from "../../molecules/UserReport";
import { ExpensesReport } from "@stores/features/expensesReports";
import AssociationContactManagement from "../../molecules/AssociationContactManagement";

export default function ContentAdminDashboard() {
  const [tab, setTab] = useState<
    | "home"
    | "viewProfile"
    | "addReport"
    | "setUser"
    | "mileagesManagement"
    | "viewReport"
    | "association"
  >("home");
  const [formType, setFormType] = useState<{
    type: "create" | "update";
    userId?: number;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<Users>(null);
  const dispatch = useAppDispatch();
  const { users, currentUser } = useAppSelector((state) => state.user);
  const { expensesReports } = useAppSelector((state) => state.expensesReport);
  const [selectedReport, setSelectedReport] = useState<ExpensesReport | null>(
    null,
  );
  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(fetchUsersThunk());
    }
    if (!expensesReports || expensesReports.length === 0) {
      dispatch(fetchExpensesReportsThunk());
    }
  }, []);
  return (
    <div>
      {tab === "home" ? (
        <>
          <button onClick={() => setTab("mileagesManagement")}>
            Voir les barèmes
          </button>
          <UsersList
            users={users}
            setSelectedUser={setSelectedUser}
            setTab={setTab}
            setFormType={setFormType}
          />
        </>
      ) : tab === "viewProfile" ? (
        <UserProfile
          user={selectedUser}
          setTab={setTab}
          expensesReports={expensesReports}
          setFormType={setFormType}
          currentUser={currentUser}
          setSelectedReport={setSelectedReport}
        />
      ) : tab === "addReport" ? (
        <ExpensesReportsForm setTab={setTab} userSelected={selectedUser} />
      ) : tab === "setUser" ? (
        <UserForm
          type={formType.type}
          setTab={setTab}
          users={users}
          userId={formType.userId}
          currentUser={currentUser}
        />
      ) : tab === "mileagesManagement" ? (
        <MileagesManagement setTab={setTab} />
      ) : tab === "viewReport" ? (
        <UserReport report={selectedReport} setTab={setTab} />
      ) : <AssociationContactManagement setTab={setTab} />}
    </div>
  );
}
