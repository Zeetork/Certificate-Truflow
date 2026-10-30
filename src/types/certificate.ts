export type CertificateType =
  | "valve-functional-test"
  | "material-hydro-test"
  | "material-test"
  | "hydro-test"
  | "final-dimensional-report"
  | "warranty-certificate"
  | "painting-report";

export type CertificateStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "REJECTED"
  | "APPROVED";

export interface CustomField {
  id: string;
  name: string;
  value: string;
  result?: string;
}

export interface SectionCustomFields {
  [sectionKey: string]: CustomField[];
}

export interface EquipmentParameterField {
  id: string;
  label: string;
  value: string;
  enabled: boolean;
}

export interface PneumaticStrokeItem {
  id: string;
  strokeNumber?: number;
  openTime: string;
  closeTime: string;
  result: string;
  remarks: string;
}

export interface SovElectricalTestItem {
  method: string;
  media: string;
  voltage: string;
  openTime: string;
  closeTime: string;
  result: string;
  remarks: string;
}

export interface ValveFunctionalTestLineItem {
  id?: string;
  sNo: number | string;
  tagNo: string;
  actuatorSerialNo?: string;

  // Stroke cycles (Stroke 1, 2, 3)
  stroke1Open?: string;
  stroke1Close?: string;
  stroke2Open?: string;
  stroke2Close?: string;
  stroke3Open?: string;
  stroke3Close?: string;

  // Overall valve test result
  valveFunction?: string;

  // Optional specifications (inherited from product group or overridden per item)
  valveType?: string;
  valveSize?: string;
  moc?: string;
  endConnection?: string;
  actType?: string;
  model?: string;
  failPosition?: string;

  // Accessories with select/ignore checkboxes
  hasLsb?: boolean;
  lsbModelNo?: string;
  lsbFunction?: string;

  hasSov?: boolean;
  sovModelNo?: string;
  sovFunction?: string;

  hasPositioner?: boolean;
  posinier?: string;
  poFunction?: string;

  hasAfr?: boolean;
  afrModelNo?: string;
  afrFunction?: string;
}

export interface ValveFunctionalTestProductGroup {
  id: string;
  groupName?: string;
  valveType: string;
  valveSize: string;
  endConnection: string;
  pressureRating?: string;
  moc?: string;
  actType: string;
  actuatorModel: string;
  failPosition: string;

  // Accessories with select/ignore checkboxes
  hasLsb?: boolean;
  lsbModelNo?: string;
  lsbFunction?: string;

  hasSov?: boolean;
  sovModelNo?: string;
  sovFunction?: string;

  hasPositioner?: boolean;
  posinier?: string;
  poFunction?: string;

  hasAfr?: boolean;
  afrModelNo?: string;
  afrFunction?: string;

  // Common Functional results
  hasValve?: boolean;
  valveFunction?: string;
  hasActuator?: boolean;
  actuatorFunction?: string;
  valveAssemblyFunction?: string;

  // Line items for this group (max 15 per page in PDF)
  items: ValveFunctionalTestLineItem[];
}

export interface ValveFunctionalTestCertificateData {
  customerName: string;
  customerPO: string;
  salesOrderNo: string;
  placeOfTest?: string;
  dateOfTest: string;
  testedBy: string;

  // Identical Product Groups (each group contains its shared specifications and items)
  productGroups?: ValveFunctionalTestProductGroup[];

  // Flat line items array (kept synchronized for backward compatibility and search)
  lineItems: ValveFunctionalTestLineItem[];

  declarationText?: string;
  companyName?: string;
  companyAddress?: string;

  // Signatures
  witnessedBy?: string;
  verifiedBy?: string;
  witnessSignatureUrl?: string;
  verifiedSignatureUrl?: string;
  showSignatures?: boolean;
  status?: string;

  // Custom fields
  customFields?: SectionCustomFields;

