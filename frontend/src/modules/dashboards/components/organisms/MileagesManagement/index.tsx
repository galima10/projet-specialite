import styles from "./MileagesManagement.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import MileageForm from "../../molecules/MileageForm";
import MileageList from "../../molecules/MileageList";

export default function MileagesManagement({
  setTab,
}: {
  setTab: Dispatch<SetStateAction<"home" | "addReport">>;
}) {
  const [mileagesTab, setMileagesTab] = useState<"list" | "setMileage">("list");
  const [formType, setFormType] = useState<"waiver" | "km" | null>(null);

  return (
    <div className={styles.mileage}>
      {mileagesTab === "list" ? (
        <MileageList
          setTab={setTab}
          setFormType={setFormType}
          setMileagesTab={setMileagesTab}
        />
      ) : (
        <MileageForm setMileagesTab={setMileagesTab} formType={formType} />
      )}
    </div>
  );
}
