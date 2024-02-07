import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ReactPaginate from "react-paginate";
function Pagination({
  last_page,
  onPageChange,
}: {
  last_page: number;
  onPageChange: Function;
}) {
  const [currentPage, setcurrentPage] = useState(1);
  return (
    <ReactPaginate
      pageCount={last_page}
      onPageChange={({ selected }) => (
        onPageChange(selected + 1), setcurrentPage(selected + 1)
      )}
      previousLabel={
        <ChevronLeftIcon
          className="h-5 w-4 stroke-grey_icon rounded-l-md"
          aria-hidden="true"
        />
      } 
      nextLabel={
        <ChevronRightIcon
          className="h-5 w-4 stroke-grey_icon  rounded-r-md"
          aria-hidden="true"
        />
      }
      breakLabel="..."
      breakClassName="break-me"
      marginPagesDisplayed={3}
      pageRangeDisplayed={3}
      // subContainerClassName="pages pagination"
      breakLinkClassName="page-link"
      containerClassName="pagination flex list-none"
      pageClassName="page-item"
      pageLinkClassName="page-link relative"
      previousClassName={`page-item ${currentPage === 1 && "dark"}`}
      previousLinkClassName="page-link"
      nextClassName={`page-item ${last_page === currentPage && "dark"}`}
      nextLinkClassName="page-link"
      activeClassName="active"
    />
  );
}

export default Pagination;
