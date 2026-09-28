// React entry. Components render the exact markup documented for plain HTML, so both stay in sync.
// The build prepends "use client" so these work from React Server Components (Next.js App Router).
export * from "../index";

export { Button, type ButtonProps } from "../components/button/button.react";
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, type CardProps } from "../components/card/card.react";
export { Badge, type BadgeProps } from "../components/badge/badge.react";
export { Input, type InputProps } from "../components/input/input.react";
export { Textarea, type TextareaProps } from "../components/textarea/textarea.react";
export { Select, type SelectProps } from "../components/select/select.react";
export { Checkbox, type CheckboxProps } from "../components/checkbox/checkbox.react";
export { RadioGroup, Radio, type RadioGroupProps, type RadioProps } from "../components/radio/radio.react";
export { Field, Label, FieldHint, FieldError, type FieldProps } from "../components/field/field.react";
export { Switch, type SwitchProps } from "../components/switch/switch.react";
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsProps,
  type TabsTriggerProps,
  type TabsContentProps,
} from "../components/tabs/tabs.react";
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  type DialogProps,
  type DialogContentProps,
} from "../components/dialog/dialog.react";
export { Popover, PopoverTrigger, PopoverContent, type PopoverProps, type PopoverContentProps } from "../components/popover/popover.react";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  type DropdownMenuProps,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
} from "../components/menu/menu.react";
export { Tooltip, type TooltipProps } from "../components/tooltip/tooltip.react";
export { Toaster, type ToasterProps } from "../components/toast/toast.react";
export { Alert, AlertTitle, AlertDescription, AlertActions, type AlertProps } from "../components/alert/alert.react";
export { Progress, type ProgressProps } from "../components/progress/progress.react";
export { Skeleton, type SkeletonProps } from "../components/skeleton/skeleton.react";
export { Avatar, AvatarGroup, type AvatarProps } from "../components/avatar/avatar.react";
export { Icon, type IconProps } from "../components/icon/icon.react";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  type TableProps,
  type TableCellProps,
} from "../components/table/table.react";
