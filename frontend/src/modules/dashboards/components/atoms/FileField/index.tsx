import styles from "./FileField.module.scss";
import { ChangeEvent } from "react";

interface FileFieldProps {
  handleDocumentChange: (
    e: ChangeEvent<HTMLInputElement, Element>,
    isExpense?: boolean,
  ) => void;
  label: string;
  id: string;
}

export default function FileField({
  handleDocumentChange,
  label,
  id,
}: FileFieldProps) {
  return (
    <div className={styles.input}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleDocumentChange}
      />
    </div>
  );
}
