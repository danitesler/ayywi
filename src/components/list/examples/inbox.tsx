import { Avatar, Badge, List, ListContent, ListDescription, ListItem, ListLink, ListMeta, ListTitle } from "@danitesler/ayywi/react";

const THREADS = [
  { name: "Jonah Weiss", text: "The export button spins forever on large reports.", time: "2m", status: "Urgent", variant: "destructive", current: true },
  { name: "Ana Ruiz", text: "Can we move our billing date to the 1st?", time: "18m", status: "Billing", variant: "info" },
  { name: "Leo Park", text: "Thanks, that fixed it!", time: "1h", status: "Solved", variant: "success" },
] as const;

export default function Example() {
  return (
    <div style={{ inlineSize: "min(100%, 26rem)" }}>
      <List aria-label="Conversations">
        {THREADS.map((t) => (
          <ListItem key={t.name}>
            <Avatar name={t.name} size="sm" />
            <ListContent>
              <ListTitle>
                <ListLink href={`#${t.name.split(" ")[0].toLowerCase()}`} current={"current" in t}>
                  {t.name}
                </ListLink>
              </ListTitle>
              <ListDescription className="ayy-truncate">{t.text}</ListDescription>
              <Badge variant={t.variant}>{t.status}</Badge>
            </ListContent>
            <ListMeta>{t.time}</ListMeta>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
