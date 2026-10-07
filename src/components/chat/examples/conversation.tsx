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
