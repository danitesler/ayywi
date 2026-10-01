// React entry. Components render the exact markup documented for plain HTML, so both stay in sync.
// The build prepends "use client" so these work from React Server Components (Next.js App Router).
export * from "../index";

export { Button, type ButtonProps } from "../components/button/button.react";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardMedia,
  CardLink,
  type CardProps,
} from "../components/card/card.react";
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
  type TableHeadProps,
  type TableRowProps,
} from "../components/table/table.react";
export {
  BarChart,
  LineChart,
  Sparkline,
  BarList,
  type BarChartProps,
  type LineChartProps,
  type LineChartSeries,
  type ChartSeries,
  type ChartBaseProps,
  type SparklineProps,
  type BarListProps,
  type BarListItem,
} from "../components/chart/chart.react";
export {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarLink,
  NavbarActions,
  NavbarToggle,
  type NavbarLinkProps,
} from "../components/navbar/navbar.react";
export {
  AppShell,
  AppShellSidebar,
  AppShellBrand,
  AppShellNav,
  AppShellLink,
  AppShellFooter,
  AppShellMain,
  AppShellGroup,
  AppShellItem,
  AppShellSublist,
  AppShellCollapse,
  AppShellBar,
  AppShellToggle,
  type AppShellLinkProps,
  type AppShellGroupProps,
  type AppShellSublistProps,
  type AppShellCollapseProps,
} from "../components/app-shell/app-shell.react";
export { BottomNav, BottomNavLink, BottomNavButton, type BottomNavLinkProps, type BottomNavButtonProps } from "../components/bottom-nav/bottom-nav.react";
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from "../components/breadcrumb/breadcrumb.react";
export { Toc, type TocProps, type TocItem } from "../components/toc/toc.react";
export {
  Section,
  SectionHeader,
  SectionEyebrow,
  SectionTitle,
  SectionDescription,
  type SectionProps,
  type SectionEyebrowProps,
} from "../components/section/section.react";
export { Separator, type SeparatorProps } from "../components/separator/separator.react";
export { Carousel, CarouselSlide, type CarouselProps } from "../components/carousel/carousel.react";
export { ThemeToggle, type ThemeToggleProps } from "../components/theme-toggle/theme-toggle.react";
export { IconTile, type IconTileProps } from "../components/icon-tile/icon-tile.react";
export { Stat, type StatProps } from "../components/stat/stat.react";
export { DataList, DataListItem, type DataListProps, type DataListItemProps } from "../components/data-list/data-list.react";
export { Frame, type FrameProps } from "../components/frame/frame.react";
export {
  Chat,
  ChatMessage,
  ChatTyping,
  ChatReplies,
  type ChatMessageProps,
  type ChatTypingProps,
} from "../components/chat/chat.react";
export {
  PageHeader,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
} from "../components/page-header/page-header.react";
export {
  List,
  ListItem,
  ListContent,
  ListTitle,
  ListDescription,
  ListMeta,
  ListLink,
  type ListProps,
  type ListTitleProps,
  type ListLinkProps,
} from "../components/list/list.react";
export {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
  type EmptyStateProps,
} from "../components/empty-state/empty-state.react";
export { Spinner, type SpinnerProps } from "../components/spinner/spinner.react";
export { Kbd } from "../components/kbd/kbd.react";
export { InputGroup, InputGroupAddon, type InputGroupProps } from "../components/input-group/input-group.react";
export {
  SegmentedControl,
  SegmentedControlItem,
  type SegmentedControlProps,
  type SegmentedControlItemProps,
} from "../components/segmented-control/segmented-control.react";
export {
  Chip,
  ChipButton,
  ChipRemovable,
  ChipGroup,
  type ChipProps,
  type ChipButtonProps,
  type ChipRemovableProps,
  type ChipGroupProps,
} from "../components/chip/chip.react";
export { ChoiceGroup, ChoiceCard, type ChoiceGroupProps, type ChoiceCardProps } from "../components/choice-card/choice-card.react";
export { Slider, SliderRange, type SliderProps, type SliderRangeProps } from "../components/slider/slider.react";
export { NumberField, type NumberFieldProps } from "../components/number-field/number-field.react";
export { Combobox, type ComboboxProps, type ComboboxOption } from "../components/combobox/combobox.react";
export { Dropzone, type DropzoneProps } from "../components/dropzone/dropzone.react";
export { Pagination, type PaginationProps, type PaginationLabels } from "../components/pagination/pagination.react";
export { Accordion, AccordionItem, type AccordionProps, type AccordionItemProps } from "../components/accordion/accordion.react";
export { Steps, type StepsProps } from "../components/steps/steps.react";
export {
  Footer,
  FooterBrand,
  FooterNav,
  FooterGroup,
  FooterLink,
  FooterBottom,
  type FooterGroupProps,
} from "../components/footer/footer.react";
