import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState("");
  return (
    <input
      type="search"
      placeholder="Buscar ejercicio…"
      value={q}
      onChange={e => {
        setQ(e.target.value);
        onSearch(e.target.value);
      }}
      style={{
        width: "100%",
        padding: ".8rem",
        borderRadius: "1rem",
        border: "1px solid var(--color-dark)",
      }}
    />
  );
}
