"use client";

import {
  CertificateType,
  AnyCertificateData,
  ValveFunctionalTestCertificateData,
  MaterialHydroTestCertificateData,
  MaterialTestCertificateData,
  HydroTestCertificateData,
  FinalDimensionalReportCertificateData,
  WarrantyCertificateData,
  PaintingReportCertificateData,
} from "@/types/certificate";
import { ValveFunctionalTestForm } from "./ValveFunctionalTest/Form";
import { MaterialHydroTestForm } from "./MaterialHydroTest/Form";
import { MaterialTestForm } from "./MaterialTest/Form";
import { HydroTestForm } from "./HydroTest/Form";
import { FinalDimensionalReportForm } from "./FinalDimensionalReport/Form";
import { WarrantyCertificateForm } from "./WarrantyCertificate/Form";
import { PaintingReportForm } from "./PaintingReport/Form";

interface CertificateFormRendererProps {
  certificateType?: CertificateType | string;
  data: AnyCertificateData;
  onChange: (newData: AnyCertificateData) => void;
  errors: Record<string, string>;
  onSaveDraft?: () => void;
  onSubmitForApproval?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  submitLabel?: string;
  onSwitchToPreview?: () => void;
}

export const CertificateFormRenderer: React.FC<CertificateFormRendererProps> = ({
  certificateType,
  data,
  onChange,
  errors,
  onSaveDraft,
  onSubmitForApproval,
  onCancel,
  isSaving,
  submitLabel,
  onSwitchToPreview,
}) => {
  if (certificateType === "painting-report") {
    return (
      <PaintingReportForm
        data={data as PaintingReportCertificateData}
        onChange={(val) => onChange(val)}
        errors={errors}
        onSaveDraft={onSaveDraft}
        onSubmitForApproval={onSubmitForApproval}
        onCancel={onCancel}
        isSaving={isSaving}
        submitLabel={submitLabel}
        onSwitchToPreview={onSwitchToPreview}
      />
    );
  }

  if (certificateType === "final-dimensional-report") {
    return (
      <FinalDimensionalReportForm
        data={data as FinalDimensionalReportCertificateData}
        onChange={(val) => onChange(val)}
        errors={errors}
        onSaveDraft={onSaveDraft}
        onSubmitForApproval={onSubmitForApproval}
        onCancel={onCancel}
        isSaving={isSaving}
        submitLabel={submitLabel}
        onSwitchToPreview={onSwitchToPreview}
      />
    );
  }

  if (certificateType === "material-hydro-test") {
    return (
      <MaterialHydroTestForm
        data={data as MaterialHydroTestCertificateData}
        onChange={(val) => onChange(val)}
        errors={errors}
        onSaveDraft={onSaveDraft}
        onSubmitForApproval={onSubmitForApproval}
        onCancel={onCancel}
        isSaving={isSaving}
        submitLabel={submitLabel}
        onSwitchToPreview={onSwitchToPreview}
      />
    );
  }

  if (certificateType === "material-test") {
    return (
      <MaterialTestForm
        data={data as MaterialTestCertificateData}
        onChange={(val) => onChange(val)}
        errors={errors}
        onSaveDraft={onSaveDraft}
        onSubmitForApproval={onSubmitForApproval}
        onCancel={onCancel}
        isSaving={isSaving}
        submitLabel={submitLabel}
        onSwitchToPreview={onSwitchToPreview}
      />
    );
  }

  if (certificateType === "hydro-test") {
    return (
      <HydroTestForm
        data={data as HydroTestCertificateData}
        onChange={(val) => onChange(val)}
        errors={errors}
        onSaveDraft={onSaveDraft}
        onSubmitForApproval={onSubmitForApproval}
        onCancel={onCancel}
        isSaving={isSaving}
        submitLabel={submitLabel}
        onSwitchToPreview={onSwitchToPreview}
      />
    );
  }

  if (certificateType === "warranty-certificate") {
    return (
      <WarrantyCertificateForm
        data={data as WarrantyCertificateData}
        onChange={(val) => onChange(val)}
        errors={errors}
        onSaveDraft={onSaveDraft}
        onSubmitForApproval={onSubmitForApproval}
        onCancel={onCancel}
        isSaving={isSaving}
        submitLabel={submitLabel}
        onSwitchToPreview={onSwitchToPreview}
      />
    );
  }

  return (
    <ValveFunctionalTestForm
      data={data as ValveFunctionalTestCertificateData}
      onChange={(val) => onChange(val)}
      errors={errors}
      onSaveDraft={onSaveDraft}
      onSubmitForApproval={onSubmitForApproval}
      onCancel={onCancel}
      isSaving={isSaving}
      submitLabel={submitLabel}
      onSwitchToPreview={onSwitchToPreview}
    />
  );
};
