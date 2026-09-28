import { Tabs, TabsContent, TabsList, TabsTrigger } from "ayywi/react";

export default function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Project settings">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="ayy-muted">3 environments · 12 deploys this week</p>
      </TabsContent>
      <TabsContent value="activity">
        <p className="ayy-muted">Latest changes from your team.</p>
      </TabsContent>
      <TabsContent value="members">
        <p className="ayy-muted">People with access to this project.</p>
      </TabsContent>
    </Tabs>
  );
}
