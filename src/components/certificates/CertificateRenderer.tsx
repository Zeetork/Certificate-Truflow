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
import { ValveFunctionalTestTemplate } from "./ValveFunctionalTest/Template";
import { MaterialHydroTestTemplate } from "./MaterialHydroTest/Template";
import { MaterialTestTemplate } from "./MaterialTest/Template";
import { HydroTestTemplate } from "./HydroTest/Template";
import { FinalDimensionalReportTemplate } from "./FinalDimensionalReport/Template";
import { WarrantyCertificateTemplate } from "./WarrantyCertificate/Template";
import { PaintingReportTemplate } from "./PaintingReport/Template";

interface CertificateRendererProps {
  certificateType?: CertificateType | string;
  data: AnyCertificateData | Record<string, unknown>;
  certificateNumber?: string;
  revision?: number;
  status?: string;
  activePageIndex?: number;
  showAllPages?: boolean;
  onChange?: (newData: any) => void;
}

export const CertificateRenderer: React.FC<CertificateRendererProps> = ({
  certificateType,
  data,
  certificateNumber,
  revision = 0,
  status,
  activePageIndex,
  showAllPages = true,
  onChange,
}) => {
  if (certificateType === "painting-report") {
    return (
      <PaintingReportTemplate
        data={data as PaintingReportCertificateData}
        certificateNumber={certificateNumber}
        revision={revision}
        status={status}
      />
    );
  }

  if (certificateType === "final-dimensional-report") {
    return (
      <FinalDimensionalReportTemplate
        data={data as FinalDimensionalReportCertificateData}
        certificateNumber={certificateNumber}
        revision={revision}
        status={status}
      />
    );
  }

  if (certificateType === "material-hydro-test") {
    return (
      <MaterialHydroTestTemplate
        data={data as MaterialHydroTestCertificateData}
        certificateNumber={certificateNumber}
        revision={revision}
        status={status}
      />
    );
  }

  if (certificateType === "material-test") {
    return (
      <MaterialTestTemplate
        data={data as MaterialTestCertificateData}
        certificateNumber={certificateNumber}
        revision={revision}
        status={status}
      />
    );
  }

  if (certificateType === "hydro-test") {
    return (
      <HydroTestTemplate
        data={data as HydroTestCertificateData}
        certificateNumber={certificateNumber}
        revision={revision}
        status={status}
      />
    );
  }

  if (certificateType === "warranty-certificate") {
    return (
      <WarrantyCertificateTemplate
        data={data as WarrantyCertificateData}
        certificateNumber={certificateNumber}
        revision={revision}
        status={status}
        onChange={onChange}
      />
    );
  }

  return (
    <ValveFunctionalTestTemplate
      data={data as ValveFunctionalTestCertificateData}
      certificateNumber={certificateNumber}
      revision={revision}
      status={status}
      activePageIndex={activePageIndex}
      showAllPages={showAllPages}
    />
  );
};
