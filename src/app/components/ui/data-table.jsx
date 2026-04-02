'use client';

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Trash2, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import { Checkbox } from "@/app/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/app/components/ui/table"
import { MoreHorizontal } from "lucide-react"

export function DataTable({
  columns,
  data,
  onDelete,
  searchPlaceholder = "Search...",
  customToolbar,
  onRowClick,
}) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [pendingDeleteIds, setPendingDeleteIds] = React.useState([])

  const globalFilterFn = React.useCallback((row, columnId, filterValue) => {
    const search = filterValue.toLowerCase()
    const searchInObject = (obj) => {
      if (!obj) return false
      for (const key in obj) {
        const value = obj[key]
        if (value === null || value === undefined) continue
        if (typeof value === 'string' && value.toLowerCase().includes(search)) return true
        if (typeof value === 'number' && value.toString().includes(search)) return true
      }
      return false
    }
    return searchInObject(row.original)
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    state: { sorting, columnFilters, rowSelection, globalFilter },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length

  const handleBulkDelete = () => {
    if (selectedCount === 0) return
    const selectedIds = selectedRows.map(row => row.original.$id || row.original.id)
    setPendingDeleteIds(selectedIds)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      await onDelete(pendingDeleteIds)
      setShowDeleteModal(false)
      setPendingDeleteIds([])
      table.resetRowSelection()
      setRowSelection({})
    } catch (error) {
      console.error('Error during deletion:', error)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="w-full space-y-3">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:flex-1">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:max-w-sm px-4 py-2 bg-[#0a0a0a] border border-[#1c1c1c] text-white text-xs placeholder-neutral-700 focus:outline-none focus:border-primary transition-colors"
            style={{ borderRadius: 0, fontFamily: "'DM Sans', sans-serif" }}
          />
          {selectedCount > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-semibold uppercase hover:bg-red-600/20 transition-colors whitespace-nowrap"
              style={{ borderRadius: 0, letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              <Trash2 size={12} />
              Delete {selectedCount}
            </button>
          )}
        </div>
        {customToolbar && <div className="flex items-center gap-2">{customToolbar}</div>}
      </div>

      {/* Table */}
      <div className="border border-[#161616] bg-[#0c0c0c] overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-[#080808]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </tr>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`text-white ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={(e) => {
                    if (e.target.closest('button') || e.target.closest('[role="checkbox"]')) return
                    if (onRowClick) onRowClick(row.original)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center text-neutral-700 text-xs uppercase"
                  style={{ letterSpacing: '0.15em' }}
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-neutral-700 text-[10px] uppercase" style={{ letterSpacing: '0.15em' }}>
          {selectedCount > 0
            ? `${selectedCount} of ${table.getFilteredRowModel().rows.length} selected`
            : `${table.getFilteredRowModel().rows.length} rows`}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center gap-1 px-3 py-1.5 border border-[#1c1c1c] text-neutral-600 text-[10px] uppercase font-semibold hover:border-[#2a2a2a] hover:text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ letterSpacing: '0.12em', borderRadius: 0 }}
          >
            <ChevronLeft size={12} /> Prev
          </button>
          <span className="px-3 py-1.5 border border-[#1c1c1c] text-neutral-600 text-[10px] min-w-[60px] text-center" style={{ borderRadius: 0 }}>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex items-center gap-1 px-3 py-1.5 border border-[#1c1c1c] text-neutral-600 text-[10px] uppercase font-semibold hover:border-[#2a2a2a] hover:text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ letterSpacing: '0.12em', borderRadius: 0 }}
          >
            Next <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0c0c0c] border border-[#1e1e1e] max-w-sm w-full">
            <div className="border-b border-[#161616] px-5 py-4 flex items-center gap-3">
              <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
              <h3
                className="text-white font-black uppercase text-sm"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em' }}
              >
                Delete {pendingDeleteIds.length} {pendingDeleteIds.length === 1 ? 'Item' : 'Items'}
              </h3>
            </div>
            <div className="px-5 py-4">
              <p className="text-neutral-500 text-xs leading-relaxed">
                This will permanently remove {pendingDeleteIds.length === 1 ? 'this item' : 'these items'} and cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-[#161616]">
              <button
                onClick={() => { setShowDeleteModal(false); setPendingDeleteIds([]) }}
                className="flex-1 py-3 text-neutral-600 text-xs font-semibold uppercase hover:text-white hover:bg-[#111] transition-colors border-r border-[#161616]"
                style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 text-red-500 text-xs font-semibold uppercase hover:text-white hover:bg-red-600 transition-colors"
                style={{ letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function createSelectColumn() {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

export function createActionsColumn({ onEdit, onView, onDelete }) {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-7 w-7 flex items-center justify-center text-neutral-600 hover:text-white transition-colors">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#0c0c0c] border-[#1e1e1e] rounded-none">
            <DropdownMenuLabel className="text-neutral-600 text-[9px] uppercase tracking-widest">Actions</DropdownMenuLabel>
            {onView && <DropdownMenuItem onClick={() => onView(item)} className="text-xs text-neutral-400 hover:text-white">View</DropdownMenuItem>}
            {onEdit && <DropdownMenuItem onClick={() => onEdit(item)} className="text-xs text-neutral-400 hover:text-white">Edit</DropdownMenuItem>}
            {onDelete && <DropdownMenuItem onClick={() => onDelete(item)} className="text-xs text-red-500 hover:text-red-400">Delete</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
}
