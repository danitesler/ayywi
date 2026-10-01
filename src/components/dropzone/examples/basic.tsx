import { Delete02Icon, Image01Icon } from "@hugeicons/core-free-icons";
import { Button, Dropzone, Icon, List, ListContent, ListDescription, ListItem, ListTitle, Progress } from "ayywi/react";

const files = [
  { name: "studio-front.jpg", size: "2.4 MB", progress: 100 },
  { name: "class-schedule.png", size: "860 KB", progress: 64 },
];

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 28rem)" }}>
      <Dropzone accept="image/png, image/jpeg" multiple name="photos" hint="PNG or JPG, up to 5 MB each" />
      <List divided aria-label="Uploads">
        {files.map((file) => (
          <ListItem key={file.name}>
            <Icon icon={Image01Icon} />
            <ListContent>
              <ListTitle>{file.name}</ListTitle>
              <ListDescription>{file.progress < 100 ? `${file.size} · uploading, ${file.progress}%` : file.size}</ListDescription>
              {file.progress < 100 && <Progress value={file.progress} size="sm" aria-label={`Uploading ${file.name}`} />}
            </ListContent>
            <Button variant="ghost" size="icon-sm" aria-label={`Remove ${file.name}`}>
              <Icon icon={Delete02Icon} />
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