  // Legacy fields for backward compatibility
  equipmentParameters?: EquipmentParameterField[];
  valveType?: string;
  valveSizeAndClass?: string;
  valveOperation?: string;
  pneumaticMedia?: string;
  pneumaticPressure?: string;
  pneumaticStrokes?: PneumaticStrokeItem[];
  sovElectricalTest?: SovElectricalTestItem;
}

export interface MaterialHydroPressureTestItem {
  id: string;
  name: string;
  enabled: boolean;
  pressure: string;
  duration: string;
  results: string;
}

export interface MaterialHydroLineItem {
  id?: string;
  itemNo: number | string;
  description: string;
  qty: string;
  classPn: string;
  inchDn: string;
  mmDn: string;
  serialNo: string;
  ends: string;
  body: string;
  disc: string;
  shaft: string;
  seat: string;
  glandSeal: string;
}

export interface MaterialHydroChemicalItem {
  id?: string;
  partName: string;
  bodyHeatNo: string;
  qty: string;
  material: string;
  // Chemical Composition %
  c?: string;
  si?: string;
  mn?: string;
  p?: string;
  s?: string;
  cr?: string;
  mo?: string;
  ni?: string;
  cu?: string;
  v?: string;
  other1?: string;
  other2?: string;
  ce?: string;
  // Mechanical Properties
  tsMpa?: string;
  ysMpa?: string;
  elPercent?: string;
  raPsi?: string;
  hardn?: string;
  impactTestTemp?: string;
}

export interface MaterialHydroTestCertificateData {
  // Order Details
  customerName: string;
  poNo: string;
  projectName: string;
  date: string;
  productType: string;
  testingStd: string;
  fToFStd: string;
  certificateNumber?: string;
  design: string;
  mfgStd: string;
  endsStd: string;
  gadNo: string;

  // Pressure Test & Inspection
  testAccordingTo: string;
  tests: {
    shellHydro: MaterialHydroPressureTestItem;
    seatHydro: MaterialHydroPressureTestItem;
    seatAir: MaterialHydroPressureTestItem;
    backSeatHydro: MaterialHydroPressureTestItem;
  };
  dimensionalInspection: string;
  visualInspection: string;
  operationalInspection: string;

  // Description / Material Line Items
  lineItems: MaterialHydroLineItem[];

  // Chemical Composition & Mechanical Properties Rows
  materialItems: MaterialHydroChemicalItem[];

  // Signatures
  preparedBy?: string;
  preparedSignatureUrl?: string;
  witnessedBy?: string;
  witnessSignatureUrl?: string;
  reviewedBy?: string;
  reviewedSignatureUrl?: string;
  approvedBy?: string;
  approvedSignatureUrl?: string;
  sealStampUrl?: string;
  showSignatures?: boolean;
  showStamp?: boolean;
  status?: string;

  // Custom fields
  customFields?: SectionCustomFields;
}

export interface MaterialTestCertificateData {
  // Order Details
  customerName: string;
  poNo: string;
  projectName: string;
  date: string;
  productType: string;
  testingStd: string;
  fToFStd: string;
  certificateNumber?: string;
  design: string;
  mfgStd: string;
  endsStd: string;
  gadNo: string;

  // Description / Material Line Items
  lineItems: MaterialHydroLineItem[];

  // Chemical Composition & Mechanical Properties Rows
  materialItems: MaterialHydroChemicalItem[];

  // Signatures
  preparedBy?: string;
  preparedSignatureUrl?: string;
  witnessedBy?: string;
  witnessSignatureUrl?: string;
  reviewedBy?: string;
  reviewedSignatureUrl?: string;
  approvedBy?: string;
  approvedSignatureUrl?: string;
  sealStampUrl?: string;
  showSignatures?: boolean;
  showStamp?: boolean;
  status?: string;

  // Custom fields
  customFields?: SectionCustomFields;
}

export interface HydroTestCertificateData {
  // Order Details
  customerName: string;
  poNo: string;
  projectName: string;
  date: string;
  productType: string;
  testingStd: string;
  fToFStd: string;
  certificateNumber?: string;
  design: string;
  mfgStd: string;
  endsStd: string;
  gadNo: string;

