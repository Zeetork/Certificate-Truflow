import {
  AnyCertificateData,
  CertificateErrors,
  CertificateType,
  ValveFunctionalTestCertificateData,
} from "@/types/certificate";

export const FIELD_LABELS: Record<string, string> = {
  customerName: "Customer Name",
  salesOrderNo: "Sales Order No",
  customerPO: "Customer PO",
  dateOfTest: "Date of Test",
  placeOfTest: "Place of Test",
  testedBy: "Tested By",
  poNo: "PO No",
  date: "Date",
  productType: "Product Type",
};

export function validateCertificate(
  inputData: AnyCertificateData | Record<string, unknown>,
  _certificateType?: CertificateType | string
): {
  isValid: boolean;
  errors: CertificateErrors;
  firstErrorField?: string;
  missingFieldsList?: string[];
} {
  const d = inputData as Record<string, any>;
  const errors: CertificateErrors = {};

  if (!d.customerName || !String(d.customerName).trim()) {
    errors.customerName = "Customer name is required";
  }

  const errorKeys = Object.keys(errors);
  return {
    isValid: errorKeys.length === 0,
    errors,
    firstErrorField: errorKeys.length > 0 ? errorKeys[0] : undefined,
    missingFieldsList: errorKeys.map((k) => FIELD_LABELS[k] || k),
  };
}
