import { Field, FieldHint, Dropzone, Label } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 24rem)" }}>
      <Label htmlFor="cv">CV</Label>
      <Dropzone
        id="cv"
        compact
        accept=".pdf"
        title={
          <>
            Drop a PDF or <span className="ayy-link">choose a file</span>
          </>
        }
        aria-describedby="cv-hint"
      />
      <FieldHint id="cv-hint">One file, up to 10 MB.</FieldHint>
    </Field>
  );
}
