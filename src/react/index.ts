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
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardContentProps,
  type CardFooterProps,
  type CardMediaProps,
  type CardLinkProps,
} from "../components/card/card.react";
export {
  Showcase,
  ShowcaseHeader,
  ShowcaseTitle,
  ShowcaseActions,
  ShowcaseStage,
  ShowcaseViewport,
  ShowcaseBody,
  type ShowcaseProps,
  type ShowcaseHeaderProps,
  type ShowcaseTitleProps,
  type ShowcaseActionsProps,
  type ShowcaseStageProps,
  type ShowcaseViewportProps,
  type ShowcaseBodyProps,
} from "../components/showcase/showcase.react";
export { Badge, type BadgeProps } from "../components/badge/badge.react";
export { StatusDot, type StatusDotProps } from "../components/status-dot/status-dot.react";
export { Input, type InputProps, InputGroup, InputGroupAddon, type InputGroupProps } from "../components/input/input.react";
export { Textarea, type TextareaProps } from "../components/textarea/textarea.react";
export { Select, type SelectProps } from "../components/select/select.react";
export { Checkbox, type CheckboxProps } from "../components/checkbox/checkbox.react";
export { RadioGroup, Radio, type RadioGroupProps, type RadioProps } from "../components/radio/radio.react";
export {
  Field,
  Label,
  FieldHint,
  FieldError,
  type FieldProps,
  type LabelProps,
  type FieldHintProps,
  type FieldErrorProps,
} from "../components/field/field.react";
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
  type DialogTriggerProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogBodyProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogCloseProps,
} from "../components/dialog/dialog.react";
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  type PopoverProps,
  type PopoverTriggerProps,
  type PopoverContentProps,
} from "../components/popover/popover.react";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSelectedItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  type DropdownMenuProps,
  type DropdownMenuTriggerProps,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
  type DropdownMenuSubProps,
  type DropdownMenuSubTriggerProps,
  type DropdownMenuSubContentProps,
  type DropdownMenuCheckboxItemProps,
  type DropdownMenuSelectedItemProps,
  type DropdownMenuRadioGroupProps,
  type DropdownMenuRadioItemProps,
} from "../components/menu/menu.react";
export { Tooltip, type TooltipProps } from "../components/tooltip/tooltip.react";
export {
  Toaster,
  NotificationToast,
  Toast,
  InlineToast,
  CardToast,
  CardToastBackdrop,
  CardToastImage,
  CardToastMedia,
  CardToastScrim,
  CardToastClose,
  CardToastCorner,
  CardToastCenter,
  CardToastAction,
  CardToastStatus,
  CardToastThumb,
  type ToasterProps,
  type NotificationToastProps,
  type InlineToastProps,
  type CardToastProps,
  type CardToastBackdropProps,
  type CardToastImageProps,
  type CardToastMediaProps,
  type CardToastScrimProps,
  type CardToastCloseProps,
  type CardToastCornerProps,
  type CardToastCenterProps,
  type CardToastActionProps,
  type CardToastStatusProps,
  type CardToastThumbProps,
} from "../components/toast/toast.react";
export { cardToast, inlineToastClass, type CardToastOptions, type CardToastHandle } from "../components/toast/toast";

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
  type AlertProps,
  type AlertTitleProps,
  type AlertDescriptionProps,
  type AlertActionsProps,
} from "../components/alert/alert.react";
export { Progress, type ProgressProps } from "../components/progress/progress.react";
export { ProgressRing, type ProgressRingProps } from "../components/progress-ring/progress-ring.react";
export { Skeleton, type SkeletonProps } from "../components/skeleton/skeleton.react";
export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from "../components/avatar/avatar.react";
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
  TableRowActions,
  type TableProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableFooterProps,
  type TableRowProps,
  type TableCellProps,
  type TableHeadProps,
  type TableRowActionsProps,
  type TableCaptionProps,
} from "../components/table/table.react";
export {
  ActionBar,
  ActionBarSelection,
  ActionBarCount,
  ActionBarClose,
  ActionBarSeparator,
  ActionBarActions,
  ActionBarButton,
  type ActionBarProps,
  type ActionBarSelectionProps,
  type ActionBarCountProps,
  type ActionBarCloseProps,
  type ActionBarSeparatorProps,
  type ActionBarActionsProps,
  type ActionBarButtonProps,
} from "../components/action-bar/action-bar.react";
export {
  GridWrap,
  GridToolbar,
  GridSelectAll,
  Grid,
  GridItem,
  GridItemMedia,
  GridItemHeader,
  GridItemSelect,
  GridItemActions,
  GridItemTitle,
  GridItemDescription,
  GridItemBody,
  GridItemFooter,
  type GridWrapProps,
  type GridToolbarProps,
  type GridSelectAllProps,
  type GridProps,
  type GridItemProps,
  type GridItemMediaProps,
  type GridItemHeaderProps,
  type GridItemSelectProps,
  type GridItemActionsProps,
  type GridItemTitleProps,
  type GridItemDescriptionProps,
  type GridItemBodyProps,
  type GridItemFooterProps,
} from "../components/grid/grid.react";
export {
  ViewCard,
  ViewCardMedia,
  ViewCardImage,
  ViewCardBadge,
  ViewCardPlay,
  ViewCardBody,
  ViewCardText,
  ViewCardTitle,
  ViewCardMeta,
  ViewCardBadges,
  type ViewCardProps,
  type ViewCardMediaProps,
  type ViewCardImageProps,
  type ViewCardBadgeProps,
} from "../components/view-card/view-card.react";
export { HoverActions, HoverAction, type HoverActionsProps, type HoverActionProps } from "../components/hover-actions/hover-actions.react";
export {
  BarChart,
  LineChart,
  Sparkline,
  BarList,
  TableChart,
  type BarChartProps,
  type LineChartProps,
  type LineChartSeries,
  type ChartSeries,
  type ChartBaseProps,
  type SparklineProps,
  type BarListProps,
  type BarListItem,
  type TableChartProps,
} from "../components/chart/chart.react";
export {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarLink,
  NavbarActions,
  NavbarToggle,
  type NavbarProps,
  type NavbarBrandProps,
  type NavbarNavProps,
  type NavbarLinkProps,
  type NavbarActionsProps,
  type NavbarToggleProps,
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
  AppShellBack,
  AppShellTitle,
  AppShellHead,
  AppShellDetail,
  AppShellResize,
  type AppShellProps,
  type AppShellEdge,
  type AppShellSize,
  type AppShellResizeProps,
  type AppShellMainProps,
  type AppShellBackProps,
  type AppShellTitleProps,
  type AppShellHeadProps,
  type AppShellBarProps,
  type AppShellToggleProps,
  type AppShellSidebarProps,
  type AppShellBrandProps,
  type AppShellNavProps,
  type AppShellLinkProps,
  type AppShellGroupProps,
  type AppShellItemProps,
  type AppShellSublistProps,
  type AppShellCollapseProps,
  type AppShellFooterProps,
  type AppShellDetailProps,
} from "../components/app-shell/app-shell.react";
export {
  BottomNav,
  BottomNavLink,
  BottomNavButton,
  type BottomNavProps,
  type BottomNavSize,
  type BottomNavLinkProps,
  type BottomNavButtonProps,
} from "../components/bottom-nav/bottom-nav.react";
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from "../components/breadcrumb/breadcrumb.react";
export { Toc, type TocProps, type TocItem } from "../components/toc/toc.react";
export { Separator, type SeparatorProps } from "../components/separator/separator.react";
export { Carousel, CarouselSlide, type CarouselProps, type CarouselSlideProps } from "../components/carousel/carousel.react";
export { IconTile, type IconTileProps } from "../components/icon-tile/icon-tile.react";
export { Stat, type StatProps } from "../components/stat/stat.react";
export { Frame, type FrameProps } from "../components/frame/frame.react";
export {
  Chat,
  ChatMessage,
  ChatTyping,
  ChatReplies,
  type ChatProps,
  type ChatMessageProps,
  type ChatTypingProps,
  type ChatRepliesProps,
} from "../components/chat/chat.react";
export {
  PageHeader,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  type PageHeaderProps,
  type PageHeaderTitleProps,
  type PageHeaderDescriptionProps,
  type PageHeaderActionsProps,
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
  type ListItemProps,
  type ListContentProps,
  type ListTitleProps,
  type ListDescriptionProps,
  type ListMetaProps,
  type ListLinkProps,
} from "../components/list/list.react";
export {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
  type EmptyStateProps,
  type EmptyStateTitleProps,
  type EmptyStateDescriptionProps,
  type EmptyStateActionsProps,
} from "../components/empty-state/empty-state.react";
export { Spinner, type SpinnerProps } from "../components/spinner/spinner.react";
export { Kbd, KeyboardHint, type KbdProps, type KeyboardHintProps } from "../components/kbd/kbd.react";
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
  type FooterProps,
  type FooterBrandProps,
  type FooterNavProps,
  type FooterGroupProps,
  type FooterLinkProps,
  type FooterBottomProps,
} from "../components/footer/footer.react";
export {
  DatePicker,
  DatePickerGrid,
  DateRange,
  DateRangePicker,
  TimePicker,
  TimePickerTrigger,
  DateTimePicker,
  DateTimePickerTrigger,
  type DatePickerProps,
  type DatePickerGridProps,
  type DatePickerPreset,
  type DateRangeProps,
  type DateRangePickerProps,
  type TimePickerProps,
  type TimePickerTriggerProps,
  type DateTimePickerProps,
  type DateTimePickerTriggerProps,
} from "../components/date-time-picker/date-time-picker.react";
export {
  ColorSwatch,
  ColorSwatchButton,
  ColorSwatchCustom,
  ColorSwatchGroup,
  ColorSwatch as Swatch,
  ColorSwatchButton as SwatchButton,
  ColorSwatchCustom as SwatchCustom,
  ColorSwatchGroup as SwatchGroup,
  type ColorSwatchProps,
  type ColorSwatchButtonProps,
  type ColorSwatchCustomProps,
  type ColorSwatchGroupProps,
  type ColorSwatchProps as SwatchProps,
  type ColorSwatchButtonProps as SwatchButtonProps,
  type ColorSwatchCustomProps as SwatchCustomProps,
  type ColorSwatchGroupProps as SwatchGroupProps,
} from "../components/swatch/swatch.react";
export {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
  type ToolbarProps,
  type ToolbarButtonProps,
  type ToolbarGroupProps,
  type ToolbarSeparatorProps,
  type ToolbarSpacerProps,
} from "../components/toolbar/toolbar.react";
export {
  Shortcut,
  ShortcutRecorder,
  ShortcutList,
  ShortcutListItem,
  type ShortcutProps,
  type ShortcutRecorderProps,
  type ShortcutListItemProps,
} from "../components/shortcut/shortcut.react";
export { Settings, SettingsRow, SettingsLink, type SettingsProps, type SettingsRowProps, type SettingsLinkProps } from "../components/settings/settings.react";
export { Command, CommandDialog, CommandGroup, CommandItem, type CommandProps, type CommandDialogProps, type CommandGroupProps, type CommandItemProps } from "../components/command/command.react";
export { TagInput, type TagInputProps } from "../components/tag-input/tag-input.react";
export { Fab, type FabProps } from "../components/fab/fab.react";
export { TopBar, type TopBarProps } from "../components/top-bar/top-bar.react";
export { SearchBar, type SearchBarProps } from "../components/search-bar/search-bar.react";
export {
  FilterBar,
  FilterBarMain,
  FilterBarGroup,
  FilterBarTabs,
  FilterBarTab,
  FilterBarTrigger,
  FilterBarActive,
  FilterBarSummary,
  FilterBarClear,
  type FilterBarProps,
  type FilterBarMainProps,
  type FilterBarGroupProps,
  type FilterBarTabsProps,
  type FilterBarTabProps,
  type FilterBarTriggerProps,
  type FilterBarActiveProps,
  type FilterBarSummaryProps,
  type FilterBarClearProps,
} from "../components/filter-bar/filter-bar.react";
export {
  Sorting,
  SortingTrigger,
  type SortingProps,
  type SortingTriggerProps,
  type SortingSize,
} from "../components/sorting/sorting.react";
export { Swipe, SwipeAction, type SwipeProps, type SwipeActionProps } from "../components/swipe/swipe.react";
export {
  ColorPicker,
  type ColorPickerProps,
} from "../components/color-picker/color-picker.react";
export {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineContent,
  TimelineTime,
  TimelineTitle,
  TimelineBody,
  type TimelineProps,
  type TimelineItemProps,
  type TimelineMarkerProps,
  type TimelineContentProps,
  type TimelineTimeProps,
  type TimelineTitleProps,
  type TimelineBodyProps,
} from "../components/timeline/timeline.react";
export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockFilename,
  CodeBlockActions,
  CodeBlockSelector,
  CodeBlockCopy,
  CodeBlockPre,
  CodeBlockCode,
  type CodeBlockProps,
  type CodeBlockHeaderProps,
  type CodeBlockFilenameProps,
  type CodeBlockActionsProps,
  type CodeBlockSelectorProps,
  type CodeBlockCopyProps,
  type CodeBlockPreProps,
  type CodeBlockCodeProps,
} from "../components/code-block/code-block.react";
export { TextHighlight, type TextHighlightProps } from "../components/text-highlight/text-highlight.react";
