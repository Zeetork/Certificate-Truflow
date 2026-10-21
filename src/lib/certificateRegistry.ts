import { CertificateType } from "@/types/certificate";
import {
  DEFAULT_MATERIAL_HYDRO_DATA,
  DEFAULT_MATERIAL_TEST_DATA,
  DEFAULT_HYDRO_TEST_DATA,
  DEFAULT_FINAL_DIMENSIONAL_REPORT_DATA,
  DEFAULT_WARRANTY_CERTIFICATE_DATA,
} from "@/lib/certificateDefaults";

export interface CertificateTypeConfig {
  key: CertificateType;
  name: string;
  prefix: string;
  category?: "certificate" | "functional-report";
  image?: string;
  isPdfAsset?: boolean;
  description: string;
  defaultData: Record<string, unknown>;
}

export const CERTIFICATE_TYPES: Record<CertificateType, CertificateTypeConfig> = {
  "valve-functional-test": {
    key: "valve-functional-test",
    name: "Valve Functional Test Report",
    prefix: "VFR",
    category: "functional-report",
    image: "/truflow-logo.png",
    description: "Functional test and operational performance report for valves, actuators, and pneumatic accessories",
    defaultData: {
      customerName: "",
      customerPO: "",
      salesOrderNo: "",
      placeOfTest: "Coimbatore",
      dateOfTest: new Date().toISOString().split("T")[0],
      testedBy: "SIVAGANESHAN.V.A",
      declarationText:
        "This is to certify that the valve listed above has been tested and inspected according to the applicable quality standards.\nIt has passed all specified tests and is compliant with the stated performance and safety requirements.",
      companyName: "TRUFLOW AUTOMATION & CONTROLS PRIVATE LIMITED",
      companyAddress:
        "S.F No. 617/ 2H2, Vadakku Thottam, L&T Road, MALUMICHAMPATTI post, Coimbatore- 641021, Tamil Nadu",
      witnessedBy: "SIVAGANESHAN.V.A",
      verifiedBy: "KARTHIKEYAN.A",
      witnessSignatureUrl: "/signature/signature-sivaganeshan.png",
      verifiedSignatureUrl: "/signature/signature-karthikeyan.jpeg",
      showSignatures: true,
      lineItems: [
        {
          id: "item-1",
          sNo: 1,
          tagNo: "1",
          valveType: "Ball Valve",
          valveSize: "20",
          moc: "WCB Body ss316/PTF",
          endConnection: "Flanged",
          actType: "pneumatic actuator",
          model: "ZRC20SA",
          failPosition: "Fail Close / Fail Open",
          hasLsb: false,
          lsbModelNo: "NA",
          lsbFunction: "Pass/ Fail",
          hasSov: false,
          sovModelNo: "NA",
          sovFunction: "Pass/ Fail",
          hasPositioner: false,
          posinier: "NA",
          poFunction: "Pass/ Fail",
          hasAfr: false,
          afrModelNo: "NA",
          afrFunction: "Pass/ Fail",
          stroke1Open: "0.3 sec",
          stroke1Close: "0.3 sec",
          stroke2Open: "0.3 sec",
          stroke2Close: "0.3 sec",
          stroke3Open: "0.3 sec",
          stroke3Close: "0.3 sec",
          valveFunction: "Pass/ Fail",
        },
      ],
    },
  },
  "material-hydro-test": {
    key: "material-hydro-test",
    name: "Material & Hydro Test Certificate",
    prefix: "MHT",
    category: "certificate",
    image: "/material-hydro-test.png",
    description: "Material & Hydrostatic Pressure Test Certificate according to EN 10204 3.1",
    defaultData: DEFAULT_MATERIAL_HYDRO_DATA as unknown as Record<string, unknown>,
  },
  "material-test": {
    key: "material-test",
    name: "Material Test Certificate",
    prefix: "MTC",
    category: "certificate",
    image: "/material-test.png",
    description: "Material Test Certificate according to EN 10204 3.1 with chemical composition and mechanical properties",
    defaultData: DEFAULT_MATERIAL_TEST_DATA as unknown as Record<string, unknown>,
  },
  "hydro-test": {
    key: "hydro-test",
    name: "Hydro Test Certificate",
    prefix: "HTC",
    category: "certificate",
    image: "/hydro-test.png",
    description: "Hydrostatic & Pneumatic Pressure Test Certificate according to EN 10204 3.1 with inspection results",
    defaultData: DEFAULT_HYDRO_TEST_DATA as unknown as Record<string, unknown>,
  },
  "final-dimensional-report": {
    key: "final-dimensional-report",
    name: "Final Dimensional Report",
    prefix: "FDR",
    category: "certificate",
    image: "/FINAL DIMENSIONAL REPORT.png",
    description: "Final dimensional inspection report with customizable measurement columns and drawing tolerances",
    defaultData: DEFAULT_FINAL_DIMENSIONAL_REPORT_DATA as unknown as Record<string, unknown>,
  },
  "warranty-certificate": {
    key: "warranty-certificate",
    name: "Warranty Certificate",
    prefix: "WC",
    category: "certificate",
    image: "/warranty-certificate.png",
    description: "Standard warranty certificate with customer order metadata, quality confirmation, and warranty terms",
    defaultData: DEFAULT_WARRANTY_CERTIFICATE_DATA as unknown as Record<string, unknown>,
  },
};

export const CERTIFICATE_TYPE_LIST = Object.values(CERTIFICATE_TYPES);

export function getCertificateConfig(type: string): CertificateTypeConfig | undefined {
  return CERTIFICATE_TYPES[type as CertificateType];
}

export function isValidCertificateType(type: string): type is CertificateType {
  return type in CERTIFICATE_TYPES;
}
