"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
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
  type SortingState,
} from "@tanstack/react-table";
import {z} from "zod";

import {OrderStatusBadge} from "@/components/orders/shared/order-status-badge";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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

export const adminOrderSchema = z.object({
  id: z.string(),
  orderInfo: z.string(),
  orderId: z.string(),
  customer: z.string(),
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
  z.infer<typeof adminOrderSchema>
>();

const columns = columnHelper.columns([
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
    cell: ({row}) => (
      <Button
        variant="link"
        className="w-fit px-0 text-left text-foreground"
      >
        {row.original.orderInfo}
      </Button>
    ),
    enableHiding: false,
  }),
  columnHelper.accessor("orderId", {
    header: "订单编号",
    cell: ({row}) => (
      <div className="whitespace-nowrap">{row.original.orderId}</div>
    ),
  }),
  columnHelper.accessor("customer", {
    header: "客户",
    cell: ({row}) => (
      <div className="max-w-48 truncate">{row.original.customer}</div>
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
    header: "订单金额",
    cell: ({row}) => <div className="whitespace-nowrap">{row.original.amount}</div>,
  }),
  columnHelper.accessor("createdAt", {
    header: "创建时间",
    cell: ({row}) => (
      <div className="whitespace-nowrap">{row.original.createdAt}</div>
    ),
  }),
  columnHelper.accessor("updatedAt", {
    header: "更新时间",
    cell: ({row}) => (
      <div className="whitespace-nowrap">{row.original.updatedAt}</div>
    ),
  }),
  columnHelper.display({
    id: "actions",
    cell: () => (
      <Button
        variant="ghost"
        className="flex size-8 text-muted-foreground"
        size="icon"
      >
        <IconDotsVertical />
        <span className="sr-only">打开订单操作</span>
      </Button>
    ),
  }),
]);

const columnLabels: Record<string, string> = {
  orderId: "订单编号",
  customer: "客户",
  currentStatus: "当前状态",
  amount: "订单金额",
  createdAt: "创建时间",
  updatedAt: "更新时间",
};

export function AdminOrdersTable({
  data,
}: {
  data: z.infer<typeof adminOrderSchema>[];
}) {
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
    getRowId: (row) => row.id,
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
    setPagination((current) => ({...current, pageIndex: 0}));
  }

  return (
    <Tabs
      value={statusFilter}
      onValueChange={handleStatusFilterChange}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="admin-order-view-selector" className="sr-only">
          订单状态
        </Label>

        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="admin-order-view-selector"
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

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
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
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnLabels[column.id] ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <FlexRender header={header} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    暂无订单
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            已选择 {table.getFilteredSelectedRowModel().rows.length} /{" "}
            {table.getFilteredRowModel().rows.length} 个订单
          </div>

          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="admin-orders-rows-per-page" className="text-sm font-medium">
                每页显示
              </Label>

              <Select
                value={`${table.state.pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger
                  size="sm"
                  className="w-20"
                  id="admin-orders-rows-per-page"
                >
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
                <span className="sr-only">第一页</span>
                <IconChevronsLeft />
              </Button>

              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">上一页</span>
                <IconChevronLeft />
              </Button>

              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">下一页</span>
                <IconChevronRight />
              </Button>

              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">最后一页</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
