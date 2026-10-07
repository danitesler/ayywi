# File upload

Category: Forms. A drop zone that is also a file picker: a label around a native file input that covers it, so clicking opens the picker and dropping files lands on the input, with no script. Show what was picked in a List with Progress. Also called: dropzone, drop-zone, uploader, file-drop.

**Classes**
- `.ayy-dropzone` — The <label>: dashed border, centred icon and text. Its <input type="file"> covers it and draws nothing. data-dragging while files are held over it (set by @danitesler/ayywi/elements or React).
- `.ayy-dropzone--compact` — One line (icon, then text), for a form field or a composer.
- `.ayy-dropzone__title` — Main line: "Drop files here or browse" (the word styled .ayy-link).
- `.ayy-dropzone__hint` — What's accepted: types and size.

**States**
- `[data-dragging]` — Files are held over it: solid border in the text colour.
- `input:disabled` — Dimmed, not clickable.
- `input[aria-invalid="true"]` — Rejected file: red border; say why in a FieldError.

**JS (framework-free)**: dropzoneClass({ compact?, className? }) → string; dropzoneTitleClass, dropzoneHintClass constants; dropzoneIcon (SVG markup); trackDropzones(root?) sets data-dragging on every .ayy-dropzone under root while files are dragged over (@danitesler/ayywi/elements runs it for the document); dragHasFiles(event).

**React** — `import { Dropzone } from "@danitesler/ayywi/react";`
- `<Dropzone>` renders <label class="ayy-dropzone"><input type="file"><svg><span class="ayy-dropzone__title">…. Props: `title` ReactNode, default "Drop files here or browse"; `hint` ReactNode — types and size; `icon` ReactNode — replaces the upload icon; null for none; `onFiles` (files: File[]) => void — check types and sizes here: accept isn't enforced on a drop; `compact` boolean; `className` On the <label>; every other prop (accept, multiple, name, id, disabled…) goes to the input; `style` On the <label>

**Accessibility**
- It's a native file input inside its label: Tab reaches it, Enter or Space opens the picker, and the title and hint are its name. A visible Label (htmlFor its id) names it in a form.
- Dragging is an extra: everything works with the picker alone.
- List the picked files in text, each with a remove button that names the file ("Remove studio-front.jpg"), and progress with a Progress bar that has a label.

**Do**
- Use a file upload for attaching files to a record: photos, documents, a CSV to import. Say what's accepted in the hint.
- Show each picked file below it in a List divided, with its size, a Progress bar while it uploads, and a remove button.
- Use compact inside a form next to other fields, and the box when the upload is the main task of the screen.
- Validate type and size when files arrive (onFiles), and show a FieldError with aria-invalid on the input when one is rejected.

**Don't**
- Don't hide the file input or rebuild it from divs: the native input is what makes it keyboard and screen-reader friendly.
- Don't use it for pasting a link — use an Input of type url.
- Don't make dropping the only way: the zone must stay clickable.

## File upload — Photos with upload progress

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 28rem)">
  <label class="ayy-dropzone"><input type="file" accept="image/png, image/jpeg" multiple="" name="photos"/><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12 13L12 21M12 13C11.2998 13 9.99153 14.9943 9.5 15.5M12 13C12.7002 13 14.0085 14.9943 14.5 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-dropzone__title">Drop files here or <span class="ayy-link">browse</span></span><span class="ayy-dropzone__hint">PNG or JPG, up to 5 MB each</span></label>
  <ul class="ayy-list ayy-list--divided" aria-label="Uploads">
    <li class="ayy-list__item">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="7.5" cy="7.5" r="1.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M5 21C9.37246 15.775 14.2741 8.88406 21.4975 13.5424" stroke="currentColor" stroke-width="1.5"></path></svg>
      <div class="ayy-list__content">
        <p class="ayy-list__title">studio-front.jpg</p>
        <p class="ayy-list__description">2.4 MB</p>
      </div>
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Remove studio-front.jpg"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
    </li>
    <li class="ayy-list__item">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="7.5" cy="7.5" r="1.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M5 21C9.37246 15.775 14.2741 8.88406 21.4975 13.5424" stroke="currentColor" stroke-width="1.5"></path></svg>
      <div class="ayy-list__content">
        <p class="ayy-list__title">class-schedule.png</p>
        <p class="ayy-list__description">860 KB · uploading, 64%</p>
        <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="64" class="ayy-progress ayy-progress--sm" style="--ayy-value: 64" aria-label="Uploading class-schedule.png">
          <div class="ayy-progress__bar"></div>
        </div>
      </div>
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Remove class-schedule.png"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
    </li>
  </ul>
</div>
```

React:

```tsx
import { Delete02Icon, Image01Icon } from "@hugeicons/core-free-icons";
import { Button, Dropzone, Icon, List, ListContent, ListDescription, ListItem, ListTitle, Progress } from "@danitesler/ayywi/react";

const files = [
  { name: "studio-front.jpg", size: "2.4 MB", progress: 100 },
  { name: "class-schedule.png", size: "860 KB", progress: 64 },
];

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 28rem)" }}>
      <Dropzone accept="image/png, image/jpeg" multiple name="photos" hint="PNG or JPG, up to 5 MB each" />
      <List divided aria-label="Uploads">
        {files.map((file) => (
          <ListItem key={file.name}>
            <Icon icon={Image01Icon} />
            <ListContent>
              <ListTitle>{file.name}</ListTitle>
              <ListDescription>{file.progress < 100 ? `${file.size} · uploading, ${file.progress}%` : file.size}</ListDescription>
              {file.progress < 100 && <Progress value={file.progress} size="sm" aria-label={`Uploading ${file.name}`} />}
            </ListContent>
            <Button variant="ghost" size="icon-sm" aria-label={`Remove ${file.name}`}>
              <Icon icon={Delete02Icon} />
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
```

## File upload — Compact, in a form

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-field" style="inline-size: min(100%, 24rem)">
  <label class="ayy-label" for="cv">CV</label>
  <label class="ayy-dropzone ayy-dropzone--compact"><input type="file" id="cv" accept=".pdf" aria-describedby="cv-hint"/><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12 13L12 21M12 13C11.2998 13 9.99153 14.9943 9.5 15.5M12 13C12.7002 13 14.0085 14.9943 14.5 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-dropzone__title">Drop a PDF or <span class="ayy-link">choose a file</span></span></label>
  <p class="ayy-field__hint" id="cv-hint">One file, up to 10 MB.</p>
</div>
```

React:

```tsx
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
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
