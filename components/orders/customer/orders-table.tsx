"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconArrowUpRight,
} from "@tabler/icons-react";
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  FlexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type Row,
  type SortingState,
} from "@tanstack/react-table";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {OrderDrawer} from "@/components/orders/customer/order-drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Link from "next/link";
import {CancelOrderDialog} from "@/components/orders/customer/cancel-order-button";
import {useRouter} from "next/navigation";
import {OrderStatusBadge} from "@/components/orders/shared/order-status-badge";

function OrderActions({
  orderNumber,
  currentStatus,
}: {
  orderNumber: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = React.useState(false);

  const canCancel = currentStatus === "待确认" || currentStatus === "待付款";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon"
            />
          }
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/orders/${orderNumber}`)}
          >
            查看详情
          </DropdownMenuItem>

          {canCancel && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => setCancelOpen(true)}
              >
                取消订单
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canCancel && (
        <CancelOrderDialog
          orderNumber={orderNumber}
          open={cancelOpen}
          onOpenChange={setCancelOpen}
        />
      )}
    </>
  );
}

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});

const columnHelper = createColumnHelper<
  typeof features,
  z.infer<typeof schema>
>();

export const schema = z.object({
  id: z.string(),
  orderInfo: z.string(),
  orderId: z.string(),

  status: z.enum([
    "PENDING_CONFIRMATION",
    "PENDING_PAYMENT",
    "WAITING_FOR_CUSTOMER",
    "PROCESSING",
    "COMPLETED",
    "CANCELLED",
    "REFUNDING",
    "REFUNDED",
  ]),

  currentStatus: z.string(),
  amount: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Create a separate component for the drag handle
function DragHandle({id}: {id: string}) {
  const {attributes, listeners} = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <IconGripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const columns = columnHelper.columns([
  columnHelper.display({
    id: "drag",
    header: () => null,
    cell: ({row}) => <DragHandle id={row.original.id} />,
  }),
  columnHelper.display({
    id: "select",
    header: ({table}) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({row}) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("orderInfo", {
    header: "订单信息",
    cell: ({row}) => {
      return <OrderDrawer item={row.original} />;
    },
    enableHiding: false,
  }),

  columnHelper.accessor("orderId", {
    header: () => (
      <div className="w-full whitespace-nowrap text-start">订单编号</div>
    ),
    cell: ({row}) => (
      <div className="w-full whitespace-nowrap text-start">
        {row.original.orderId}
      </div>
    ),
  }),
  columnHelper.accessor("currentStatus", {
    header: "当前状态",
    cell: ({row}) => (
      <div className="w-32">
        <OrderStatusBadge status={row.original.status} />
      </div>
    ),
  }),

  columnHelper.accessor("amount", {
    header: () => (
      <div className="w-full whitespace-nowrap text-start">订单金额</div>
    ),
    cell: ({row}) => (
      <div className="w-full whitespace-nowrap text-start">
        {row.original.amount}
      </div>
    ),
  }),

  columnHelper.accessor("createdAt", {
    header: () => (
      <div className="w-full whitespace-nowrap text-start">创建时间</div>
    ),
    cell: ({row}) => (
      <div className="w-full whitespace-nowrap text-start">
        {row.original.createdAt}
      </div>
    ),
  }),

  columnHelper.accessor("updatedAt", {
    header: () => (
      <div className="w-full whitespace-nowrap text-start">更新时间</div>
    ),
    cell: ({row}) => (
      <div className="w-full whitespace-nowrap text-start">
        {row.original.updatedAt}
      </div>
    ),
  }),
  columnHelper.display({
    id: "actions",
    cell: ({row}) => (
      <OrderActions
        orderNumber={row.original.orderId}
        currentStatus={row.original.currentStatus}
      />
    ),
  }),
]);

const columnLabels: Record<string, string> = {
  orderId: "订单编号",
  currentStatus: "当前状态",
  amount: "订单金额",
  createdAt: "创建时间",
  updatedAt: "更新时间",
};

function DraggableRow({
  row,
}: {
  row: Row<typeof features, z.infer<typeof schema>>;
}) {
  const {transform, transition, setNodeRef, isDragging} = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          <FlexRender cell={cell} />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data, setData] = React.useState(() => initialData);

  const [previousInitialData, setPreviousInitialData] =
    React.useState(initialData);

  if (initialData !== previousInitialData) {
    setPreviousInitialData(initialData);
    setData(initialData);
  }

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredData = React.useMemo(
    () =>
      statusFilter === "all"
        ? data
        : data.filter((item) => item.currentStatus === statusFilter),
    [data, statusFilter],
  );

  const sortableId = React.useId();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => filteredData?.map(({id}) => id) || [],
    [filteredData],
  );

  const table = useTable({
    features,
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  function handleStatusFilterChange(value: string | null) {
    if (!value) return;

    setStatusFilter(value);
    setPagination((current) => ({
      ...current,
      pageIndex: 0,
    }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if (active && over && active.id !== over.id) {
      setData((currentData) => {
        const oldIndex = currentData.findIndex((item) => item.id === active.id);
        const newIndex = currentData.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return currentData;

        return arrayMove(currentData, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      value={statusFilter}
      onValueChange={handleStatusFilterChange}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>

        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="选择订单状态" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">全部订单</SelectItem>
            <SelectItem value="待确认">待确认</SelectItem>
            <SelectItem value="待付款">待付款</SelectItem>
            <SelectItem value="待补资料">待补资料</SelectItem>
            <SelectItem value="办理中">办理中</SelectItem>
            <SelectItem value="已完成">已完成</SelectItem>
            <SelectItem value="已取消">已取消</SelectItem>
          </SelectContent>
        </Select>

        <TabsList className="hidden @4xl/main:flex">
          <TabsTrigger value="all">全部订单</TabsTrigger>
          <TabsTrigger value="待确认">待确认</TabsTrigger>
          <TabsTrigger value="待付款">待付款</TabsTrigger>
          <TabsTrigger value="待补资料">待补资料</TabsTrigger>
          <TabsTrigger value="办理中">办理中</TabsTrigger>
          <TabsTrigger value="已完成">已完成</TabsTrigger>
          <TabsTrigger value="已取消">已取消</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" />}
            >
              <IconLayoutColumns />
              <span className="hidden lg:inline">列设置</span>
              <span className="lg:hidden">列</span>
              <IconChevronDown />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columnLabels[column.id] ?? column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/services" />}
          >
            <IconArrowUpRight />
            <span className="hidden lg:inline">浏览服务</span>
          </Button>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <FlexRender header={header} />
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            已选择 {table.getFilteredSelectedRowModel().rows.length} /{" "}
            {table.getFilteredRowModel().rows.length} 个订单
          </div>

          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                每页显示
              </Label>

              <Select
                value={`${table.state.pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.state.pagination.pageSize} />
                </SelectTrigger>

                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-fit items-center justify-center text-sm font-medium">
              第 {table.state.pagination.pageIndex + 1} 页，共{" "}
              {table.getPageCount()} 页
            </div>

            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>

              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>

              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>

              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
