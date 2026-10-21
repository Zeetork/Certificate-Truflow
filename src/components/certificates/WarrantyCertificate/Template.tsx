"use client";

import React from "react";
import {
  WarrantyCertificateData,
  WarrantyCertificateItem,
  CustomField,
} from "@/types/certificate";

interface WarrantyCertificateTemplateProps {
  data: WarrantyCertificateData;
  certificateNumber?: string;
  revision?: number;
  status?: string;
}

export const WarrantyCertificateTemplate: React.FC<WarrantyCertificateTemplateProps> = ({
  data,
  status,
}) => {
  const generalCustom: CustomField[] = data.customFields?.general || [];
  const productCustom: CustomField[] = data.customFields?.product || [];

  // Helper to format date with dots: DD.MM.YYYY (e.g. 10.09.2026)
  const formatDotDate = (d?: string): string => {
    if (!d) return "";
    const trimmed = d.trim();
    if (trimmed.includes("T")) {
      const datePart = trimmed.split("T")[0];
      const parts = datePart.split("-");
      if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    if (trimmed.includes("-")) {
      const parts = trimmed.split("-");
      if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
      if (parts.length === 3) {
        return `${parts[0]}.${parts[1]}.${parts[2]}`;
      }
    }
    if (trimmed.includes("/")) {
      const parts = trimmed.split("/");
      if (parts.length === 3 && parts[2].length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}`;
      }
    }
    return trimmed;
  };

  // Helper to format certificate date with hyphens: DD-MM-YYYY (e.g. 14-09-2026)
  const formatHyphenDate = (d?: string): string => {
    if (!d) return "14-09-2026";
    const trimmed = d.trim();
    if (trimmed.includes("T")) {
      const datePart = trimmed.split("T")[0];
      const parts = datePart.split("-");
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    if (trimmed.includes("-")) {
      const parts = trimmed.split("-");
      if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      if (parts.length === 3) {
        return `${parts[0]}-${parts[1]}-${parts[2]}`;
      }
    }
    if (trimmed.includes(".")) {
      const parts = trimmed.split(".");
      if (parts.length === 3) {
        return `${parts[0]}-${parts[1]}-${parts[2]}`;
      }
    }
    return trimmed;
  };

  const poNumber = data.customerPO || "PO00900";
  const poDateFormatted = formatDotDate(data.poDate || data.customerPODate || "2026-09-10");
  const certDateFormatted = formatHyphenDate(data.date || data.certificateDate || "2026-09-14");
  const jobRefNo = data.salesOrderNo || "INS220331";

  const salutation = data.salutation || "To whom so here it my concern,";

  const warrantyPeriod =
    (data.warrantyPeriodSupply && data.warrantyPeriodInstallation
      ? `${data.warrantyPeriodSupply} or ${data.warrantyPeriodInstallation}, whichever is earlier.`
      : null) ||
    "18 months from the date of supply or 12 months from the date of installation, whichever is earlier.";

  const warrantyNote =
    data.warrantyNoteText
      ? data.warrantyNoteText.replace(/^Note:\s*/i, "")
      : "The warranty is applicable only to manufacturing defects and does not cover normal wear and tear, improper usage, mishandling, or damage caused by improper installation or maintenance.";

  const lineItems: WarrantyCertificateItem[] = data.lineItems || [];
  const hasMultipleLineItems = lineItems.length > 1;

  let productDescriptionText = data.productDescription;
  if (!productDescriptionText && lineItems.length > 0) {
    const item = lineItems[0];
    productDescriptionText = `${item.sNo || 1}. ${item.description || ""}${item.quantity ? ` ${item.quantity}` : ""}`;
  }

  const signatoryName = data.signatoryName || data.witnessedBy || "Elavarasan.K";
  const signatoryCompany = data.signatoryCompany || "Truflow Solutions Pvt Ltd";
  const signatureUrl =
    data.witnessSignatureUrl || "/signature/truflow-signature.png";
  const stampUrl = data.sealStampUrl || "/signature/truflow-seal-stamp.png";

  const currentStatus = (status || data.status || "").toUpperCase();
  const isDraft = currentStatus === "DRAFT" || !currentStatus;
  const isApproved = currentStatus === "APPROVED";
  const showSignatures = data.showSignatures !== false && (!isDraft || isApproved);
  const showStamp = data.showStamp !== false;

  return (
    <div
      id="certificate-a4-document"
      data-certificate-page="1"
      data-orientation="portrait"
      className="certificate-a4-page bg-white mx-auto text-black select-text shadow-lg print:shadow-none print:m-0 box-border flex flex-col justify-between print:!p-[14mm]"
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "48px 56px 40px 56px",
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Top and Body Content Container */}
      <div className="w-full flex flex-col">
        {/* Top Right Logo */}
        <div className="flex justify-end mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/truflow-logo.png"
            alt="TRUFLOW"
            className="h-[46px] w-auto object-contain"
          />
        </div>

        {/* Centered Underlined Document Title */}
        <div className="text-center my-4">
          <h1 className="text-[20px] font-bold text-black tracking-wider uppercase inline-block border-b-2 border-black pb-0.5">
            WARRANTY CERTIFICATE
          </h1>
        </div>

        {/* Right-aligned Date */}
        <div className="flex justify-end mb-6">
          <div className="text-[13.5px] text-black">
            <span className="font-bold">Date: </span>
            <span className="font-semibold">{certDateFormatted}</span>
          </div>
        </div>

        {/* Letter Recipient / Order Reference Metadata */}
        <div className="space-y-1.5 text-[13.5px] text-black mb-8 leading-relaxed font-sans">
          <div className="flex items-baseline">
            <span className="font-bold min-w-[130px]">Customer</span>
            <span className="font-bold mr-2">:</span>
            <span className="font-bold text-black">
              {data.customerName || "Armatury Bauen Olomouc Controls Private Limited"}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="font-bold mr-1">Cus Po No:</span>
            <span>
              {poNumber}
              {poDateFormatted ? ` Dt:${poDateFormatted}` : ""}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="font-bold mr-1">SO No :</span>
            <span>{jobRefNo}</span>
          </div>
          <div className="flex items-baseline">
            <span className="font-bold mr-1">Product Description:</span>
            {productDescriptionText ? (
              <span className="font-medium text-black ml-1">
                {productDescriptionText}
              </span>
            ) : null}
          </div>

          {/* Multiple items listed cleanly if present */}
          {hasMultipleLineItems && (
            <div className="mt-1 pl-4 text-[12px] space-y-0.5 text-slate-800">
              {lineItems.map((item, idx) => (
                <div key={item.id || idx}>
                  {item.sNo || idx + 1}. {item.description}{" "}
                  {item.size ? `- ${item.size} ` : ""}
                  {item.quantity ? `(${item.quantity})` : ""}
                  {item.remarks ? ` - ${item.remarks}` : ""}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Salutation */}
        <div className="font-bold text-[13.5px] text-black mb-4">
          {salutation}
        </div>

        {/* Paragraph 1 - Confirmation of PO */}
        <p
          className="text-[13px] text-black leading-relaxed text-justify mb-5"
          style={{ textIndent: "2.5rem", textAlign: "justify" }}
        >
          {data.poConfirmationText ? (
            data.poConfirmationText
          ) : (
            <>
              We hereby confirm that the supplied items are in accordance with Purchase Order No.{" "}
              <span className="text-black">{poNumber}</span>
              {poDateFormatted ? (
                <>, dated <span className="text-black">{poDateFormatted}</span></>
              ) : null}
              .
            </>
          )}
        </p>

        {/* Paragraph 2 - Manufacturing Standards & Warranty Period */}
        <p
          className="text-[13px] text-black leading-relaxed text-justify mb-5"
          style={{ textIndent: "2.5rem", textAlign: "justify" }}
        >
          {data.warrantyTermsText ? (
            data.warrantyTermsText
          ) : (
            <>
              The products supplied under the above-mentioned Purchase Order are manufactured to the{" "}
              highest standards and in accordance with the specified requirements. We confirm that the products{" "}
              carry a standard warranty period of {warrantyPeriod}
            </>
          )}
        </p>

        {/* Paragraph 3 - Note & Exclusions */}
        <p
          className="text-[13px] text-black leading-relaxed text-justify mb-6"
          style={{ textIndent: "2.5rem", textAlign: "justify" }}
        >
          <span className="font-bold text-black">Note:</span> {warrantyNote}
        </p>

        {/* Optional Closing Sentence */}
        {data.closingText && (
          <p
            className="text-[12.5px] text-black leading-relaxed text-justify mb-4"
            style={{ textIndent: "2.5rem", textAlign: "justify" }}
          >
            {data.closingText}
          </p>
        )}

        {/* Optional Custom Fields */}
        {(generalCustom.length > 0 || productCustom.length > 0) && (
          <div className="my-3 space-y-1 text-[12px] text-black pl-10">
            {[...generalCustom, ...productCustom].map((cf, idx) => (
              <div key={cf.id || idx}>
                <span className="font-bold">{cf.name}: </span>
                <span>{cf.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Signatory Section */}
        <div className="mt-6 mb-4">
          <div className="font-bold text-[13px] text-black mb-2">
            Yours sincerely,
          </div>

          <div className="my-2 h-[75px] flex items-center">
            {showSignatures ? (
              <div className="relative flex items-center h-[75px]">
                {showStamp && stampUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={stampUrl}
                    alt="Truflow Seal Stamp"
                    className="h-[75px] w-[75px] object-contain opacity-95"
                  />
                )}
                {signatureUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={signatureUrl}
                    alt="Authorized Signature"
                    className={`h-[55px] w-auto object-contain mix-blend-multiply ${
                      showStamp && stampUrl ? "-ml-6" : ""
                    }`}
                  />
                )}
              </div>
            ) : (
              <div className="w-48 border-b border-dashed border-gray-400 h-10" />
            )}
          </div>

          <div className="font-bold text-[13px] uppercase tracking-wide text-black mt-2">
            {signatoryName}
          </div>
          {signatoryCompany && (
            <div className="text-[11.5px] text-black mt-0.5">
              {signatoryCompany}
            </div>
          )}
        </div>
      </div>

      {/* Centered Clean Footer (No Box/Table Borders) */}
      <div className="w-full text-center mt-auto pt-8">
        <div className="font-bold text-[12.5px] text-black tracking-wide">
          {data.companyName || "TruFlow Solutions Private Limited,"}
        </div>
        <div className="text-[11px] text-black mt-1 leading-snug">
          {data.companyAddress ||
            "S.F. No-617/2H2, Vadakku Thottam, L&T Road, Malumichampatti, Coimbatore-641 021, Tamil Nadu, India."}
        </div>
        <div className="text-[11px] text-black mt-1 leading-snug">
          <a
            href={`https://${data.companyWebsite || "www.truflow.com"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {data.companyWebsite || "www.truflow.com"}
          </a>
          {" "}| Email:{" "}
          <a
            href={`mailto:${data.companyEmail || "sales@truflow.com"}`}
            className="text-blue-600 underline"
          >
            {data.companyEmail || "sales@truflow.com"}
          </a>
          {" "}| GST No: {data.gstNo || "33AAJCR6720N1Z1"}
        </div>
      </div>
    </div>
  );
};
