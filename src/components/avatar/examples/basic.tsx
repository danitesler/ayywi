import { Avatar, AvatarGroup, Badge } from "ayywi/react";

const photo =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%235b9dff'/><circle cx='20' cy='16' r='7' fill='%23dbe8ff'/><rect x='8' y='26' width='24' height='14' rx='7' fill='%23dbe8ff'/></svg>";

export default function Example() {
  return (
    <>
      <Avatar name="Maya Chen" src={photo} size="sm" />
      <Avatar name="Maya Chen" src={photo} />
      <Avatar name="Leo Park" size="lg" />
      <Avatar name="Broken Image" src="/missing.png" size="lg" />
      <Avatar name="Northwind" shape="square" size="xl" />
      <AvatarGroup aria-label="4 collaborators">
        <Avatar name="Maya Chen" src={photo} />
        <Avatar name="Leo Park" />
        <Avatar name="Ana Ruiz" />
        <Avatar name="Sam Okafor" />
      </AvatarGroup>
      <Badge variant="muted">+3</Badge>
    </>
  );
}
