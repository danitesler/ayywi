import { Chip, ChipGroup } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <ChipGroup aria-label="Status">
        <Chip name="status" value="open" defaultChecked count={12}>
          Open
        </Chip>
        <Chip name="status" value="pending" count={4}>
          Pending
        </Chip>
        <Chip name="status" value="closed" count={31}>
          Closed
        </Chip>
      </ChipGroup>
      <ChipGroup role="radiogroup" aria-label="Category">
        <Chip type="radio" name="category" value="all" defaultChecked>
          All
        </Chip>
        <Chip type="radio" name="category" value="coffee">
          Coffee
        </Chip>
        <Chip type="radio" name="category" value="tea">
          Tea
        </Chip>
        <Chip type="radio" name="category" value="gear">
          Brewing gear
        </Chip>
      </ChipGroup>
    </div>
  );
}
