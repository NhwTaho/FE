import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SearchInput } from './SearchInput';
import { FilterPopover, FilterGroup } from './FilterPopover';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  searchColumn?: string;
  filterGroups?: FilterGroup[];
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
  primaryAction?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = 'Tìm kiếm...',
  filterGroups = [],
  isLoading = false,
  onRowClick,
  primaryAction,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // Custom multi-filter matching
  const filteredData = React.useMemo(() => {
    if (Object.keys(selectedFilters).length === 0) return data;
    return data.filter((item: any) => {
      return Object.entries(selectedFilters).every(([key, val]) => {
        if (!val) return true;
        return String(item[key]) === String(val);
      });
    });
  }, [data, selectedFilters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5">
          <SearchInput
            value={globalFilter ?? ''}
            onChange={(val) => setGlobalFilter(val)}
            placeholder={searchPlaceholder}
          />

          {filterGroups.length > 0 && (
            <FilterPopover
              groups={filterGroups}
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
              onReset={() => setSelectedFilters({})}
            />
          )}
        </div>

        {primaryAction && <div className="flex items-center gap-2">{primaryAction}</div>}
      </div>

      {/* Mobile Card Grid View (Shown on mobile screens < md) */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <LoadingState rows={4} />
        ) : table.getRowModel().rows.length === 0 ? (
          <EmptyState
            title="Không tìm thấy kết quả"
            description="Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc để thấy dữ liệu."
          />
        ) : (
          table.getRowModel().rows.map((row) => {
            const visibleCells = row.getVisibleCells();
            const actionCell = visibleCells.find((c) => c.column.id === 'actions');
            const dataCells = visibleCells.filter((c) => c.column.id !== 'actions');
            const primaryCell = dataCells[0];
            const secondaryCells = dataCells.slice(1);

            return (
              <div
                key={row.id}
                onClick={() => onRowClick && onRowClick(row.original)}
                className={cn(
                  'p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 transition-all',
                  onRowClick && 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.99]'
                )}
              >
                {/* Header Row: Primary Cell & Action Menu */}
                <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex-1 min-w-0">
                    {primaryCell && flexRender(primaryCell.column.columnDef.cell, primaryCell.getContext())}
                  </div>
                  {actionCell && (
                    <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                      {flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
                    </div>
                  )}
                </div>

                {/* Body Grid: Key-Value Pairs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {secondaryCells.map((cell) => {
                    const headerContent = cell.column.columnDef.header;
                    if (!headerContent) return null;

                    return (
                      <div
                        key={cell.id}
                        className="flex items-center justify-between py-1 px-1 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-2">
                          {typeof headerContent === 'string'
                            ? headerContent
                            : typeof headerContent === 'function'
                            ? (headerContent as any)({ column: cell.column, table })
                            : String(headerContent)}
                        </span>
                        <div className="text-right text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View (Shown on screens >= md) */}
      <div className="hidden md:block rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
        {isLoading ? (
          <LoadingState rows={6} />
        ) : table.getRowModel().rows.length === 0 ? (
          <EmptyState
            title="Không tìm thấy kết quả"
            description="Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc để thấy dữ liệu."
          />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            'flex items-center gap-1 font-semibold text-xs',
                            header.column.getCanSort() && 'cursor-pointer select-none hover:text-slate-900 dark:hover:text-slate-100'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="h-3 w-3 text-slate-400" />
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={cn(onRowClick && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && table.getRowModel().rows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 text-xs text-slate-500">
          <div>
            Hiển thị <span className="font-medium text-slate-700 dark:text-slate-200">{table.getRowModel().rows.length}</span> / <span className="font-medium text-slate-700 dark:text-slate-200">{table.getFilteredRowModel().rows.length}</span> kết quả
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-xs">
              Trang <span className="font-semibold">{table.getState().pagination.pageIndex + 1}</span> / {table.getPageCount()}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
