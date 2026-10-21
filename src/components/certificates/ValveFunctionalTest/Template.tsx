"use client";

import React from "react";
import {
  ValveFunctionalTestCertificateData,
  ValveFunctionalTestLineItem,
} from "@/types/certificate";

interface ValveFunctionalTestTemplateProps {
  data: ValveFunctionalTestCertificateData;
  certificateNumber?: string;
  revision?: number;
  status?: string;
  activePageIndex?: number;
  showAllPages?: boolean;
}

/**
 * Calculate the incremental certificate number for each page
 * E.g., if base is "ZIN2600024", page 1 (offset 0) => "ZIN2600024", page 2 (offset 1) => "ZIN2600025", etc.
 */
function getPageCertificateNumber(baseNumber?: string, pageIndex: number = 0): string {
  if (!baseNumber) return "DRAFT";
  if (baseNumber.toUpperCase() === "DRAFT") return "DRAFT";
  if (pageIndex <= 0) return baseNumber;

  // Match prefix and trailing numeric digits (e.g. "ZIN26" and "00024")
  const match = baseNumber.match(/^(.*?)(\d+)$/);
  if (!match) {
    return baseNumber;
  }

  const prefix = match[1];
  const numStr = match[2];
  const numDigits = numStr.length;
  const currentNum = parseInt(numStr, 10);
  if (isNaN(currentNum)) return baseNumber;

  const nextNum = currentNum + pageIndex;
  const nextNumStr = String(nextNum).padStart(numDigits, "0");
  return `${prefix}${nextNumStr}`;
}

