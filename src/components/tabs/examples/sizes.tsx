import { Tabs, TabsContent, TabsList, TabsTrigger } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <Tabs size="sm" defaultValue="all">
        <TabsList aria-label="Small tabs">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" />
        <TabsContent value="open" />
        <TabsContent value="closed" />
      </Tabs>
      <Tabs defaultValue="all">
        <TabsList aria-label="Medium tabs">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" />
        <TabsContent value="open" />
        <TabsContent value="closed" />
      </Tabs>
      <Tabs size="lg" defaultValue="all">
        <TabsList aria-label="Large tabs">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" />
        <TabsContent value="open" />
        <TabsContent value="closed" />
      </Tabs>
    </div>
  );
}
