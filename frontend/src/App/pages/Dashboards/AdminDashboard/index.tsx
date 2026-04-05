import { useState, useEffect } from "react";
import UsersList from "@modules/dashboards/components/organisms/UsersList";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import { fetchUsersThunk } from "@stores/thunks/users";
import { Users } from "@stores/features/users";
import UserProfile from "@modules/dashboards/components/organisms/UserProfile";
import ExpensesReportsForm from "@modules/dashboards/components/organisms/ExpensesReportsForm";
import { fetchExpensesReportsThunk } from "@stores/thunks/expensesReports";
import UserForm from "@modules/dashboards/components/molecules/UserForm";
import MileagesManagement from "@modules/dashboards/components/organisms/MileagesManagement";
import AssociationContactManagement from "@modules/dashboards/components/organisms/AssociationContactManagement";

export default function AdminDashboard() {
  const [tab, setTab] = useState<
    | "home"
    | "viewProfile"
    | "addReport"
    | "setUser"
    | "mileagesManagement"
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
          <h1 style={{ marginBottom: "2rem" }}>Dashboard admin</h1>
          <button
            className="secondary"
            onClick={() => setTab("mileagesManagement")}
          >
            Voir les barèmes
          </button>
          <UsersList
            users={users}
            setSelectedUser={setSelectedUser}
            setTab={setTab}
            setFormType={setFormType}
            currentUser={currentUser}
          />
        </>
      ) : tab === "viewProfile" ? (
        <UserProfile
          user={selectedUser}
          setTab={setTab}
          expensesReports={expensesReports}
          setFormType={setFormType}
          currentUser={currentUser}
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
      ) : (
        <AssociationContactManagement setTab={setTab} />
      )}
    </div>
  );
}
