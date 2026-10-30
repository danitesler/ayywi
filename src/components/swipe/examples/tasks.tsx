import { Clock01Icon, Delete02Icon, PinIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon, listClass, Swipe, SwipeAction } from "@danitesler/ayywi/react";

const TASKS = [
  { id: "milk", title: "Buy milk", due: "Today" },
  { id: "call", title: "Call the bank about the card", due: "Tomorrow" },
  { id: "trip", title: "Book the train to Lisbon", due: "Fri" },
];

export default function Example() {
  // Swipe a row (or drag it with the mouse). Keyboards reach the buttons with Tab.
  return (
    <div className={listClass({ divided: true })} style={{ inlineSize: "min(100%, 24rem)", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)", overflow: "hidden" }}>
      {TASKS.map((task) => (
        <Swipe
          key={task.id}
          contentProps={{ className: "ayy-list__item" }}
          startActions={
            <SwipeAction variant="success" icon={<Icon icon={Tick02Icon} name="check" />}>
              Done
            </SwipeAction>
          }
          endActions={
            <>
              <SwipeAction icon={<Icon icon={PinIcon} name="pin" />}>Pin</SwipeAction>
              <SwipeAction variant="warning" icon={<Icon icon={Clock01Icon} name="clock" />}>
                Snooze
              </SwipeAction>
              <SwipeAction variant="destructive" icon={<Icon icon={Delete02Icon} name="trash" />}>
                Delete
              </SwipeAction>
            </>
          }
        >
          <div className="ayy-list__content">
            <p className="ayy-list__title">{task.title}</p>
          </div>
          <span className="ayy-list__meta">{task.due}</span>
        </Swipe>
      ))}
    </div>
  );
}
