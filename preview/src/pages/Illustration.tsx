import { useEffect, useId, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { Field, Icon, Label, Switch } from "@danitesler/ayywi/react";
import { Cursor01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { AdaptiveSketch, AgentSketch, CustomSketch, DevicesSketch, NextSketch } from "../illustrations";

const SKETCHES: { name: string; accent: string; Sketch: ComponentType }[] = [
  { name: "Ask, reply, approve", accent: "var(--ayy-accent-ai)", Sketch: AgentSketch },
  { name: "One screen, three devices", accent: "var(--ayy-accent-product)", Sketch: DevicesSketch },
  { name: "Past a breakpoint", accent: "var(--ayy-accent-system)", Sketch: AdaptiveSketch },
  { name: "Make it yours", accent: "var(--ayy-accent-brand)", Sketch: CustomSketch },
  { name: "Prompt to interface", accent: "var(--ayy-accent-marketing)", Sketch: NextSketch },
];

/** A sketch on its stage. It plays while hovered, or while the page's Play switch is on. */
function Specimen({ accent, play, children }: { accent: string; play: boolean; children: ReactNode }) {
  return (
    <div className="pv-illo__stage pv-art-host" data-play={play || undefined} style={{ "--ayy-spot": accent } as CSSProperties} aria-hidden="true">
      {children}
    </div>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const KIT: { name: string; uses: string; piece: ReactNode }[] = [
  {
    name: "Surface",
    uses: "color-bg fill, color-border line, radius-lg",
    piece: (
      <span className="pv-art__surface pv-illo__surface">
        <i className="pv-art__line" style={{ "--w": "70%" } as CSSProperties} />
        <i className="pv-art__line" style={{ "--w": "45%" } as CSSProperties} />
      </span>
    ),
  },
  { name: "Line", uses: "color-line; --w sets its length", piece: <i className="pv-art__line" style={{ "--w": "4rem" } as CSSProperties} /> },
  { name: "Key", uses: "--ayy-spot, the one thing the idea is about", piece: <b className="pv-art__btn" style={{ inlineSize: "3rem" }} /> },
  {
    name: "Chips",
    uses: "pill, color-border; the key one outlined",
    piece: (
      <span className="pv-illo__pair">
        <span className="pv-art__chip pv-art__chip--key">Approve</span>
        <span className="pv-art__chip">Edit</span>
      </span>
    ),
  },
  { name: "Bubble", uses: "a message; the tail corner is the sender's side", piece: <span className="pv-art__bubble pv-art__bubble--me">Plan the week</span> },
  { name: "Spark", uses: "Hugeicons Sparkles in the key colour: the AI's turn", piece: <Icon icon={SparklesIcon} name="sparkles" size="sm" className="pv-art__spark" /> },
  { name: "Link", uses: "a dashed line: the same thing elsewhere", piece: <span className="pv-art__link" style={{ inlineSize: "3rem" }} /> },
  { name: "Cursor", uses: "Hugeicons Cursor: where a person acts", piece: <Icon icon={Cursor01Icon} name="mouse-pointer" size="sm" className="pv-art__cursor pv-illo__cursor" /> },
];

/** The Agent sketch's beats, as a share of its 3.6s loop. */
const BEATS: { at: number; to?: number; label: string }[] = [
  { at: 0.04, label: "Ask nudges" },
  { at: 0.14, to: 0.4, label: "Progress re-runs" },
  { at: 0.48, label: "Spark" },
  { at: 0.64, to: 0.9, label: "Approved" },
];

function Rules({ items }: { items: [string, ReactNode][] }) {
  return (
    <ol className="pv-illo__rules">
      {items.map(([title, body]) => (
        <li key={title}>
          <strong>{title}</strong>
          <span>{body}</span>
        </li>
      ))}
    </ol>
  );
}

export function IllustrationPage() {
  const [play, setPlay] = useState(false);
  const reduced = useReducedMotion();
  const playId = useId();

  return (
    <article className="pv-page">
      <header className="pv-page__header pv-page__header--center">
        <h1 className="ayy-h2">Illustration</h1>
        <p className="ayy-lede">
          Small sketches of the interface itself, drawn with the same tokens as the components. They show one idea at a glance and
          move only when someone shows interest.
        </p>
      </header>

      <div className="pv-illo__controls">
        <Field inline>
          <Switch id={playId} checked={play} onCheckedChange={setPlay} disabled={reduced} />
          <Label htmlFor={playId}>Play every sketch</Label>
        </Field>
        <span className="pv-note">
          {reduced ? "Your system asks for reduced motion, so the sketches stay still." : "Or hover one to play just that one."}
        </span>
      </div>

      <div className="pv-illo__gallery">
        {SKETCHES.map(({ name, accent, Sketch }) => (
          <figure key={name} className="pv-illo__figure">
            <Specimen accent={accent} play={play}>
              <Sketch />
            </Specimen>
            <figcaption className="pv-note">{name}</figcaption>
          </figure>
        ))}
      </div>

      <h2 className="pv-h pv-h--section" id="illustration-where">Where to use them</h2>
      <p className="pv-note">They explain; they never carry information the text doesn't. One idea per sketch, beside the words that say it.</p>
      <div className="pv-illo__where">
        <section>
          <h3 className="ayy-h4">Use them for</h3>
          <ul className="pv-illo__list pv-illo__list--do">
            <li>Principle and feature rows: a docs page like Principles, a landing page's features.</li>
            <li>Onboarding and Get started steps, to show what happens after a step.</li>
            <li>Release notes and announcements of a new capability.</li>
            <li>Empty states and first-run screens, as a still frame with no motion.</li>
          </ul>
        </section>
        <section>
          <h3 className="ayy-h4">Keep them out of</h3>
          <ul className="pv-illo__list pv-illo__list--dont">
            <li>Working screens: forms, tables, dashboards and settings, where people came to get something done.</li>
            <li>Anything people must understand. Sketches are hidden from assistive tech, so the text says it all.</li>
            <li>Loading and progress. Use Spinner, Progress or Skeleton.</li>
            <li>Grids that all move at once, or anything that plays by itself.</li>
            <li>Brand art, mascots, people or photos. These draw the interface, nothing else.</li>
          </ul>
        </section>
      </div>

      <h2 className="pv-h pv-h--section" id="illustration-drawing">Drawing</h2>
      <Rules
        items={[
          ["Draw the interface, not a metaphor.", "Build from the kit below: surfaces, lines, chips, bubbles, a cursor. No people, objects or scenes."],
          ["One canvas, one scale.", "Every sketch is 17 × 9.5rem, scaled 1.2× beside text and 0.9× on a phone, and fills about the same share of it. A row of them reads as a set."],
          [
            "Monochrome plus one key.",
            <>
              Lines and fills are text tints. The host's <code className="ayy-code">--ayy-spot</code> colours only the part the idea is about: the
              approve button, the chosen swatch.
            </>,
          ],
          ["Opaque surfaces, 1px lines.", "Panels sit on the page colour with border lines, so they hold up over a spotlight or a wash in every theme."],
          ["A few real words.", "Labels are two to five words in sentence case. Everything else is a skeleton line."],
          ["Tokens and logical properties only.", "Like any component: sketches flip in RTL and follow dark, light and high-contrast themes."],
        ]}
      />
      <div className="pv-illo__kit" style={{ "--ayy-spot": "var(--ayy-accent-ai)" } as CSSProperties}>
        {KIT.map(({ name, uses, piece }) => (
          <div key={name} className="pv-illo__piece">
            <div className="pv-art pv-art--piece" aria-hidden="true">
              {piece}
            </div>
            <strong>{name}</strong>
            <span className="pv-note">{uses}</span>
          </div>
        ))}
      </div>

      <h2 className="pv-h pv-h--section" id="illustration-motion">Motion</h2>
      <Rules
        items={[
          [
            "The still frame is the illustration.",
            "It has to work with no motion at all: reduced motion, touch screens, a screenshot. Motion adds beats and always comes back to rest; nothing starts hidden.",
          ],
          ["Play on interest.", "A sketch plays while its row or card is hovered, or while a Play control is on, and stops when the pointer leaves. Never autoplay, and never more than one at a time."],
          ["One loop, one rhythm.", "Every sketch repeats every 3.6s. Parts that follow each other start 0.12s apart."],
          ["One story, two or three beats.", "Cause, then effect: ask → reply → approve, type → render. Cut any beat that doesn't move the story."],
          ["Move transform, opacity and colour.", "Animate layout only when layout is the idea, like the window that narrows past a breakpoint."],
          [
            "Ease from the tokens.",
            <>
              <code className="ayy-code">--ayy-ease-out-expo</code> for arrivals and presses, <code className="ayy-code">--ayy-ease-menu</code> for
              travel (a cursor, a swap), <code className="ayy-code">--ayy-ease-standard</code> for steady change.
            </>,
          ],
        ]}
      />

      {/* One host around both, so hovering either plays the sketch and the playhead together. */}
      <div className="pv-illo__anatomy pv-art-host" data-play={play || undefined}>
        <div className="pv-illo__stage" style={{ "--ayy-spot": "var(--ayy-accent-ai)" } as CSSProperties} aria-hidden="true">
          <AgentSketch />
        </div>
        <div className="pv-illo__timeline" role="img" aria-label="The Agent sketch's beats over its 3.6 second loop: ask nudges, progress re-runs, spark, approved">
          <div className="pv-illo__track" aria-hidden="true">
            {BEATS.map(({ at, to, label }) => (
              <span key={label} className="pv-illo__beat" style={{ "--at": at, "--to": to ?? at } as CSSProperties}>
                <span className="pv-illo__beat-label">{label}</span>
              </span>
            ))}
            <span className="pv-illo__playhead" />
          </div>
          <div className="pv-illo__scale" aria-hidden="true">
            <span>0s</span>
            <span>1.8s</span>
            <span>3.6s</span>
          </div>
        </div>
      </div>
      <p className="pv-note">Hover the sketch or the timeline, or turn on Play, and the playhead runs with the sketch.</p>

      <h2 className="pv-h pv-h--section" id="illustration-making">Making one</h2>
      <ol className="pv-illo__steps">
        <li>Write the idea as one sentence. The sketch shows only that sentence.</li>
        <li>Draw the still frame from the kit on the 17 × 9.5rem canvas, and pick the one part that takes the key colour.</li>
        <li>Add two or three beats on the 3.6s loop, each leaving rest and coming back to it.</li>
        <li>Check it in dark, light and high contrast, in RTL, at phone width and with reduced motion.</li>
        <li>Put it in an aria-hidden box beside text that says the same thing.</li>
      </ol>
      <p className="pv-note">
        These sketches are part of this site, not the package: <code className="ayy-code">preview/src/illustrations.tsx</code>, styled under{" "}
        <code className="ayy-code">.pv-art</code> in <code className="ayy-code">preview/src/preview.css</code>.
      </p>
    </article>
  );
}
