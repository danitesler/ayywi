import { buttonClass } from "ayywi/react";

export default function Example() {
  return (
    <>
      <a href="#connect" className={buttonClass({ variant: "ring", size: "lg" })}>
        Let's connect
      </a>
      <a href="#work" className={buttonClass({ variant: "outline", size: "lg" })}>
        See the work
      </a>
    </>
  );
}
