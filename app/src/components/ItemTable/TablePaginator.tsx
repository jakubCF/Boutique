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

export interface TablePaginatorProps {
  table: Table<Item>;
}

export const TablePaginator: React.FC<TablePaginatorProps> = ({ table }) => {
  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  const maxVisiblePages = 5;
  const halfRange = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(currentPage - halfRange, 0);
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage >= totalPages) {
    endPage = totalPages - 1;
    startPage = Math.max(endPage - maxVisiblePages + 1, 0);
  }

  const pagesToShow = Array.from(
    { length: endPage - startPage + 1 },
    (_, idx) => startPage + idx
  );

  return (
    <Pagination className='mt-4 mb-4'>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => table.previousPage()}
            className={!table.getCanPreviousPage() ? 'opacity-50 pointer-events-none' : ''}
          >
            Previous
          </PaginationPrevious>
        </PaginationItem>

        {/* First Page + Leading Ellipsis */}
        {startPage > 0 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={() => table.setPageIndex(0)}
                className={currentPage === 0 ? 'font-bold text-gray-100 underline' : ''}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {startPage > 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* Dynamic Page Range */}
        {pagesToShow.map((pageIndex) => (
          <PaginationItem key={pageIndex}>
            <PaginationLink
              href="#"
              onClick={() => table.setPageIndex(pageIndex)}
              className={currentPage === pageIndex ? 'font-bold text-gray-100 underline' : ''}
            >
              {pageIndex + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Trailing Ellipsis + Last Page */}
        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={() => table.setPageIndex(totalPages - 1)}
                className={currentPage === totalPages - 1 ? 'font-bold text-gray-100 underline' : ''}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next */}
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
