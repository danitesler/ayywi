import {
  Button,
  CardToast,
  CardToastAction,
  CardToastBackdrop,
  CardToastCenter,
  CardToastClose,
  CardToastCorner,
  CardToastImage,
  CardToastScrim,
  Icon,
  InlineToast,
} from "@danitesler/ayywi/react";
import {
  CheckmarkCircle02Icon,
  CloudUploadIcon,
  Delete02Icon,
  Edit02Icon,
  Folder01Icon,
  PinIcon,
} from "@hugeicons/core-free-icons";

const SAMPLE_CARD =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350' viewBox='0 0 560 350'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><rect x='40' y='40' width='480' height='270' rx='12' fill='%23ffffff' fill-opacity='0.15'/><circle cx='80' cy='75' r='8' fill='%23ffffff' fill-opacity='0.6'/><circle cx='105' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><circle cx='130' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='110' width='200' height='20' rx='6' fill='%23ffffff' fill-opacity='0.8'/><rect x='60' y='145' width='440' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='170' width='380' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='210' width='120' height='36' rx='8' fill='%23ffffff' fill-opacity='0.9'/></svg>";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)", gap: "var(--ayy-space-3)" }}>
      {/* Standalone with icon */}
      <div>
        <InlineToast tone="success" icon={<Icon icon={CheckmarkCircle02Icon} size="sm" />}>
          Inline toast (with icon)
        </InlineToast>
      </div>

      {/* Standalone without icon */}
      <div>
        <InlineToast>Inline toast (without icon)</InlineToast>
      </div>

      {/* Embedded within CardToast */}
      <CardToast data-hover aria-label="Card toast with inline feedback">
        <CardToastBackdrop src={SAMPLE_CARD} />
        <CardToastImage src={SAMPLE_CARD} alt="Card preview" />
        <CardToastScrim>
          <CardToastClose label="Dismiss preview" />
          <CardToastCorner position="top-start">
            <CardToastAction label="Annotate">
              <Icon icon={Edit02Icon} size="sm" />
            </CardToastAction>
            <CardToastAction label="Pin to screen">
              <Icon icon={PinIcon} size="sm" />
            </CardToastAction>
          </CardToastCorner>
          <CardToastCenter>
            <Button size="sm">Copy</Button>
            <Button size="sm" variant="secondary">Save</Button>
          </CardToastCenter>
          <CardToastCorner position="bottom-start">
            <CardToastAction label="Share link">
              <Icon icon={CloudUploadIcon} size="sm" />
            </CardToastAction>
          </CardToastCorner>
          <CardToastCorner position="bottom-end">
            <CardToastAction label="Show in folder">
              <Icon icon={Folder01Icon} size="sm" />
            </CardToastAction>
            <CardToastAction label="Delete">
              <Icon icon={Delete02Icon} size="sm" />
            </CardToastAction>
          </CardToastCorner>
        </CardToastScrim>
        <InlineToast tone="success" icon={<Icon icon={CheckmarkCircle02Icon} size="sm" />}>
          Copied to clipboard
        </InlineToast>
      </CardToast>
    </div>
  );
}
