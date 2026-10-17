import { useState } from "react";
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
  CardToastThumb,
  Icon,
  NotificationToast,
} from "@danitesler/ayywi/react";
import {
  CancelCircleIcon,
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
  const [, setDismissed] = useState(false);

  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)", gap: "var(--ayy-space-3)" }}>
      {/* 1. Default toast */}
      <NotificationToast
        title="Default toast"
        onClose={() => setDismissed(true)}
      />

      {/* 2. Status toast (success) */}
      <NotificationToast
        variant="success"
        icon={<Icon icon={CheckmarkCircle02Icon} size="sm" />}
        title="Success toast"
        description="Marketing site is live."
        onClose={() => setDismissed(true)}
      />

      {/* 3. With action */}
      <NotificationToast
        title="Action toast"
        action={{ label: "Undo", onClick: () => {} }}
        onClose={() => setDismissed(true)}
      />

      {/* 4. Error / Destructive */}
      <NotificationToast
        variant="destructive"
        icon={<Icon icon={CancelCircleIcon} size="sm" />}
        title="Error toast"
        description="3 type errors in api/server.ts"
        onClose={() => setDismissed(true)}
      />

      {/* 5. Card toast */}
      <CardToast data-hover aria-label="Interactive card toast preview">
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
      </CardToast>

      {/* 6. Split card toast (preview + text) */}
      <CardToast split aria-label="Screenshot preview">
        <CardToastThumb>
          <CardToastBackdrop src={SAMPLE_CARD} />
          <CardToastImage src={SAMPLE_CARD} alt="Screenshot thumbnail" />
        </CardToastThumb>
        <div className="ayy-toast__content">
          <p className="ayy-toast__title">Screenshot_2026-10-16.png</p>
          <p className="ayy-toast__description">1920×1080 • 1.2 MB</p>
          <div className="ayy-toast__actions">
            <Button size="sm">Copy</Button>
            <Button size="sm" variant="secondary">Share</Button>
          </div>
        </div>
        <CardToastClose label="Dismiss preview" />
      </CardToast>

      {/* 7. Long text toast with copy button */}
      <NotificationToast
        variant="long"
        title="Webhook verification secret"
        description="whsec_9b2e8a1f4c7d0e3b5a6f8c2e4d6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2"
        onClose={() => setDismissed(true)}
      />
    </div>
  );
}
