# Chat

Category: Data display. A conversation: incoming bubbles at the start edge, the reader's own inverted at the end, a typing indicator and quick-reply buttons.

**Classes**
- `.ayy-chat` — Root. role="log" when messages arrive live, so they're announced.
- `.ayy-chat__message` — One message row: an optional avatar and its bubble.
- `.ayy-chat__message--out` — Sent by the reader: end edge, primary colours.
- `.ayy-chat__bubble` — The bubble. The corner by the avatar is squared off.
- `.ayy-chat__typing` — Three pulsing dots inside a bubble while a reply is written. Give it role="img" and an aria-label.
- `.ayy-chat__replies` — Quick replies under the conversation: small outline buttons, at the end edge.

**JS (framework-free)**: chatMessageClass({ direction?, className? }) → string; chatClass, chatBubbleClass, chatTypingClass, chatRepliesClass constants.

**React** — `import { Chat, ChatMessage, ChatTyping, ChatReplies } from "@danitesler/ayywi/react";`
- `<Chat>` renders <div role="log" class="ayy-chat">.
- `<ChatMessage>` renders <div class="ayy-chat__message"> with the avatar and a bubble around children. Props: `direction` "in" | "out"; `avatar` ReactNode — e.g. an Avatar size sm.
- `<ChatTyping>` renders A message whose bubble holds the typing dots. Props: `label` Screen-reader text. Default "Typing" (translate it).; `avatar` ReactNode
- `<ChatReplies>` renders <div class="ayy-chat__replies">.

**Accessibility**
- Use role="log" on the conversation when messages arrive while the reader watches; they're announced politely, in order.
- The typing dots are an image with a name ("Dani is typing"); remove the element when the message lands.
- Quick replies are real buttons; after one is chosen, move focus to the next sensible place, not back to the top.

**Do**
- Use chat for AI assistants and agents, and for support or feedback widgets.
- On a marketing page, use it for a scripted "say hi" section that hands off to email or LinkedIn.
- Keep bubbles short; split long answers into several messages.
- Pair incoming messages with the sender's avatar the first time.

**Don't**
- Don't use it for comments and threads on a document — use a List (or cards for long comments).
- Don't use it for toast-style status messages — use Toast.
- Don't auto-scroll the page while someone is reading above.
- Don't use colour alone to tell who's speaking; the side and avatar do it too.

## Chat — Conversation with quick replies

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-chat" role="log" aria-label="Chat with Dani" style="inline-size: min(100%, 26rem)">
  <div class="ayy-chat__message">
    <span class="ayy-avatar ayy-avatar--sm" role="img" aria-label="Dani"><span class="ayy-avatar__fallback" aria-hidden="true">DT</span></span>
    <div class="ayy-chat__bubble">Hey, I'm Dani. What's on your mind?</div>
  </div>
  <div class="ayy-chat__message ayy-chat__message--out">
    <div class="ayy-chat__bubble">I have a project.</div>
  </div>
  <div class="ayy-chat__message">
    <span class="ayy-avatar ayy-avatar--sm" role="img" aria-label="Dani"><span class="ayy-avatar__fallback" aria-hidden="true">DT</span></span>
    <div class="ayy-chat__bubble"><span class="ayy-chat__typing" role="img" aria-label="Dani is typing"><span></span><span></span><span></span></span></div>
  </div>
  <div class="ayy-chat__replies">
    <button type="button" class="ayy-button ayy-button--outline ayy-button--sm">Need design advice</button>
    <button type="button" class="ayy-button ayy-button--outline ayy-button--sm">Just saying hi</button>
  </div>
</div>
```

React:

```tsx
import { Avatar, Button, Chat, ChatMessage, ChatReplies, ChatTyping } from "@danitesler/ayywi/react";

export default function Example() {
  const dani = <Avatar size="sm" name="Dani" fallback="DT" />;
  return (
    <Chat aria-label="Chat with Dani" style={{ inlineSize: "min(100%, 26rem)" }}>
      <ChatMessage avatar={dani}>Hey, I'm Dani. What's on your mind?</ChatMessage>
      <ChatMessage direction="out">I have a project.</ChatMessage>
      <ChatTyping avatar={dani} label="Dani is typing" />
      <ChatReplies>
        <Button variant="outline" size="sm">
          Need design advice
        </Button>
        <Button variant="outline" size="sm">
          Just saying hi
        </Button>
      </ChatReplies>
    </Chat>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
