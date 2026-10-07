import { Combobox, Field, FieldHint, Label } from "@danitesler/ayywi/react";

const zones = [
  { value: "Europe/Lisbon", label: "Lisbon", meta: "Portugal", keywords: "Portugal" },
  { value: "Europe/London", label: "London", meta: "United Kingdom", keywords: "United Kingdom" },
  { value: "Europe/Berlin", label: "Berlin", meta: "Germany", keywords: "Germany" },
  { value: "Asia/Jerusalem", label: "Jerusalem", meta: "Israel", keywords: "Israel" },
  { value: "Asia/Dubai", label: "Dubai", meta: "United Arab Emirates", keywords: "United Arab Emirates" },
  { value: "Asia/Tokyo", label: "Tokyo", meta: "Japan", keywords: "Japan" },
  { value: "America/New_York", label: "New York", meta: "United States", keywords: "United States" },
  { value: "America/Sao_Paulo", label: "São Paulo", meta: "Brazil", keywords: "Brazil" },
];

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 20rem)" }}>
      <Label htmlFor="timezone">Time zone</Label>
      <Combobox id="timezone" name="timezone" options={zones} defaultValue="Europe/Lisbon" placeholder="Search a city" aria-describedby="timezone-hint" />
      <FieldHint id="timezone-hint">Type a city or a country.</FieldHint>
    </Field>
  );
}
