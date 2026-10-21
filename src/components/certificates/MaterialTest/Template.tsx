"use client";

import React from "react";
import {
  MaterialTestCertificateData,
  MaterialHydroLineItem,
  MaterialHydroChemicalItem,
} from "@/types/certificate";
import { formatDisplayDate } from "@/lib/certificateDefaults";

interface MaterialTestTemplateProps {
  data: MaterialTestCertificateData;
  certificateNumber?: string;
  revision?: number;
  status?: string;
}

export const MaterialTestTemplate: React.FC<MaterialTestTemplateProps> = ({
  data,
  certificateNumber,
  status,
}) => {
  const currentStatus = (status || data.status || "DRAFT").toUpperCase();
  const isDraft = currentStatus === "DRAFT" || !currentStatus;
  const isApproved = currentStatus === "APPROVED";

  // Truflow Signatures workflow
  const showPreparedSignature = !isDraft && Boolean(data.preparedSignatureUrl);
  const showWitnessSignature =
    (isApproved || currentStatus === "PENDING_APPROVAL") &&
    Boolean(data.witnessSignatureUrl);
  const showApprovedSignature = isApproved && Boolean(data.approvedSignatureUrl);

  const certNo = certificateNumber || data.certificateNumber || "DRAFT";

  // Ensure items arrays
  const lineItems: MaterialHydroLineItem[] =
    data.lineItems && data.lineItems.length > 0
      ? data.lineItems
      : [
          {
            id: "mt-1",
            itemNo: 1,
            description: "",
            qty: "",
            classPn: "",
            inchDn: "",
            mmDn: "",
            serialNo: "",
            ends: "",
            body: "",
            disc: "",
            shaft: "",
            seat: "",
            glandSeal: "",
          },
        ];

  const materialItems: MaterialHydroChemicalItem[] =
    data.materialItems && data.materialItems.length > 0
      ? data.materialItems
      : [
          {
            id: "mt-mat-1",
            partName: "",
            bodyHeatNo: "",
            qty: "",
            material: "",
            c: "",
            si: "",
            mn: "",
            p: "",
            s: "",
            cr: "",
            mo: "",
            ni: "",
            cu: "",
            v: "",
            other1: "",
            other2: "",
            ce: "",
            tsMpa: "",
            ysMpa: "",
            elPercent: "",
            raPsi: "",
            hardn: "",
            impactTestTemp: "",
          },
        ];

  // Proportional rows to fill the landscape certificate cleanly
  const totalLineRows = Math.max(4, lineItems.length);
  const totalMaterialRows = Math.max(5, materialItems.length);

  return (
    <div
      id="certificate-a4-document"
      data-certificate-page="1"
      data-orientation="landscape"
      className="certificate-a4-page bg-white mx-auto print:m-0 print:p-0 box-border text-black select-text shadow-sm"
      style={{
        width: "1123px",
        minHeight: "794px",
        padding: "16px 20px",
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
      }}
    >
      {/* Outer border box matching reference certificate */}
      <div className="w-full min-h-[762px] border-[1.5px] border-black flex flex-col justify-between p-0 box-border bg-white text-[10px] leading-tight text-black">
        <div>
        {/* ========================================================================= */}
        {/* 1. HEADER (COMPANY INFO | CERTIFICATE TITLE | LOGO)                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-12 border-b-[1.5px] border-black min-h-[92px]">
          {/* Company Details (Left 4 cols) */}
          <div className="col-span-4 p-2.5 border-r border-black flex flex-col justify-center">
            <div className="text-[13px] font-black tracking-tight uppercase text-black">
              TRUFLOW SOLUTIONS PVT. LTD.
            </div>
            <div className="text-[9.5px] leading-tight text-neutral-900 mt-0.5">
              S.F.No.617/2H2, Vadakku Thottam,
            </div>
            <div className="text-[9.5px] leading-tight text-neutral-900">
              Malumichampatti Post Office,
            </div>
            <div className="text-[9.5px] leading-tight text-neutral-900">
              Coimbatore, Tamilnadu, India - 641 021
            </div>
            <div className="text-[9.5px] font-bold text-neutral-900 mt-0.5 tracking-tight">
              GSTN: 33AAJCR6720N1Z1
            </div>
          </div>

          {/* Certificate Title & Standard (Center 5 cols) */}
          <div className="col-span-5 p-2.5 border-r border-black flex flex-col items-center justify-center text-center">
            <h1 className="text-[17px] font-black tracking-normal uppercase text-black">
              Material Test Certificate
            </h1>
            <div className="text-[11px] font-semibold text-neutral-800 mt-1">
              (According to EN 10204 3.1)
            </div>
          </div>

          {/* Brand Logo (Right 3 cols) */}
          <div className="col-span-3 p-2.5 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/truflow-logo.png"
              alt="Truflow Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ORDER DETAILS GRID (3 ROWS x 4 COLUMNS)                                */}
        {/* ========================================================================= */}
        <table className="w-full table-fixed border-collapse border-b-[1.5px] border-black text-[10px]">
          <colgroup>
            <col style={{ width: "35%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <tbody>
            <tr className="border-b border-black">
              <td className="p-1 px-2 border-r border-black truncate">
                <span className="font-bold">Customer Name : </span>
                <span className="font-normal uppercase text-neutral-900">
                  {data.customerName || ""}
                </span>
              </td>
              <td className="p-1 px-2 border-r border-black truncate">
                <span className="font-bold">PO NO : </span>
                <span className="font-normal uppercase text-neutral-900">
                  {data.poNo || ""}
                </span>
              </td>
              <td className="p-1 px-2 border-r border-black truncate">
                <span className="font-bold">Project Name : </span>
                <span className="font-normal uppercase text-neutral-900">
                  {data.projectName || ""}
                </span>
              </td>
              <td className="p-1 px-2 truncate">
                <span className="font-bold">Date : </span>
                <span className="font-normal uppercase text-neutral-900">
                  {formatDisplayDate(data.date)}
                </span>
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="p-1 px-2 border-r border-black truncate">
                <span className="font-bold">PRODUCT Type : </span>
                <span className="font-normal uppercase text-neutral-900">
                  {data.productType || ""}
                </span>
              </td>
              <td className="p-1 px-2 border-r border-black truncate">
                <span className="font-bold">Testing Std : </span>
                <span className="font-normal uppercase text-neutral-900">
                  {data.testingStd || "API 598"}
                </span>
              </td>
              <td className="p-1 px-2 border-r border-black truncate">
                <span className="font-bold">F TO F Std : </span>
                <span className="font-normal uppercase text-neutral-900">
                  {data.fToFStd || ""}
                </span>
              </td>
              <td className="p-1 px-2 truncate">
                <span className="font-bold">Certificates No : </span>
                <span className="font-semibold uppercase text-neutral-900 font-mono">
                  {certNo}
                </span>
              </td>
            </tr>

            <tr>
              <td className="p-1 px-2 border-r border-black truncate">
                <span className="font-bold">DESIGN : </span>
                <span className="font-normal uppercase text-neutral-900">
                  {data.design || ""}
                </span>
              </td>
              <td className="p-1 px-2 border-r border-black truncate">
                <span className="font-bold">Mfg Std : </span>
                <span className="font-normal uppercase text-neutral-900">
                  {data.mfgStd || "API 609A / BS 5155 / IS 3095"}
                </span>
              </td>
              <td className="p-1 px-2 border-r border-black truncate">
                <span className="font-bold">Ends Std : </span>
                <span className="font-normal uppercase text-neutral-900">
                  {data.endsStd || ""}
                </span>
              </td>
              <td className="p-1 px-2 truncate">
                <span className="font-bold">GAD NO: </span>
                <span className="font-normal uppercase text-neutral-900">
                  {data.gadNo || ""}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ========================================================================= */}
        {/* 3. DESCRIPTION/MATERIAL LINE ITEMS TABLE                                  */}
        {/* ========================================================================= */}
        <div className="w-full border-b-[1.5px] border-black">
          {/* Section banner */}
          <div className="py-1 px-2 bg-neutral-50/50 border-b border-black text-center font-black uppercase text-[10.5px] tracking-wide">
            DESCRIPTION/MATERIAL
          </div>

          <table className="w-full table-fixed border-collapse text-[9px] text-center">
            <colgroup>
              <col style={{ width: "3.5%" }} />
              <col style={{ width: "23%" }} />
              <col style={{ width: "5.5%" }} />
              <col style={{ width: "6%" }} />
              <col style={{ width: "5.5%" }} />
              <col style={{ width: "5.5%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "6.5%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "6.5%" }} />
              <col style={{ width: "6.5%" }} />
              <col style={{ width: "6.5%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-black font-bold bg-neutral-50/30">
                <th className="p-1 border-r border-black">ITEM</th>
                <th className="p-1 border-r border-black">DESCRIPTION</th>
                <th className="p-1 border-r border-black leading-tight">
                  QTY<br />(PCS)
                </th>
                <th className="p-1 border-r border-black leading-tight">
                  CLASS<br />(PN)
                </th>
                <th className="p-1 border-r border-black leading-tight">
                  INCH<br />(DN)
                </th>
                <th className="p-1 border-r border-black leading-tight">
                  MM<br />(DN)
                </th>
                <th className="p-1 border-r border-black">SERIAL NO.</th>
                <th className="p-1 border-r border-black">ENDS</th>
                <th className="p-1 border-r border-black">BODY</th>
                <th className="p-1 border-r border-black">DISC</th>
                <th className="p-1 border-r border-black">SHAFT</th>
                <th className="p-1 border-r border-black">SEAT</th>
                <th className="p-1 border-black">GLAND SEAL</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: totalLineRows }).map((_, idx) => {
                const item = lineItems[idx];
                return (
                  <tr
                    key={item?.id || `filler-line-${idx}`}
                    className="border-b border-black last:border-b-0 h-[24px]"
                  >
                    <td className="p-0.5 px-1 border-r border-black font-semibold">
                      {item ? item.itemNo || idx + 1 : ""}
                    </td>
                    <td className="p-0.5 px-1.5 border-r border-black text-left uppercase truncate font-medium">
                      {item?.description || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black">
                      {item?.qty || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black">
                      {item?.classPn || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black">
                      {item?.inchDn || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black">
                      {item?.mmDn || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black uppercase font-mono text-[8.5px] truncate">
                      {item?.serialNo || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black uppercase truncate">
                      {item?.ends || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black uppercase truncate">
                      {item?.body || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black uppercase truncate">
                      {item?.disc || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black uppercase truncate">
                      {item?.shaft || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black uppercase truncate">
                      {item?.seat || ""}
                    </td>
                    <td className="p-0.5 px-1 border-black uppercase truncate">
                      {item?.glandSeal || ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ========================================================================= */}
        {/* 4. CHEMICAL COMPOSITION % & MECHANICAL PROPERTIES                         */}
        {/* ========================================================================= */}
        <div className="w-full border-b-[1.5px] border-black">
          <table className="w-full table-fixed border-collapse text-[8.5px] text-center">
            <colgroup>
              {/* Part Details (4 cols ~26%) */}
              <col style={{ width: "8.5%" }} />
              <col style={{ width: "8.5%" }} />
              <col style={{ width: "3.5%" }} />
              <col style={{ width: "7.5%" }} />

              {/* Chemical (13 cols ~40%) */}
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />
              <col style={{ width: "3.2%" }} />

              {/* Mechanical (6 cols ~34%) */}
              <col style={{ width: "5.5%" }} />
              <col style={{ width: "5.5%" }} />
              <col style={{ width: "5.5%" }} />
              <col style={{ width: "5.5%" }} />
              <col style={{ width: "5.5%" }} />
              <col style={{ width: "6.5%" }} />
            </colgroup>
            <thead>
              {/* Group Super-Headers */}
              <tr className="border-b border-black font-black bg-neutral-50/50 text-[9px]">
                <th colSpan={4} className="p-1 border-r border-black uppercase">
                  DESCRIPTION
                </th>
                <th colSpan={13} className="p-1 border-r border-black uppercase">
                  CHEMICAL COMPOSITION %
                </th>
                <th colSpan={6} className="p-1 uppercase">
                  MECHANICAL PROPERTIES
                </th>
              </tr>

              {/* Individual Column Headers */}
              <tr className="border-b border-black font-bold bg-neutral-50/30 text-[8px] leading-tight">
                {/* Description columns */}
                <th className="p-0.5 border-r border-black">PART NAME</th>
                <th className="p-0.5 border-r border-black">BODY HEAT NO.</th>
                <th className="p-0.5 border-r border-black">QTY</th>
                <th className="p-0.5 border-r border-black">MATERIAL</th>

                {/* Chemical composition columns */}
                <th className="p-0.5 border-r border-black">C</th>
                <th className="p-0.5 border-r border-black">Si</th>
                <th className="p-0.5 border-r border-black">Mn</th>
                <th className="p-0.5 border-r border-black">P</th>
                <th className="p-0.5 border-r border-black">S</th>
                <th className="p-0.5 border-r border-black">Cr</th>
                <th className="p-0.5 border-r border-black">Mo</th>
                <th className="p-0.5 border-r border-black">Ni</th>
                <th className="p-0.5 border-r border-black">Cu</th>
                <th className="p-0.5 border-r border-black">V</th>
                <th className="p-0.5 border-r border-black">Other</th>
                <th className="p-0.5 border-r border-black">Other</th>
                <th className="p-0.5 border-r border-black">CE</th>

                {/* Mechanical properties columns */}
                <th className="p-0.5 border-r border-black">T.S<br />MPa</th>
                <th className="p-0.5 border-r border-black">Y.S<br />MPa</th>
                <th className="p-0.5 border-r border-black">E.L<br />(%)</th>
                <th className="p-0.5 border-r border-black">RAΨ<br />(%)</th>
                <th className="p-0.5 border-r border-black">Hardn<br />HB</th>
                <th className="p-0.5">Impact Test<br />Temp. AKV(J)</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: totalMaterialRows }).map((_, idx) => {
                const mat = materialItems[idx];
                return (
                  <tr
                    key={mat?.id || `filler-mat-${idx}`}
                    className="border-b border-black last:border-b-0 h-[23px]"
                  >
                    {/* Part Details */}
                    <td className="p-0.5 px-1 border-r border-black text-left uppercase truncate font-semibold">
                      {mat?.partName || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black uppercase font-mono text-[8px] truncate">
                      {mat?.bodyHeatNo || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black">
                      {mat?.qty || ""}
                    </td>
                    <td className="p-0.5 px-1 border-r border-black uppercase truncate font-medium">
                      {mat?.material || ""}
                    </td>

                    {/* Chemical Composition */}
                    <td className="p-0.5 border-r border-black font-mono">{mat?.c || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.si || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.mn || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.p || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.s || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.cr || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.mo || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.ni || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.cu || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.v || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.other1 || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.other2 || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.ce || ""}</td>

                    {/* Mechanical Properties */}
                    <td className="p-0.5 border-r border-black font-mono">{mat?.tsMpa || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.ysMpa || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.elPercent || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.raPsi || ""}</td>
                    <td className="p-0.5 border-r border-black font-mono">{mat?.hardn || ""}</td>
                    <td className="p-0.5 font-mono">{mat?.impactTestTemp || ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

          {/* Spacer row */}
          <div className="min-h-[48px] bg-white flex items-center px-3 text-[9px] text-neutral-500 italic">
            {/* Visual spacing matching MaterialTest Certificate.png */}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. SIGNATORIES FOOTER (PREPARED BY | WITNESSED BY | APPROVED BY)          */}
        {/* ========================================================================= */}
        <table className="w-full table-fixed border-collapse border-t-[1.5px] border-black text-center text-[10px]">
          <colgroup>
            <col style={{ width: "33.33%" }} />
            <col style={{ width: "33.34%" }} />
            <col style={{ width: "33.33%" }} />
          </colgroup>
          <tbody>
            <tr className="h-24">
              {/* Prepared By */}
              <td className="p-1.5 px-3 border-r border-black align-bottom pb-2">
                <div className="flex flex-col items-center justify-end h-full">
                  {showPreparedSignature && data.preparedSignatureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.preparedSignatureUrl}
                      alt="Prepared Signature"
                      className="h-10 w-auto object-contain mb-1"
                    />
                  ) : (
                    <div className="h-8" />
                  )}
                  {data.preparedBy && (
                    <span className="text-[10px] font-bold uppercase text-neutral-900 leading-tight mb-1">
                      {data.preparedBy}
                    </span>
                  )}
                  <span className="text-[10.5px] font-bold text-black tracking-tight">
                    Prepared By
                  </span>
                </div>
              </td>

              {/* Witnessed By */}
              <td className="p-1.5 px-3 border-r border-black align-bottom pb-2">
                <div className="flex flex-col items-center justify-end h-full">
                  {showWitnessSignature && data.witnessSignatureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.witnessSignatureUrl}
                      alt="Witness Signature"
                      className="h-10 w-auto object-contain mb-1"
                    />
                  ) : (
                    <div className="h-8" />
                  )}
                  {data.witnessedBy && (
                    <span className="text-[10px] font-bold uppercase text-neutral-900 leading-tight mb-1">
                      {data.witnessedBy}
                    </span>
                  )}
                  <span className="text-[10.5px] font-bold text-black tracking-tight">
                    Witnessed By
                  </span>
                </div>
              </td>

              {/* Approved by */}
              <td className="p-1.5 px-3 align-bottom pb-2">
                <div className="flex flex-col items-center justify-end h-full">
                  {showApprovedSignature && data.approvedSignatureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.approvedSignatureUrl}
                      alt="Approved Signature"
                      className="h-10 w-auto object-contain mb-1"
                    />
                  ) : (
                    <div className="h-8" />
                  )}
                  {data.approvedBy && (
                    <span className="text-[10px] font-bold uppercase text-neutral-900 leading-tight mb-1">
                      {data.approvedBy}
                    </span>
                  )}
                  <span className="text-[10.5px] font-bold text-black tracking-tight">
                    Approved by
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
