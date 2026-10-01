import { Accordion, AccordionItem } from "ayywi/react";

export default function Example() {
  return (
    <Accordion single style={{ inlineSize: "min(100%, 40rem)" }}>
      <AccordionItem label="Can I cancel any time?" open>
        <p>Yes. Your plan runs to the end of the billing period, then your projects switch to read-only. Nothing is deleted for 90 days.</p>
      </AccordionItem>
      <AccordionItem label="Do viewers need a paid seat?">
        <p>No. Only people who edit pages count as editors. Viewers and commenters are free on every plan.</p>
      </AccordionItem>
      <AccordionItem label="Where is my data stored?">
        <p>In the EU or the US, your choice when you create a workspace. Backups stay in the same region.</p>
        <p>Enterprise plans can bring their own storage bucket.</p>
      </AccordionItem>
    </Accordion>
  );
}
