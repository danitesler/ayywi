import { Icon, Tabs, TabsContent, TabsList, TabsTrigger } from "@danitesler/ayywi/react";
import { CodeIcon, GitPullRequestIcon, RocketIcon } from "@hugeicons/core-free-icons";

export default function Example() {
  return (
    <Tabs defaultValue="code">
      <TabsList aria-label="Project">
        <TabsTrigger value="code" icon={<Icon icon={CodeIcon} name="code" />}>
          Code
        </TabsTrigger>
        <TabsTrigger value="pull-requests" icon={<Icon icon={GitPullRequestIcon} name="git-pull-request" />}>
          Pull requests
        </TabsTrigger>
        <TabsTrigger value="deployments" icon={<Icon icon={RocketIcon} name="rocket" />}>
          Deployments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="code">
        <p className="ayy-muted">Browse repository source files and commits.</p>
      </TabsContent>
      <TabsContent value="pull-requests">
        <p className="ayy-muted">Review open proposals and merge requests.</p>
      </TabsContent>
      <TabsContent value="deployments">
        <p className="ayy-muted">View production releases and deploy status.</p>
      </TabsContent>
    </Tabs>
  );
}
