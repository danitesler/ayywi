import { ChoiceCard, ChoiceGroup } from "ayywi/react";

const slots = [
  { time: "07:00", left: 6 },
  { time: "08:30", left: 2 },
  { time: "12:15", left: 9 },
  { time: "17:30", left: 0 },
  { time: "18:30", left: 3 },
  { time: "20:00", left: 11 },
];

export default function Example() {
  return (
    <ChoiceGroup legend="Tuesday, October 14" name="slot" defaultValue="18:30" style={{ inlineSize: "min(100%, 28rem)" }}>
      {slots.map((slot) => (
        <ChoiceCard
          key={slot.time}
          compact
          value={slot.time}
          title={slot.time}
          description={slot.left ? `${slot.left} spots left` : "Full"}
          disabled={!slot.left}
        />
      ))}
    </ChoiceGroup>
  );
}
