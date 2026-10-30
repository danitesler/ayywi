import { type CSSProperties } from "react";
import { Icon, Kbd } from "@danitesler/ayywi/react";
import { Cursor01Icon, SparklesIcon } from "@hugeicons/core-free-icons";

/**
 * Spot illustrations: small, live sketches of the interface, drawn with ayywi tokens on one 17 × 9.5rem canvas.
 * The still frame is the whole picture; inside an element with .pv-art-host they play while it's hovered, or while it
 * has data-play. Decoration only: the host puts them in an aria-hidden box and says the idea in text.
 * The rules they follow are on the Illustration foundations page.
 */

/** The beat index: staggers a part by --pv-beat (0.12s) per step. */
const beat = (i: number) => ({ "--i": i }) as CSSProperties;
const width = (w: string) => ({ "--w": w }) as CSSProperties;

const Spark = () => <Icon icon={SparklesIcon} name="sparkles" size="sm" className="pv-art__spark" />;

/** 01 Ask, reply, approve: the agent shows its progress and a person signs it off. */
export function AgentSketch() {
  return (
    <div className="pv-art pv-art--agent">
      <div className="pv-art__chat">
        <span className="pv-art__bubble pv-art__bubble--me">Plan next week's posts</span>
        <span className="pv-art__bubble pv-art__bubble--ai">
          <span className="pv-art__ai-head">
            <Spark />
            Drafted 5 posts for review
          </span>
          <span className="pv-art__steps">
            {[0, 1, 2, 3, 4].map((i) => (
              <i key={i} style={beat(i)} />
            ))}
          </span>
        </span>
        <span className="pv-art__actions">
          <span className="pv-art__chip pv-art__chip--key">Approve</span>
          <span className="pv-art__chip">Edit</span>
        </span>
      </div>
    </div>
  );
}

function Screen({ kind, i }: { kind: "desktop" | "tablet" | "phone"; i: number }) {
  return (
    <span className={`pv-art__surface pv-art__screen pv-art__screen--${kind}`} style={beat(i)}>
      <i className="pv-art__block" />
      <i className="pv-art__line" style={width("75%")} />
      <i className="pv-art__line" style={width("50%")} />
      <b className="pv-art__btn" />
    </span>
  );
}

/** 02 The same screen on a desktop, a tablet and a phone; a cursor visits each and presses the same button. */
export function DevicesSketch() {
  return (
    <div className="pv-art pv-art--devices">
      <Screen kind="desktop" i={0} />
      <span className="pv-art__link" />
      <Screen kind="tablet" i={1} />
      <span className="pv-art__link" />
      <Screen kind="phone" i={2} />
      <Icon icon={Cursor01Icon} name="mouse-pointer" size="sm" className="pv-art__cursor" />
    </div>
  );
}

/** 03 A window narrows past a breakpoint: the sidebar folds to a rail and the tiles wrap. A real container query. */
export function AdaptiveSketch() {
  return (
    <div className="pv-art pv-art--adaptive">
      <div className="pv-art__surface pv-art__window">
        <span className="pv-art__bar">
          <i />
          <i />
          <i />
          <b className="pv-art__line" />
        </span>
        <span className="pv-art__view">
          <span className="pv-art__side">
            <i className="pv-art__line pv-art__line--key" />
            <i className="pv-art__line" />
            <i className="pv-art__line" />
            <i className="pv-art__line" />
          </span>
          <span className="pv-art__main">
            <i className="pv-art__line" style={width("40%")} />
            <span className="pv-art__tiles">
              <i className="pv-art__block" />
              <i className="pv-art__block" />
              <i className="pv-art__block pv-art__block--key" />
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}

/** 04 Pick an accent and the app follows; widgets trade places; a setting flips. */
export function CustomSketch() {
  return (
    <div className="pv-art pv-art--custom">
      <div className="pv-art__surface pv-art__app">
        <i className="pv-art__line" style={width("45%")} />
        <span className="pv-art__widgets">
          <span className="pv-art__widget pv-art__widget--chart">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="pv-art__widget pv-art__widget--text">
            <i className="pv-art__line" />
            <i className="pv-art__line" style={width("70%")} />
            <i className="pv-art__line" style={width("85%")} />
          </span>
        </span>
        <b className="pv-art__btn" />
      </div>
      <div className="pv-art__controls">
        <span className="pv-art__swatches">
          <i />
          <i />
          <i />
          <i />
          <span className="pv-art__ring" />
        </span>
        <span className="pv-art__setting">
          <i className="pv-art__line" />
          <span className="pv-art__switch" />
        </span>
        <span className="pv-art__setting">
          <i className="pv-art__line" />
          <Kbd>⌘K</Kbd>
        </span>
      </div>
    </div>
  );
}

/** 05 A prompt is typed and the interface assembles itself, with room left for a part nobody has made yet. */
export function NextSketch() {
  return (
    <div className="pv-art pv-art--next">
      <span className="pv-art__surface pv-art__prompt">
        <Spark />
        <span className="pv-art__typed">Show me this week</span>
        <i className="pv-art__caret" />
      </span>
      <span className="pv-art__made">
        <span className="pv-art__surface pv-art__chart" style={beat(0)}>
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="pv-art__surface pv-art__summary" style={beat(1)}>
          <i className="pv-art__line pv-art__line--key" style={width("55%")} />
          <i className="pv-art__line" />
          <i className="pv-art__line" style={width("70%")} />
        </span>
        <span className="pv-art__slot" style={beat(2)} />
      </span>
    </div>
  );
}
