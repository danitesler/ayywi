import { Icon, Tabs, TabsContent, TabsList, TabsTrigger } from "@danitesler/ayywi/react";
import { Notification03Icon, SecurityIcon, UserIcon } from "@hugeicons/core-free-icons";

export default function Example() {
  return (
    <Tabs defaultValue="account">
      <TabsList aria-label="Settings">
        <TabsTrigger value="account" icon={<Icon icon={UserIcon} />}>
          Account
        </TabsTrigger>
        <TabsTrigger value="notifications" icon={<Icon icon={Notification03Icon} />}>
          Notifications
        </TabsTrigger>
        <TabsTrigger value="security" icon={<Icon icon={SecurityIcon} />}>
          Security
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="ayy-muted">Manage your profile details and email address.</p>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="ayy-muted">Choose what updates you want to receive.</p>
      </TabsContent>
      <TabsContent value="security">
        <p className="ayy-muted">Two-factor authentication and active sessions.</p>
      </TabsContent>
    </Tabs>
  );
}
