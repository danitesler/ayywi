import { Accordion, AccordionItem } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 32rem)" }}>
      <Accordion size="sm">
        <AccordionItem label="Can I cancel any time?" open>
          <p>Yes. Your plan runs to the end of the billing period.</p>
        </AccordionItem>
        <AccordionItem label="Do viewers need a paid seat?">
          <p>No. Viewers and commenters are free on every plan.</p>
        </AccordionItem>
      </Accordion>
      <Accordion>
        <AccordionItem label="Can I cancel any time?" open>
          <p>Yes. Your plan runs to the end of the billing period.</p>
        </AccordionItem>
        <AccordionItem label="Do viewers need a paid seat?">
          <p>No. Viewers and commenters are free on every plan.</p>
        </AccordionItem>
      </Accordion>
      <Accordion size="lg">
        <AccordionItem label="Can I cancel any time?" open>
          <p>Yes. Your plan runs to the end of the billing period.</p>
        </AccordionItem>
        <AccordionItem label="Do viewers need a paid seat?">
          <p>No. Viewers and commenters are free on every plan.</p>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
