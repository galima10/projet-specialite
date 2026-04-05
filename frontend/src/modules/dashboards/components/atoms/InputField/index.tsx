import { ChangeEvent } from "react";
import styles from "./InputField.module.scss";

interface InputFieldProps {
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement, Element>,
    isExpense?: boolean,
  ) => void;
  label: string;
  type: string;
  id: string;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  defaultValue?: string | number;
  value?: string | number;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  step?: string;
  error?: string | null;
}

export default function InputField({
  handleInputChange,
  label,
  type,
  id,
  placeholder,
  name,
  disabled,
  defaultValue,
  onBlur,
  min,
  step,
  value,
  error
}: InputFieldProps) {
  return (
    <div className={`${styles.input} ${disabled && "disabled"}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={handleInputChange}
        defaultValue={defaultValue}
        onBlur={onBlur}
        min={min}
        step={step}
        value={value}
      />
      {error && (
        <p className="error">
          <small>{error}</small>
        </p>
      )}
    </div>
  );
}
