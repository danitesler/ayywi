import { DeliveryTruck01Icon, GiftIcon, Leaf01Icon } from "@hugeicons/core-free-icons";
import { ChoiceCard, ChoiceGroup, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <ChoiceGroup legend="Extras" type="checkbox" style={{ inlineSize: "100%" }}>
      <ChoiceCard
        icon={<Icon icon={GiftIcon} />}
        title="Gift wrap"
        description="Recycled paper and a handwritten card"
        meta="+$4"
        value="gift"
        inputProps={{ name: "extras" }}
      />
      <ChoiceCard
        icon={<Icon icon={DeliveryTruck01Icon} />}
        title="Express delivery"
        description="Tomorrow before noon"
        meta="+$9"
        value="express"
        inputProps={{ name: "extras" }}
        defaultChecked
      />
      <ChoiceCard
        icon={<Icon icon={Leaf01Icon} />}
        title="Plastic-free packing"
        description="Compostable bags and tape"
        meta="Free"
        value="plastic-free"
        inputProps={{ name: "extras" }}
      />
    </ChoiceGroup>
  );
}
