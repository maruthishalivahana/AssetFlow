type RelationValue = string | { id?: string; name?: string; code?: string } | null | undefined;

export const assetConditionOptions = [
    { value: "NEW", label: "New" },
    { value: "GOOD", label: "Good" },
    { value: "FAIR", label: "Fair" },
    { value: "DAMAGED", label: "Damaged" },
    { value: "SCRAPPED", label: "Scrapped" },
] as const;

const legacyConditionMap: Record<string, string> = {
    EXCELLENT: "GOOD",
    POOR: "DAMAGED",
};

export const normalizeAssetCondition = (value: string | null | undefined) => {
    if (!value) return "";

    const upper = value.toUpperCase();
    return legacyConditionMap[upper] || upper;
};

export const getAssetConditionLabel = (value: string | null | undefined) => {
    const normalized = normalizeAssetCondition(value);
    return assetConditionOptions.find((option) => option.value === normalized)?.label || value || "";
};

export const getRelationLabel = (value: RelationValue) => {
    if (typeof value === "string") return value;
    if (!value) return "";

    return value.name || value.code || value.id || "";
};

export const getRelationId = (value: RelationValue) => {
    if (typeof value === "string") return value;
    if (!value) return "";

    return value.id || "";
};