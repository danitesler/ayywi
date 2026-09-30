import { DashboardSquare01Icon, Folder01Icon, Notification03Icon, UserIcon } from "@hugeicons/core-free-icons";
import { BottomNav, BottomNavLink, Icon } from "ayywi/react";

export default function Example() {
  // A phone-sized screen. The nav is sticky, so it stays at the bottom of whatever scrolls: the page, or a box like this one.
  return (
    <div style={{ display: "flex", flexDirection: "column", inlineSize: "min(100%, 24rem)", blockSize: "22rem", overflow: "auto", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <div className="ayy-stack" style={{ flex: 1, padding: "var(--ayy-space-4)" }}>
        <h2 className="ayy-h4">Home</h2>
        <p className="ayy-muted">Three deploys went out this morning. Nothing needs you.</p>
      </div>
      <BottomNav>
        <BottomNavLink href="#home" icon={<Icon icon={DashboardSquare01Icon} />} current>
          Home
        </BottomNavLink>
        <BottomNavLink href="#projects" icon={<Icon icon={Folder01Icon} />}>
          Projects
        </BottomNavLink>
        <BottomNavLink href="#inbox" icon={<Icon icon={Notification03Icon} />}>
          Inbox
        </BottomNavLink>
        <BottomNavLink href="#account" icon={<Icon icon={UserIcon} />}>
          Account
        </BottomNavLink>
      </BottomNav>
    </div>
  );
}
