import { Tabs, TabsContent, TabsList, TabsTrigger } from "ayywi/react";

export default function Example() {
  return (
    <Tabs defaultValue="all">
      <TabsList aria-label="Filter projects">
        <TabsTrigger value="all">
          All <span className="ayy-tabs__count">18</span>
        </TabsTrigger>
        <TabsTrigger value="templates">
          Design templates <span className="ayy-tabs__count">6</span>
        </TabsTrigger>
        <TabsTrigger value="extensions">
          Extensions <span className="ayy-tabs__count">12</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <p className="ayy-muted">Every Figma resource and plugin.</p>
      </TabsContent>
      <TabsContent value="templates">
        <p className="ayy-muted">UI kits, icon packs and website sections.</p>
      </TabsContent>
      <TabsContent value="extensions">
        <p className="ayy-muted">Open-source add-ons for Playnite.</p>
      </TabsContent>
    </Tabs>
  );
}
