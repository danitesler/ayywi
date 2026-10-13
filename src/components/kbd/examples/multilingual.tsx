import { useEffect, useState } from "react";
import { Kbd } from "@danitesler/ayywi/react";
import { matchShortcut } from "@danitesler/ayywi";

export default function Example() {
  const [status, setStatus] = useState<string>("Press Ctrl+E (⌘E on a Mac) on any keyboard layout to test.");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (matchShortcut(e, "Mod+E")) {
        e.preventDefault();
        setStatus(`Matched Mod+E: code ${e.code || "unknown"}, key "${e.key}".`);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="ayy-stack">
      <p>
        Listen to physical key codes (<code>event.code</code> or <code>matchShortcut</code>) so hotkeys work across languages:
      </p>
      <div className="ayy-cluster">
        <span className="ayy-muted">English layout:</span>
        <Kbd keyName="mod" /> + <Kbd>E</Kbd>
      </div>
      <div className="ayy-cluster">
        <span className="ayy-muted">Russian (ЙЦУКЕН):</span>
        <Kbd keyName="mod" /> + <Kbd>У</Kbd>
      </div>
      <p className="ayy-muted">{status}</p>
    </div>
  );
}
