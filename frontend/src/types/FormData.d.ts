export interface FormData {
  userName: string;
  createdAt: string;
  reason: string;
  budget: string;
  amountWaiver: number;
  waiverMileageRate: string;
  kmMileageRate: string;
  reportDocumentFile: File | null;
  expensesList: {
    expenseDate: string;
    object: string;
    km: number;
    transportCost: number;
    othersCost: number;
    documents: { name: string; preview: string; file: File }[] | null;
  }[];
  userIBAN: string;
  userBIC: string;
  signature: string;
}
