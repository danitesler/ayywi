import { DataList, DataListItem } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <DataList row style={{ inlineSize: "100%" }}>
      <DataListItem label="Role">Product designer</DataListItem>
      <DataListItem label="Company">
        <a className="ayy-link" href="#oktopost">
          oktopost.com
        </a>
      </DataListItem>
      <DataListItem label="Years">2023 – present</DataListItem>
      <DataListItem label="Platform">Web, mobile web &amp; email</DataListItem>
    </DataList>
  );
}
