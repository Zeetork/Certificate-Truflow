import {
  ValveFunctionalTestCertificateData,
  MaterialHydroTestCertificateData,
  MaterialTestCertificateData,
  HydroTestCertificateData,
  FinalDimensionalReportCertificateData,
  WarrantyCertificateData,
  DimensionalReportColumn,
} from "@/types/certificate";

export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return "-";
  // If already formatted like DD-MM-YYYY or DD.MM.YYYY
  if (/^\d{2}[-.]\d{2}[-.]\d{4}$/.test(dateStr.trim())) {
    return dateStr.trim().replace(/\./g, "-");
  }
  // If YYYY-MM-DD
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }
  return dateStr;
}

export function formatPoDate(dateStr?: string): string {
  if (!dateStr) return "";
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr.trim())) {
    return dateStr.trim();
  }
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day}.${month}.${year}`;
  }
  return dateStr;
}

export function formatVoltageCriteria(voltage: string): string {
  if (!voltage) return "24V DC";
  return voltage.replace(/\s+V\s+/, "V ");
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const DEFAULT_CERTIFICATE_DATA: ValveFunctionalTestCertificateData = {
  customerName: "",
  customerPO: "",
  salesOrderNo: "",
  placeOfTest: "Coimbatore",
  dateOfTest: getTodayIsoDate(),
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
  lineItems: [],
};

export const SAMPLE_CERTIFICATE_DATA: ValveFunctionalTestCertificateData = {
  customerName: "Armatury Bauen Olomouc Controls Private Limited",
  customerPO: "PO00900",
  salesOrderNo: "TIS26270145",
  placeOfTest: "Coimbatore",
  dateOfTest: "2026-09-14",
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
};

export const DEFAULT_MATERIAL_HYDRO_DATA: MaterialHydroTestCertificateData = {
  customerName: "",
  poNo: "10053152",
  projectName: "",
  date: getTodayIsoDate(),
  productType: "Ball Valve",
  testingStd: "API 598",
  fToFStd: "API 609 / ASME B16.10",
  certificateNumber: "",
  design: "Offset / High Performance",
  mfgStd: "API 609A / BS 5155 / IS 3095",
  endsStd: "ASME B16.5",
  gadNo: "",
  testAccordingTo: "API 598",
  tests: {
    shellHydro: {
      id: "shell-hydro",
      name: "SHELL TEST (HYDROSTATIC)",
      enabled: true,
      pressure: "30",
      duration: "15",
      results: "Zero Leak - Accepted",
    },
    seatHydro: {
      id: "seat-hydro",
      name: "SEAT TEST (HYDROSTATIC)",
      enabled: false,
      pressure: "-",
      duration: "-",
      results: "-",
    },
    seatAir: {
      id: "seat-air",
      name: "SEAT TEST (AIR)",
      enabled: false,
      pressure: "-",
      duration: "-",
      results: "-",
    },
    backSeatHydro: {
      id: "back-seat-hydro",
      name: "BACK SEAT TEST (HYDROSTATIC)",
      enabled: false,
      pressure: "-",
      duration: "-",
      results: "-",
    },
  },
  dimensionalInspection: "OK",
  visualInspection: "OK",
  operationalInspection: "OK",
  lineItems: [
    {
      id: "mh-item-1",
      itemNo: 1,
      description: "TRIPLE OFFSET BUTTERFLY VALVE",
      qty: "1",
      classPn: "150#",
      inchDn: "2\"",
      mmDn: "50",
      serialNo: "TF-2401",
      ends: "WAFER",
      body: "WCB",
      disc: "CF8M",
      shaft: "SS410",
      seat: "PTFE",
      glandSeal: "GRAPHITE",
    },
  ],
  materialItems: [
    {
      id: "mh-mat-1",
      partName: "BODY",
      bodyHeatNo: "H-5120",
      qty: "1",
      material: "ASTM A216 WCB",
      c: "0.22",
      si: "0.45",
      mn: "0.85",
      p: "0.025",
      s: "0.020",
      cr: "0.15",
      mo: "0.04",
      ni: "0.12",
      cu: "0.08",
      v: "0.01",
      other1: "-",
      other2: "-",
      ce: "0.38",
      tsMpa: "510",
      ysMpa: "285",
      elPercent: "24",
      raPsi: "42",
      hardn: "152",
      impactTestTemp: "-",
    },
  ],
  preparedBy: "SIVAGANESHAN.V.A",
  preparedSignatureUrl: "/signature/signature-sivaganeshan.png",
  witnessedBy: "KARTHIKEYAN.A",
  witnessSignatureUrl: "/signature/signature-karthikeyan.jpeg",
  approvedBy: "System Administrator",
  approvedSignatureUrl: "",
};

export const SAMPLE_MATERIAL_HYDRO_DATA: MaterialHydroTestCertificateData = {
  ...DEFAULT_MATERIAL_HYDRO_DATA,
  customerName: "Petrofac International Limited",
  projectName: "Refinery Expansion Project Phase 2",
};

export const DEFAULT_MATERIAL_TEST_DATA: MaterialTestCertificateData = {
  customerName: "",
  poNo: "10053152",
  projectName: "",
  date: getTodayIsoDate(),
  productType: "Ball Valve",
  testingStd: "API 598",
  fToFStd: "API 609 / ASME B16.10",
  certificateNumber: "",
  design: "Offset / High Performance",
  mfgStd: "API 609A / BS 5155 / IS 3095",
  endsStd: "ASME B16.5",
  gadNo: "",
  lineItems: [
    {
      id: "mt-item-1",
      itemNo: 1,
      description: "TRIPLE OFFSET BUTTERFLY VALVE",
      qty: "1",
      classPn: "150#",
      inchDn: "2\"",
      mmDn: "50",
      serialNo: "TF-2401",
      ends: "WAFER",
      body: "WCB",
      disc: "CF8M",
      shaft: "SS410",
      seat: "PTFE",
      glandSeal: "GRAPHITE",
    },
  ],
  materialItems: [
    {
      id: "mt-mat-1",
      partName: "BODY",
      bodyHeatNo: "H-5120",
      qty: "1",
      material: "ASTM A216 WCB",
      c: "0.22",
      si: "0.45",
      mn: "0.85",
      p: "0.025",
      s: "0.020",
      cr: "0.15",
      mo: "0.04",
      ni: "0.12",
      cu: "0.08",
      v: "0.01",
      other1: "-",
      other2: "-",
      ce: "0.38",
      tsMpa: "510",
      ysMpa: "285",
      elPercent: "24",
      raPsi: "42",
      hardn: "152",
      impactTestTemp: "-",
    },
  ],
  preparedBy: "SIVAGANESHAN.V.A",
  preparedSignatureUrl: "/signature/signature-sivaganeshan.png",
  witnessedBy: "KARTHIKEYAN.A",
  witnessSignatureUrl: "/signature/signature-karthikeyan.jpeg",
  approvedBy: "System Administrator",
  approvedSignatureUrl: "",
};

export const DEFAULT_HYDRO_TEST_DATA: HydroTestCertificateData = {
  customerName: "",
  poNo: "10053152",
  projectName: "",
  date: getTodayIsoDate(),
  productType: "Ball Valve",
  testingStd: "API 598",
  fToFStd: "API 609 / ASME B16.10",
  certificateNumber: "",
  design: "Offset / High Performance",
  mfgStd: "API 609A / BS 5155 / IS 3095",
  endsStd: "ASME B16.5",
  gadNo: "",
  testAccordingTo: "API 598",
  tests: {
    shellHydro: {
      id: "shell-hydro",
      name: "SHELL TEST (HYDROSTATIC)",
      enabled: true,
      pressure: "30",
      duration: "15",
      results: "Zero Leak - Accepted",
    },
    seatHydro: {
      id: "seat-hydro",
      name: "SEAT TEST (HYDROSTATIC)",
      enabled: false,
      pressure: "-",
      duration: "-",
      results: "-",
    },
    seatAir: {
      id: "seat-air",
      name: "SEAT TEST (AIR)",
      enabled: false,
      pressure: "-",
      duration: "-",
      results: "-",
    },
    backSeatHydro: {
      id: "back-seat-hydro",
      name: "BACK SEAT TEST (HYDROSTATIC)",
      enabled: false,
      pressure: "-",
      duration: "-",
      results: "-",
    },
  },
  dimensionalInspection: "OK",
  visualInspection: "OK",
  operationalInspection: "OK",
  remarks: "",
  preparedBy: "SIVAGANESHAN.V.A",
  preparedSignatureUrl: "/signature/signature-sivaganeshan.png",
  witnessedBy: "KARTHIKEYAN.A",
  witnessSignatureUrl: "/signature/signature-karthikeyan.jpeg",
  approvedBy: "System Administrator",
  approvedSignatureUrl: "",
};

export const MANUFACTURER_OPTIONS = ["Truflow"];

export const DEFAULT_FINAL_DIMENSIONAL_COLUMNS: DimensionalReportColumn[] = [
  { id: "col-nb", label: "Nominal Bore", referenceValue: "32" },
  { id: "col-ftf", label: "Face-to-Face Length", referenceValue: "255 ± 4" },
  { id: "col-c2c", label: "Center to Cover Height", referenceValue: "169 ± 10" },
  { id: "col-ft", label: "Flange Thickness", referenceValue: "26" },
  { id: "col-od", label: "Flange Outer Diameter (OD)", referenceValue: "155" },
  { id: "col-pcd", label: "Pitch Circle Diameter (PCD)", referenceValue: "110" },
  { id: "col-dh", label: "Drill Hole Diameter", referenceValue: "22" },
  { id: "col-nh", label: "Number of Holes", referenceValue: "4" },
  { id: "col-rfd", label: "Raised Face Diameter", referenceValue: "78" },
  { id: "col-fod", label: "Filter Outer Diameter", referenceValue: "36" },
  { id: "col-fl", label: "Filter Length", referenceValue: "128" },
  { id: "col-dvb", label: "Drain Valve Bore", referenceValue: "11" },
  { id: "col-dvl", label: "Drain Valve Length", referenceValue: "69 ± 1.5" },
  { id: "col-f2d", label: "Filter Btm Face to Drain Valve End Length", referenceValue: "255" },
  { id: "col-dae", label: "Drain Assembly Extension", referenceValue: "170" },
];

export const DEFAULT_FINAL_DIMENSIONAL_REPORT_DATA: FinalDimensionalReportCertificateData = {
  customerName: "",
  customerPO: "",
  salesOrderNo: "",
  date: getTodayIsoDate(),
  certificateNumber: "",
  size: "DN 32 PN 63",
  quantity: "2 No's",
  approvedGadNo: "113101-TU12-DR-MVA-06201",
  itemDescription: "Y - STRAINER",
  dimensionUnitText: "All Dimensions are - mm",
  columns: DEFAULT_FINAL_DIMENSIONAL_COLUMNS,
  rows: [
    {
      id: "row-1",
      valveSerialNo: "2519901001",
      values: {
        "col-nb": "32",
        "col-ftf": "256",
        "col-c2c": "168",
        "col-ft": "27",
        "col-od": "154",
        "col-pcd": "111",
        "col-dh": "21",
        "col-nh": "4",
        "col-rfd": "79",
        "col-fod": "35",
        "col-fl": "129",
        "col-dvb": "12",
        "col-dvl": "70",
        "col-f2d": "256",
        "col-dae": "171",
      },
    },
    {
      id: "row-2",
      valveSerialNo: "2519901002",
      values: {
        "col-nb": "32",
        "col-ftf": "254",
        "col-c2c": "170",
        "col-ft": "25",
        "col-od": "156",
        "col-pcd": "109",
        "col-dh": "23",
        "col-nh": "4",
        "col-rfd": "77",
        "col-fod": "37",
        "col-fl": "127",
        "col-dvb": "10",
        "col-dvl": "68",
        "col-f2d": "254",
        "col-dae": "169",
      },
    },
  ],
  declarationText:
    "This is to certify that the dimensional inspection of the items listed above has been carried out and found to be in accordance with the approved drawing and specifications.",
  companyName: "TRUFLOW AUTOMATION & CONTROLS PRIVATE LIMITED",
  companyAddress:
    "S.F No. 617/ 2H2, Vadakku Thottam, L&T Road, MALUMICHAMPATTI post, Coimbatore- 641021, Tamil Nadu",
  preparedBy: "SIVAGANESHAN.V.A",
  preparedSignatureUrl: "/signature/signature-sivaganeshan.png",
  approvedBy: "KARTHIKEYAN.A",
  approvedSignatureUrl: "/signature/signature-karthikeyan.jpeg",
  showSignatures: true,
};

export const SAMPLE_FINAL_DIMENSIONAL_REPORT_DATA: FinalDimensionalReportCertificateData = {
  ...DEFAULT_FINAL_DIMENSIONAL_REPORT_DATA,
  customerName: "Petrofac International Limited",
  customerPO: "PO-774019",
  salesOrderNo: "TF-22019901",
};

export const DEFAULT_WARRANTY_CERTIFICATE_DATA: WarrantyCertificateData = {
  customerName: "",
  salesOrderNo: "",
  customerPO: "",
  poDate: getTodayIsoDate(),
  certificateNumber: "",
  date: getTodayIsoDate(),
  place: "Coimbatore",
  productDescription: "1. Gate Valve - 6\" 1no's",
  lineItems: [
    {
      id: "item-1",
      sNo: 1,
      description: "Gate Valve - 6\"",
      quantity: "1 No's",
      tagNo: "",
      size: "6\"",
      remarks: "Standard Supply",
    },
  ],
  salutation: "To whom so here it my concern,",
  poConfirmationText: "",
  warrantyTermsText:
    "The products supplied under the above-mentioned Purchase Order are manufactured to the highest standards and in accordance with the specified requirements. We confirm that the products carry a standard warranty period of 18 months from the date of supply or 12 months from the date of installation, whichever is earlier.",
  warrantyPeriodSupply: "18 months from the date of supply",
  warrantyPeriodInstallation: "12 months from the date of installation",
  warrantyNoteText:
    "Note: The warranty is applicable only to manufacturing defects and does not cover normal wear and tear, improper usage, mishandling, or damage caused by improper installation or maintenance.",
  closingText: "",
  coverageDeclaration:
    "This certificate confirms warranty coverage in accordance with standard TruFlow quality management and customer warranty provisions.",
  signatoryName: "Elavarasan.K",
  signatoryDesignation: "Authorized Signatory",
  signatoryCompany: "Truflow Solutions Pvt Ltd",
  witnessedBy: "Elavarasan.K",
  witnessSignatureUrl: "/signature/truflow-signature.png",
  sealStampUrl: "/signature/truflow-seal-stamp.png",
  showSignatures: true,
  showStamp: true,
  companyName: "TRUFLOW SOLUTIONS PRIVATE LIMITED",
  companyAddress:
    "S.F. No-617/2H2, Vadakku Thottam, L&T Road, Malumichampatti, Coimbatore-641 021, Tamil Nadu, India.",
  companyWebsite: "www.truflow.com",
  companyEmail: "sales@truflow.com",
  gstNo: "33AAJCR6720N1Z1",
};

export const SAMPLE_WARRANTY_CERTIFICATE_DATA: WarrantyCertificateData = {
  customerName: "IL & FS TAMILNADU POWER COMPANY LIMITED",
  salesOrderNo: "INS220331",
  customerPO: "4100007629",
  poDate: "2025-09-29",
  certificateNumber: "WC2600001",
  date: "2026-01-30",
  place: "Coimbatore",
  productDescription: "1. Gate Valve - 6\" 1no's",
  lineItems: [
    {
      id: "item-1",
      sNo: 1,
      description: "Gate Valve - 6\"",
      quantity: "1 No's",
      tagNo: "GV-01",
      size: "6\"",
      remarks: "Full Compliance",
    },
  ],
  salutation: "Dear Sir,",
  poConfirmationText:
    "We hereby confirm that the items supplied are in accordance with your Purchase Order No. 4100007629, Date: 29.09.2025.",
  warrantyTermsText:
    "The supplied valves have been manufactured to the highest standards and in full compliance with your specifications. Furthermore, we confirm that the products are warranted for a period of 18 months from the date of invoice or 12 months from the date of installation, whichever occurs earlier.",
  warrantyPeriodSupply: "18 months from the date of invoice",
  warrantyPeriodInstallation: "12 months from the date of installation",
  warrantyNoteText:
    "Note: The warranty is applicable only to manufacturing defects and does not cover normal wear and tear, improper usage, mishandling, or damage caused by improper installation or maintenance.",
  closingText:
    "We trust this meets your requirements. Should you have any further queries or require additional information, please do not hesitate to contact us.",
  coverageDeclaration:
    "This certificate confirms warranty coverage in accordance with standard TruFlow quality management and customer warranty provisions.",
  signatoryName: "Elavarasan.K",
  signatoryDesignation: "Authorized Signatory",
  signatoryCompany: "Truflow Solutions Pvt Ltd",
  witnessedBy: "Elavarasan.K",
  witnessSignatureUrl: "/signature/truflow-signature.png",
  sealStampUrl: "/signature/truflow-seal-stamp.png",
  showSignatures: true,
  showStamp: true,
  companyName: "TRUFLOW SOLUTIONS PRIVATE LIMITED",
  companyAddress:
    "S.F. No-617/2H2, Vadakku Thottam, L&T Road, Malumichampatti, Coimbatore-641 021, Tamil Nadu, India.",
  companyWebsite: "www.truflow.com",
  companyEmail: "sales@truflow.com",
  gstNo: "33AAJCR6720N1Z1",
};