export const ValveFunctionalTestTemplate: React.FC<ValveFunctionalTestTemplateProps> = ({
  data,
  certificateNumber,
  status,
  activePageIndex,
  showAllPages = true,
}) => {
  // Normalize certificate status
  const currentStatus = (status || data.status || "DRAFT").toUpperCase();
  const isDraft = currentStatus === "DRAFT" || !currentStatus;
  const isApproved = currentStatus === "APPROVED";

  // Signature stage rules:
  // 1. DRAFT: 0 signatures
  // 2. PENDING_APPROVAL / REJECTED: 1 signature (performed by only)
  // 3. APPROVED: 2 signatures (performed by + approved by)
  const showWitnessSignature =
    !isDraft && Boolean(data.witnessSignatureUrl);
  const showVerifiedSignature =
    isApproved && Boolean(data.verifiedSignatureUrl);

  // Fallback line items if data has legacy structure or is empty
  const lineItems: ValveFunctionalTestLineItem[] =
    data.lineItems && data.lineItems.length > 0
      ? data.lineItems
      : [
          {
            sNo: 1,
            tagNo:
              data.equipmentParameters?.find((p) => p.id === "tagNo")?.value ||
              "1",
            valveType: data.valveType || "Ball Valve",
            valveSize: data.valveSizeAndClass || "20",
            moc: "WCB Body ss316/PTF",
            endConnection: "Flanged",
            actType:
              data.equipmentParameters?.find((p) => p.id === "actuatorType")
                ?.value || "pneumatic actuator",
            model:
              data.equipmentParameters?.find((p) => p.id === "actuatorModel")
                ?.value || "ZRC20SA",
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
            stroke1Open:
              data.pneumaticStrokes?.[0]?.openTime || "0.3 sec",
            stroke1Close:
              data.pneumaticStrokes?.[0]?.closeTime || "0.3 sec",
            stroke2Open:
              data.pneumaticStrokes?.[1]?.openTime || "0.3 sec",
            stroke2Close:
              data.pneumaticStrokes?.[1]?.closeTime || "0.3 sec",
            stroke3Open:
              data.pneumaticStrokes?.[2]?.openTime || "0.3 sec",
            stroke3Close:
              data.pneumaticStrokes?.[2]?.closeTime || "0.3 sec",
            valveFunction: "Pass/ Fail",
          },
        ];

  // Determine which line items to render
  const itemsToRender =
    !showAllPages && typeof activePageIndex === "number"
      ? [lineItems[activePageIndex] || lineItems[0]]
      : lineItems;

  return (
    <div id="certificate-a4-document" className="w-full flex flex-col items-center gap-6">
      {itemsToRender.map((item, index) => {
        const pageNumber =
          !showAllPages && typeof activePageIndex === "number"
            ? activePageIndex + 1
            : index + 1;
        const totalPages = lineItems.length;
        const pageOffset = pageNumber - 1;
        const pageCertificateNumber = getPageCertificateNumber(certificateNumber, pageOffset);

        // Determine accessory active state: must be checked AND not NA
        const isAccessoryEnabled = (enabled?: boolean, modelVal?: string) => {
          if (!enabled) return false;
          if (!modelVal) return true;
          const trimmed = modelVal.trim().toUpperCase();
          return trimmed !== "NA";
        };

        const hasLsb = isAccessoryEnabled(item.hasLsb, item.lsbModelNo);
        const hasSov = isAccessoryEnabled(item.hasSov, item.sovModelNo);
        const hasPositioner = isAccessoryEnabled(item.hasPositioner, item.posinier);
        const hasAfr = isAccessoryEnabled(item.hasAfr, item.afrModelNo);

        return (
          <div
            key={item.id || index}
            data-certificate-page={pageNumber}
            data-page-index={index}
            className="certificate-a4-page bg-white text-black font-sans box-border relative shadow-lg print:shadow-none print:transform-none mx-auto"
            style={{
              width: "794px",
              minHeight: "1123px",
              padding: "16px 20px",
              pageBreakAfter: index === itemsToRender.length - 1 ? "auto" : "always",
              breakAfter: index === itemsToRender.length - 1 ? "auto" : "page",
            }}
          >
            {/* Outer black border container matching reference */}
            <div className="w-full border-[1.5px] border-black flex flex-col p-0 box-border bg-white text-[11px] leading-tight">
              {/* ============================================================== */}
              {/* 1. TITLE BAR                                                   */}
              {/* ============================================================== */}
              <div className="py-2.5 px-4 text-center border-b-[1.5px] border-black relative flex items-center justify-center min-h-[46px]">
                <h1 className="text-[17px] font-bold tracking-wider uppercase text-black">
                  VALVE FUNCTIONAL TEST REPORT
                </h1>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/truflow-logo.png"
                    alt="Truflow Logo"
                    className="h-8 w-auto object-contain"
                  />
                </div>
              </div>

              {/* ============================================================== */}
              {/* 2. CUSTOMER & TEST INFORMATION (2 EQUAL COLUMNS)               */}
              {/* ============================================================== */}
              <table className="w-full table-fixed border-collapse border-b-[1.5px] border-black">
                <colgroup>
                  <col style={{ width: "50%" }} />
                  <col style={{ width: "50%" }} />
                </colgroup>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-2 border-r border-black uppercase truncate">
                      <span className="font-bold">CUSTOMER NAME : </span>
                      <span className="font-normal text-slate-900">
                        {data.customerName || ""}
                      </span>
                    </td>
                    <td className="p-2 uppercase truncate">
                      <span className="font-bold">CERTIFICATE NO : </span>
                      <span className="font-normal text-slate-900">
                        {pageCertificateNumber}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-2 border-r border-black uppercase truncate">
                      <span className="font-bold">CUSTOMER PO : </span>
                      <span className="font-normal text-slate-900">
                        {data.customerPO || ""}
                      </span>
                    </td>
                    <td className="p-2 uppercase truncate">
                      <span className="font-bold">DATE OF TEST : </span>
                      <span className="font-normal text-slate-900">
                        {data.dateOfTest || ""}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-black uppercase truncate">
                      <span className="font-bold">SALES ORDER NO : </span>
                      <span className="font-normal text-slate-900">
                        {data.salesOrderNo || ""}
                      </span>
                    </td>
                    <td className="p-2 uppercase truncate">
                      <span className="font-bold">TESTED BY : </span>
                      <span className="font-normal text-slate-900">
                        {data.testedBy || "SIVAGANESHAN.V.A"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ============================================================== */}
              {/* 3. LINE ITEM SPECIFICATIONS (2 COLUMNS)                        */}
              {/* ============================================================== */}
              <table className="w-full table-fixed border-collapse border-b-[1.5px] border-black">
                <colgroup>
                  <col style={{ width: "50%" }} />
                  <col style={{ width: "50%" }} />
                </colgroup>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                      S.No
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {pageNumber}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                      Tag No
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.tagNo || ""}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                      Valve Type
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.valveType || ""}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                      Valve Size
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.valveSize || ""}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                      MOC
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.moc || ""}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                      End Connection
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.endConnection || ""}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                      ACt Tyoe
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.actType || ""}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                      Model
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.model || ""}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                      Fail position
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.failPosition || "Fail Close / Fail Open"}
                    </td>
                  </tr>
                  {hasLsb && (
                    <tr className="border-b border-black">
                      <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                        LSB Model NO
                      </td>
                      <td className="p-1.5 px-2.5 font-normal text-slate-900">
                        {item.lsbModelNo}
                      </td>
                    </tr>
                  )}
                  {hasSov && (
                    <tr className="border-b border-black">
                      <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                        SOV model No
                      </td>
                      <td className="p-1.5 px-2.5 font-normal text-slate-900">
                        {item.sovModelNo}
                      </td>
                    </tr>
                  )}
                  {hasPositioner && (
                    <tr className="border-b border-black">
                      <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                        Positioner
                      </td>
                      <td className="p-1.5 px-2.5 font-normal text-slate-900">
                        {item.posinier}
                      </td>
                    </tr>
                  )}
                  {hasAfr && (
                    <tr className="border-b border-black">
                      <td className="p-1.5 px-2.5 border-r border-black font-bold text-black">
                        AFR Model No
                      </td>
                      <td className="p-1.5 px-2.5 font-normal text-slate-900">
                        {item.afrModelNo}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* ============================================================== */}
              {/* 4. SECTION HEADER: TEST PARAMETERS & RESULTS                    */}
              {/* ============================================================== */}
              <div className="py-1.5 px-4 text-center border-b-[1.5px] border-black bg-white">
                <h2 className="text-[13.5px] font-bold text-black tracking-wide">
                  Test Parameters &amp; Results
                </h2>
              </div>

              {/* ============================================================== */}
              {/* 5. TEST PARAMETERS & RESULTS TABLE                             */}
              {/* ============================================================== */}
              <table className="w-full table-fixed border-collapse border-b-[1.5px] border-black">
                <colgroup>
                  <col style={{ width: "21%" }} />
                  <col style={{ width: "29%" }} />
                  <col style={{ width: "50%" }} />
                </colgroup>
                <tbody>
                  {/* Stoke 1 */}
                  <tr className="border-b border-black">
                    <td
                      rowSpan={2}
                      className="p-1.5 px-2.5 border-r border-black font-bold text-center align-middle text-black"
                    >
                      Stoke 1
                    </td>
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-center text-black">
                      Open
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.stroke1Open || "0.3 sec"}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-center text-black">
                      Close
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.stroke1Close || "0.3 sec"}
                    </td>
                  </tr>

                  {/* Stoke 2 */}
                  <tr className="border-b border-black">
                    <td
                      rowSpan={2}
                      className="p-1.5 px-2.5 border-r border-black font-bold text-center align-middle text-black"
                    >
                      Stoke 2
                    </td>
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-center text-black">
                      Open
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.stroke2Open || "0.3 sec"}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-center text-black">
                      Close
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.stroke2Close || "0.3 sec"}
                    </td>
                  </tr>

                  {/* Stoke 3 */}
                  <tr className="border-b border-black">
                    <td
                      rowSpan={2}
                      className="p-1.5 px-2.5 border-r border-black font-bold text-center align-middle text-black"
                    >
                      Stoke 3
                    </td>
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-center text-black">
                      Open
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.stroke3Open || "0.3 sec"}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 px-2.5 border-r border-black font-bold text-center text-black">
                      Close
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.stroke3Close || "0.3 sec"}
                    </td>
                  </tr>

                  {/* LSB Function (Appears only if LSB is active) */}
                  {hasLsb && (
                    <tr className="border-b border-black">
                      <td
                        colSpan={2}
                        className="p-1.5 px-2.5 border-r border-black font-bold text-black"
                      >
                        LSB Function
                      </td>
                      <td className="p-1.5 px-2.5 font-normal text-slate-900">
                        {item.lsbFunction || "Pass"}
                      </td>
                    </tr>
                  )}

                  {/* SOV Function */}
                  {hasSov && (
                    <tr className="border-b border-black">
                      <td
                        colSpan={2}
                        className="p-1.5 px-2.5 border-r border-black font-bold text-black"
                      >
                        SOV Function
                      </td>
                      <td className="p-1.5 px-2.5 font-normal text-slate-900">
                        {item.sovFunction || "Pass"}
                      </td>
                    </tr>
                  )}

                  {/* AFR Function */}
                  {hasAfr && (
                    <tr className="border-b border-black">
                      <td
                        colSpan={2}
                        className="p-1.5 px-2.5 border-r border-black font-bold text-black"
                      >
                        AFR Function
                      </td>
                      <td className="p-1.5 px-2.5 font-normal text-slate-900">
                        {item.afrFunction || "Pass"}
                      </td>
                    </tr>
                  )}

                  {/* Positioner */}
                  {hasPositioner && (
                    <tr className="border-b border-black">
                      <td
                        colSpan={2}
                        className="p-1.5 px-2.5 border-r border-black font-bold text-black"
                      >
                        Positioner
                      </td>
                      <td className="p-1.5 px-2.5 font-normal text-slate-900">
                        {item.poFunction || "Pass"}
                      </td>
                    </tr>
                  )}

                  {/* Valve Function */}
                  <tr>
                    <td
                      colSpan={2}
                      className="p-1.5 px-2.5 border-r border-black font-bold text-black"
                    >
                      Valve Function
                    </td>
                    <td className="p-1.5 px-2.5 font-normal text-slate-900">
                      {item.valveFunction || "Pass"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ============================================================== */}
              {/* 6. CERTIFICATION DECLARATION NOTE                              */}
              {/* ============================================================== */}
              <div className="p-3 text-center text-[9.5px] leading-relaxed border-b border-black text-slate-800">
                <p>
                  {data.declarationText ||
                    "This is to certify that the valve assembly and accessories listed above have been tested and inspected according to the applicable quality standards."}
                </p>
                <p className="mt-1">
                  It has passed all specified tests and is compliant with the stated performance and safety requirements.
                </p>
              </div>

              {/* ============================================================== */}
              {/* 7. SIGNATURE BOXES (2 EQUAL COLUMNS)                           */}
              {/* ============================================================== */}
              <table className="w-full table-fixed border-collapse border-b border-black">
                <colgroup>
                  <col style={{ width: "50%" }} />
                  <col style={{ width: "50%" }} />
                </colgroup>
                <tbody>
                  <tr>
                    {/* Left Signature */}
                    <td className="p-2 border-r border-black align-bottom">
                      <div className="flex flex-col items-center justify-end min-h-[80px]">
                        <div className="h-[45px] w-full flex items-center justify-center">
                          {showWitnessSignature && data.witnessSignatureUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={data.witnessSignatureUrl}
                              alt="Signature"
                              className="h-full w-auto object-contain mix-blend-multiply"
                            />
                          ) : (
                            <div className="w-32 border-b border-dashed border-slate-300 mb-2" />
                          )}
                        </div>
                        <span className="font-normal text-[11px] text-slate-900 mt-1">
                          Signature
                        </span>
                      </div>
                    </td>

                    {/* Right Signature */}
                    <td className="p-2 align-bottom">
                      <div className="flex flex-col items-center justify-end min-h-[80px]">
                        <div className="h-[45px] w-full flex items-center justify-center">
                          {showVerifiedSignature && data.verifiedSignatureUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={data.verifiedSignatureUrl}
                              alt="Signature"
                              className="h-full w-auto object-contain mix-blend-multiply"
                            />
                          ) : (
                            <div className="w-32 border-b border-dashed border-slate-300 mb-2" />
                          )}
                        </div>
                        <span className="font-normal text-[11px] text-slate-900 mt-1">
                          Signature
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ============================================================== */}
              {/* 8. FOOTER COMPANY NAME & ADDRESS                               */}
              {/* ============================================================== */}
              <div className="p-2.5 text-center bg-white">
                <div className="font-bold text-[10.5px] uppercase tracking-wide text-black">
                  {data.companyName || "TRUFLOW AUTOMATION & CONTROLS PRIVATE LIMITED"}
                </div>
                <div className="text-[9.5px] text-slate-800 mt-0.5 leading-snug">
                  {data.companyAddress ||
                    "S.F No. 617/ 2H2, Vadakku Thottam, L&T Road, MALUMICHAMPATTI post, Coimbatore- 641021, Tamil Nadu"}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