  // Pressure Test & Inspection
  testAccordingTo: string;
  tests: {
    shellHydro: MaterialHydroPressureTestItem;
    seatHydro: MaterialHydroPressureTestItem;
    seatAir: MaterialHydroPressureTestItem;
    backSeatHydro: MaterialHydroPressureTestItem;
  };
  dimensionalInspection: string;
  visualInspection: string;
  operationalInspection: string;

  // Remarks / notes
  remarks?: string;

  // Signatures
  preparedBy?: string;
  preparedSignatureUrl?: string;
  witnessedBy?: string;
  witnessSignatureUrl?: string;
  reviewedBy?: string;
  reviewedSignatureUrl?: string;
  approvedBy?: string;
  approvedSignatureUrl?: string;
  sealStampUrl?: string;
  showSignatures?: boolean;
  showStamp?: boolean;
  status?: string;

  // Custom fields
  customFields?: SectionCustomFields;
}

export interface DimensionalReportColumn {
  id: string;
  label: string;
  referenceValue?: string;
  width?: string;
}

export interface DimensionalReportRow {
  id: string;
  valveSerialNo: string;
  values: Record<string, string>;
  remarks?: string;
}

export interface FinalDimensionalReportCertificateData {
  // Document and Order details
  customerName: string;
  customerPO?: string;
  salesOrderNo?: string;
  date: string;
  certificateNumber?: string;

  // Header meta fields (aligned section next to header)
  size: string;
  quantity: string;
  approvedGadNo: string;
  itemDescription: string;
  dimensionUnitText: string;

  // Configurable dynamic columns (CRUD & reorderable)
  columns: DimensionalReportColumn[];

  // Inspected valve measurements rows
  rows: DimensionalReportRow[];

  // Signatures & Declaration (like Valve Functional Report)
  declarationText?: string;
  companyName?: string;
  companyAddress?: string;
  preparedBy?: string;
  preparedSignatureUrl?: string;
  witnessedBy?: string;
  witnessSignatureUrl?: string;
  approvedBy?: string;
  approvedSignatureUrl?: string;
  verifiedBy?: string;
  verifiedSignatureUrl?: string;
  showSignatures?: boolean;
  status?: string;

  // Custom fields
  customFields?: SectionCustomFields;
}

export interface WarrantyCertificateItem {
  id?: string;
  sNo: number | string;
  description: string;
  quantity?: string;
  tagNo?: string;
  size?: string;
  remarks?: string;
}

export interface WarrantyCertificateData {
  // Metadata & Order Reference
  customerName: string;
  salesOrderNo: string; // SO no / Our Job Ref No
  customerPO: string;   // PO No
  poDate: string;       // PO Date (e.g. 29.09.2025 or 10.09.2026)
  customerPODate?: string;
  certificateNumber?: string;
  date: string;         // Certificate date (e.g. 30.01.2026)
  certificateDate?: string;
  place: string;        // e.g. "Coimbatore"

  // Product description & items
  productDescription: string; // Summary string e.g. "1. Gate Valve - 6\" 1no's"
  lineItems?: WarrantyCertificateItem[];

  // Terms & Content
  salutation: string;   // e.g. "Dear Sir," or "To whom so here it may concern,"
  poConfirmationText?: string;
  declarationText?: string;
  warrantyPeriod?: string;
  warrantyTermsText?: string;
  termsOfWarranty?: string[];
  warrantyPeriodSupply?: string;        // e.g. "18 months from the date of invoice" / "18 months from the date of supply"
  warrantyPeriodInstallation?: string;  // e.g. "12 months from the date of installation"
  warrantyNoteText?: string;            // Exclusions note
  closingText?: string;                 // Closing courtesy sentence
  coverageDeclaration?: string;         // "This certificate confirms warranty coverage in accordance with standard TruFlow quality management and customer warranty provisions."

