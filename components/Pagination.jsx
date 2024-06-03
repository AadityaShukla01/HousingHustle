import React from "react";

const Pagination = ({ page, pageSize, total, onPageChange }) => {
  const handlePageClick = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      onPageChange(newPage);
    }
  };
  const totalPage = Math.ceil(total / pageSize);

  return (
    <>
      <section className="container mx-auto flex justify-center items-center my-8">
        <button
          className="mr-2 px-2 py-1 border border-gray-300 rounded"
          disabled={page === 1}
          onClick={() => handlePageClick(page - 1)}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {page} of {totalPage}
        </span>
        <button
          className="ml-2 px-2 py-1 border border-gray-300 rounded"
          disabled={page === totalPage}
          onClick={() => handlePageClick(page + 1)}
        >
          Next
        </button>
      </section>
    </>
  );
};

export default Pagination;
