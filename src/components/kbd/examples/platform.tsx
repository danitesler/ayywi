import { Kbd } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <div className="ayy-cluster" aria-label="macOS shortcuts">
        <span className="ayy-muted">macOS:</span>
        <Kbd platform="mac" keyName="mod" />
        <Kbd platform="mac" keyName="alt" />
        <Kbd platform="mac" keyName="shift" />
        <Kbd platform="mac" keyName="ctrl" />
        <Kbd platform="mac">K</Kbd>
      </div>
      <div className="ayy-cluster" aria-label="Windows shortcuts">
        <span className="ayy-muted">Windows:</span>
        <Kbd platform="windows" keyName="ctrl" />
        <Kbd platform="windows" keyName="alt" />
        <Kbd platform="windows" keyName="shift" />
        <Kbd platform="windows" keyName="meta" />
        <Kbd platform="windows">K</Kbd>
      </div>
      <div className="ayy-cluster" aria-label="Linux shortcuts">
        <span className="ayy-muted">Linux:</span>
        <Kbd platform="linux" keyName="ctrl" />
        <Kbd platform="linux" keyName="alt" />
        <Kbd platform="linux" keyName="shift" />
        <Kbd platform="linux" keyName="meta" />
        <Kbd platform="linux">K</Kbd>
      </div>
    </div>
  );
}
