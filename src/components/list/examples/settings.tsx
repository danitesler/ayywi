import { Mail01Icon, Notification01Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent, Icon, IconTile, List, ListContent, ListDescription, ListItem, ListTitle, Switch } from "ayywi/react";

const ROWS = [
  { id: "email", icon: Mail01Icon, title: "Email", text: "A summary of new invoices and payments, once a day.", on: true },
  { id: "push", icon: SmartPhone01Icon, title: "Push notifications", text: "Payments as they arrive, on your phone.", on: true },
  { id: "reminders", icon: Notification01Icon, title: "Payment reminders", text: "Nudge clients three days before an invoice is due.", on: false },
];

export default function Example() {
  return (
    <Card style={{ inlineSize: "min(100%, 30rem)" }}>
      <CardContent>
        <List divided aria-label="Notifications">
          {ROWS.map((r) => (
            <ListItem key={r.id}>
              <IconTile size="sm">
                <Icon icon={r.icon} />
              </IconTile>
              <ListContent>
                <ListTitle htmlFor={`notify-${r.id}`}>{r.title}</ListTitle>
                <ListDescription>{r.text}</ListDescription>
              </ListContent>
              <Switch id={`notify-${r.id}`} defaultChecked={r.on} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
