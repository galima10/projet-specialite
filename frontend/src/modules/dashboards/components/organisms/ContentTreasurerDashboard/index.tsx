import { useState, useEffect } from "react";
import ExpensesReportsForm from "../../molecules/ExpensesReportsForm";
import UserProfile from "../../molecules/UserProfile";
import { Users } from "@stores/features/users";
import { useAppSelector, useAppDispatch } from "@modules/shared/hooks/redux";
import UsersList from "../../molecules/UsersList";
import { fetchExpensesReportsThunk } from "@stores/thunks/expensesReports";
import { fetchUsersThunk } from "@stores/thunks/users";
import UserReport from "../../molecules/UserReport";
import { ExpensesReport } from "@stores/features/expensesReports";
import AssociationContactManagement from "../../molecules/AssociationContactManagement";

export default function ContentTreasurerDashboard() {
  const [tab, setTab] = useState<
    "home" | "viewProfile" | "addReport" | "viewReport" | "association"
  >("home");
  const [selectedUser, setSelectedUser] = useState<Users>(null);
  const dispatch = useAppDispatch();
  const [formType, setFormType] = useState<{
    type: "create" | "update";
    userId?: number;
  } | null>(null);
  const { users, currentUser } = useAppSelector((state) => state.user);
  const [selectedReport, setSelectedReport] = useState<ExpensesReport | null>(
    null,
  );
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
          <h1 style={{ marginBottom: "1rem" }}>Bienvenu {currentUser.name}</h1>
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
          setSelectedReport={setSelectedReport}
        />
      ) : tab === "addReport" ? (
        <ExpensesReportsForm setTab={setTab} userSelected={selectedUser} />
      ) : tab === "viewReport" ? (
        <UserReport report={selectedReport} setTab={setTab} />
      ) : (
        <AssociationContactManagement setTab={setTab} />
      )}
    </div>
  );
}
