import { ChangeEvent } from "react";
import styles from "./CheckboxField.module.scss";

interface CheckboxFieldProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  checked: boolean;
  id: string;
  placeholder?: string;
}

export default function CheckboxField({
  handleInputChange,
  label,
  id,
  checked,
}: CheckboxFieldProps) {
  return (
    <div className={styles.checkbox}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleInputChange}
      />
    </div>
  );
}
