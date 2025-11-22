export function safeDisplay(value, fallback = "") {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    // Common pattern { id, nom }
    if ("nom" in value && typeof value.nom === "string") return value.nom;
    if ("name" in value && typeof value.name === "string") return value.name;
    // If primitive-like object (e.g. Date) toString may help
    try {
      const str = value.toString();
      if (str && str !== "[object Object]") return str;
    } catch (_) {}
    // Last resort: JSON stringify trimmed
    try {
      return JSON.stringify(value);
    } catch (_) {
      return fallback;
    }
  }
  return fallback;
}
