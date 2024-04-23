import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const SimplePagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  isPreviousData,
}) => {
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePrevClick = () => onPageChange(currentPage - 1);
  const handleNextClick = () => onPageChange(currentPage + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              currentPage === 1 || isPreviousData
                ? "pointer-events-none opacity-50"
                : undefined
            }
            onClick={handlePrevClick}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="pointer-events-none px-10" isActive>
            Page {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className={
              currentPage === pageCount || isPreviousData
                ? "pointer-events-none opacity-50"
                : undefined
            }
            onClick={handleNextClick}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default SimplePagination;
