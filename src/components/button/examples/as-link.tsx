import { buttonClass } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <a href="#docs" className={buttonClass({ variant: "outline" })}>
        Read the docs
      </a>
      <a href="#docs" className={buttonClass({ variant: "ghost", size: "sm" })}>
        Changelog
      </a>
    </>
  );
}