  // Signatory & Stamp
  signatoryName?: string;         // e.g. "Elavarasan.K"
  signatoryDesignation?: string;  // e.g. "Authorized Signatory"
  signatoryCompany?: string;      // e.g. "Truflow Solutions Pvt Ltd"
  witnessedBy?: string;           // For SignatorySelector compatibility
  witnessSignatureUrl?: string;   // For digital signature URL
  sealStampUrl?: string;          // For Truflow seal stamp
  showSignatures?: boolean;
  showStamp?: boolean;
  status?: string;

  // Company Details for footer
  companyName?: string;
  companyAddress?: string;
  companyWebsite?: string;
  companyEmail?: string;
  gstNo?: string;

  // Custom fields
  customFields?: SectionCustomFields;
}


export interface AtmosphericConditionRow {
  id: string;
  dateTime: string;
  process: string;
  dryBulbTemp: string;
  wetBulbTemp: string;
  dewPoint: string;
  rh: string;
  steelTemp: string;
}

export interface PaintingCoatItem {
  id: string;
  coatName: string;
  appliedCoat: string;
  applicationMethod: string;
  paintMfgName: string;
  productName: string;
  colourShade: string;
  dftRequired: string;
  dftObserved: string;
}

export interface PaintingReportCertificateData {
  recNo?: string;
  reportNo?: string;
  certificateNo?: string;
  date?: string;
  location?: string;
  customerName: string;
  customerPO: string;
  jobType?: string;
  valveType?: string;
  valveSize?: string;
  colourShade: string;
  tagNo: string;
  atmosphericConditionAtWorkSite: string;
  qty: string;

  atmosphericConditions: AtmosphericConditionRow[];

  abrasiveCleaning: string;
  abrasiveCheckedForCleanliness: string;
  dustLevel: string;
  specifiedStandard: string;
  profileThicknessRequired: string;
  surfaceCleanliness: string;
  observed: string;

  paintingSystemHeader?: string;
  coats: PaintingCoatItem[];

  pullOffTestRequired?: string;
  pullOffTestActual?: string;
  pullOffTestLocation?: string;

  adhesionTestRequired?: string;
  adhesionTestActual?: string;
  adhesionTestLocation?: string;

  instrumentUsed: string;
  calibrationOfInstruments: string;
  inspectionComments: string;

  declarationText?: string;

  preparedBy: string;
  preparedDesignation?: string;
  preparedSignatureUrl?: string;

  reviewedBy: string;
  reviewedDesignation?: string;
  reviewedSignatureUrl?: string;

  approvedBy: string;
  approvedDesignation?: string;
  approvedSignatureUrl?: string;

  sealStampUrl?: string;
  showSignatures?: boolean;
  showStamp?: boolean;

  companyName?: string;
  companyAddress?: string;
  companyWebsite?: string;
  companyEmail?: string;
  gstNo?: string;
}

export type AnyCertificateData =
  | ValveFunctionalTestCertificateData
  | MaterialHydroTestCertificateData
  | MaterialTestCertificateData
  | HydroTestCertificateData
  | FinalDimensionalReportCertificateData
  | WarrantyCertificateData
  | PaintingReportCertificateData;

export type CertificateErrors = Record<string, string>;

export interface AuditEntry {
  action: string;
  performedBy: unknown;
  performedByName: string;
  performedAt: Date | string;
  note?: string;
}

export interface ApprovalRecord {
  userId: unknown;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedAt?: Date | string;
  note?: string;
  userName?: string;
  userEmail?: string;
}

export interface CertificateApproval {
  requiredApprovers: unknown[];
  approvals: ApprovalRecord[];
}

export interface CertificateCreator {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface ICertificate {
  _id: string;
  certificateNumber: string;
  lastCertificateNumber?: string;
  pageCount?: number;
  certificateType: CertificateType;
  revision: number;
  parentCertificateId?: string;
  status: CertificateStatus;
  createdBy: CertificateCreator | { _id?: string; name?: string; email?: string };
  updatedBy?: CertificateCreator | { _id?: string; name?: string; email?: string };
  submittedAt?: Date | string;
  approvedAt?: Date | string;
  certificateData: AnyCertificateData | Record<string, unknown>;
  approval?: CertificateApproval;
  approvalHistory: AuditEntry[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
