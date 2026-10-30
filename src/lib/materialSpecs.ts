import rawMaterials from "@/data/meterial.json";

export interface MaterialChemicalComposition {
  "Carbon (C)"?: string;
  "Manganese (Mn)"?: string;
  "Silicon (Si)"?: string;
  "Phosphorus (P)"?: string;
  "Sulfur (S)"?: string;
  "Chromium (Cr)"?: string;
  "Nickel (Ni)"?: string;
  "Molybdenum (Mo)"?: string;
  "Copper (Cu)"?: string;
  "Vanadium (V)"?: string;
  "Iron (Fe)"?: string;
  [key: string]: string | undefined;
}

export interface MaterialMechanicalProperties {
  "Tensile Strength (MPa)"?: string | null;
  "Yield Strength (MPa)"?: string | null;
  "Elongation (%)"?: string | null;
  "Reduction of Area (%)"?: string | null;
  "Hardness (HB)"?: string | null;
  "Impact Temperature (°C)"?: string | null;
  "Charpy Impact Energy - AKV (J)"?: string | null;
  [key: string]: string | null | undefined;
}

export interface MaterialSpec {
  name: string;
  "Chemical Composition (%)": MaterialChemicalComposition;
  "Mechanical Properties": MaterialMechanicalProperties;
}

export const MATERIAL_SPECS: MaterialSpec[] = rawMaterials as MaterialSpec[];

export const STANDARD_GRADE_NAMES: string[] = MATERIAL_SPECS.map((m) => m.name);

export const ASTM_PRESET_MATERIALS: string[] = [
  "ASTM A216 WCB",
  "ASTM A351 CF8M",
  "ASTM A351 CH8M",
  "ASTM A351 CF8",
  "ASTM A351 CF3",
  "ASTM A351 CF3M",
];

export const ALL_PRESET_MATERIALS: string[] = [
  ...STANDARD_GRADE_NAMES,
  ...ASTM_PRESET_MATERIALS,
];

/**
 * Finds the corresponding MaterialSpec from meterial.json based on material string
 * (e.g. "WCB", "ASTM A216 WCB", "CF8M", "ASTM A351 CF8M", etc.)
 */
export function findMaterialSpec(materialName?: string): MaterialSpec | undefined {
  if (!materialName) return undefined;
  const raw = materialName.trim().toUpperCase();
  if (!raw) return undefined;

  // 1. Exact match
  const exact = MATERIAL_SPECS.find((m) => m.name.toUpperCase() === raw);
  if (exact) return exact;

  // 2. Sort by name length descending (e.g. CF3M before CF3, CF8M before CF8)
  const sorted = [...MATERIAL_SPECS].sort(
    (a, b) => b.name.length - a.name.length
  );

  // 3. Word boundary regex match (e.g. "ASTM A216 WCB" -> "WCB")
  for (const m of sorted) {
    const reg = new RegExp(`(^|[^A-Z0-9])${m.name}([^A-Z0-9]|$)`, "i");
    if (reg.test(raw)) {
      return m;
    }
  }

  // 4. Substring fallback
  for (const m of sorted) {
    if (raw.includes(m.name.toUpperCase())) {
      return m;
    }
  }

  return undefined;
}

export const CHEMICAL_PROPERTY_MAP: Record<string, string> = {
  c: "Carbon (C)",
  si: "Silicon (Si)",
  mn: "Manganese (Mn)",
  p: "Phosphorus (P)",
  s: "Sulfur (S)",
  cr: "Chromium (Cr)",
  mo: "Molybdenum (Mo)",
  ni: "Nickel (Ni)",
  cu: "Copper (Cu)",
  v: "Vanadium (V)",
};

/**
 * Returns the cleaned reference value for a chemical element (e.g. "0.30" from "0.30%")
 */
export function getChemicalReference(
  spec: MaterialSpec | undefined,
  fieldKey: string
): string | null {
  if (!spec) return null;
  const propName = CHEMICAL_PROPERTY_MAP[fieldKey.toLowerCase()];
  if (!propName) return null;

  const val = spec["Chemical Composition (%)"]?.[propName];
  if (!val || val === "null" || val === "Balance") return null;

  // Strip trailing % to match format: "C (0.30)", "Si (0.60)", "Cr (18.00 - 21.00)"
  return val.replace(/%/g, "").trim();
}

export const MECHANICAL_PROPERTY_MAP: Record<string, string> = {
  tsMpa: "Tensile Strength (MPa)",
  ysMpa: "Yield Strength (MPa)",
  elPercent: "Elongation (%)",
  raPsi: "Reduction of Area (%)",
  hardn: "Hardness (HB)",
  impactTestTemp: "Charpy Impact Energy - AKV (J)",
};

/**
 * Returns the cleaned reference value for a mechanical property (e.g. "485 - 655")
 */
export function getMechanicalReference(
  spec: MaterialSpec | undefined,
  fieldKey: string
): string | null {
  if (!spec) return null;
  const propName = MECHANICAL_PROPERTY_MAP[fieldKey];
  if (!propName) return null;

  const val = spec["Mechanical Properties"]?.[propName];
  if (!val || val === "null" || val === "N/A") return null;

  return val.trim();
}
