import { ArrowDown01Icon, Calendar03Icon, Clock01Icon, Copy01Icon, Rocket01Icon } from "@hugeicons/core-free-icons";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  SplitButton,
  toast,
} from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-cluster">
      <SplitButton>
        <Button onClick={() => toast.success("Deployed to production")}>
          <Icon icon={Rocket01Icon} />
          Deploy
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger size="icon" aria-label="More deploy options">
            <Icon icon={ArrowDown01Icon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem icon={<Icon icon={Rocket01Icon} />} onSelect={() => toast("Deploying preview…")}>
              Deploy to preview
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Icon icon={Calendar03Icon} />} onSelect={() => toast("Scheduled for 09:00")}>
              Schedule deploy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<Icon icon={Copy01Icon} />} onSelect={() => toast("Build command copied")}>
              Copy build command
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SplitButton>

      <SplitButton>
        <Button variant="outline" onClick={() => toast("Saved")}>
          Save changes
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger variant="outline" size="icon" aria-label="More save options">
            <Icon icon={ArrowDown01Icon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem icon={<Icon icon={Clock01Icon} />} onSelect={() => toast("Saved as draft")}>
              Save as draft
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Icon icon={Copy01Icon} />} onSelect={() => toast("Saved as template")}>
              Save as template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SplitButton>

      <SplitButton>
        <Button variant="secondary" size="sm" onClick={() => toast("Exported CSV")}>
          Export CSV
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger variant="secondary" size="icon-sm" aria-label="More export formats">
            <Icon icon={ArrowDown01Icon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => toast("Exported JSON")}>Export JSON</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast("Exported Parquet")}>Export Parquet</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SplitButton>
    </div>
  );
}
