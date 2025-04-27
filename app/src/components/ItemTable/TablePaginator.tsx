import * as React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from '../@shadcn/ui/pagination';
import { Table } from '@tanstack/react-table';
import { Item } from '@/types/Item';

/**
 * Props for the TablePaginator component.
 */
export interface TablePaginatorProps {
  /**
   * The TanStack Table instance.
   */
  table: Table<Item>;
}

/**
 * TablePaginator component for rendering pagination controls for a table.
 *
 * This component provides "Previous" and "Next" buttons, page number links,
 * and an ellipsis for large page counts.
 *
 * @param props - The component props.
 * @returns A JSX element representing the table paginator.
 */
export const TablePaginator: React.FC<TablePaginatorProps> = ({ table }) => {
  return (
    <Pagination className='mt-4 mb-4'>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className =
                {!table.getCanPreviousPage() ? 'opacity-50 pointer-events-none' : ''}
            onClick={() => table.previousPage()}
            >
            Previous
          </PaginationPrevious>
        </PaginationItem>

        {/* Page Numbers */}
        {table.getPageCount() > 1 &&
          table.getPageOptions().map((pageIndex) => (
            <PaginationItem key={pageIndex}>
              <PaginationLink
                href="#"
                onClick={() => table.setPageIndex(pageIndex)}
                className = {table.getState().pagination.pageIndex === pageIndex? 'font-bold text-gray-100 underline': ''}
                >
                {pageIndex + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

        {/* Ellipsis for Large Page Counts */}
        {table.getPageCount() > 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => table.nextPage()}
            className={!table.getCanNextPage() ? 'opacity-50 pointer-events-none' : ''}
          >
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};