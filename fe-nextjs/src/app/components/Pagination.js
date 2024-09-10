export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const generatePaginationButtons = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        // Adjust the start and end page if the number of pages is less than 5
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                endPage = 5;
            }
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 4;
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }

        return pages;
    };

    const paginationButtons = generatePaginationButtons();
    return (
        <div className="mt-6 flex justify-center">
            <nav className="relative z-0 inline-flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                    Previous
                </button>
                {paginationButtons.includes(1) && (
                    <button
                        onClick={() => onPageChange(1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'bg-blue-500 text-white' : 'text-gray-500 bg-white'} rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                    >
                        1
                    </button>
                )}
                {paginationButtons.length > 1 && paginationButtons[0] > 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white rounded-md shadow-sm">
                        ...
                    </span>
                )}
                {paginationButtons.slice(1, -1).map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-500 bg-white'} rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                    >
                        {page}
                    </button>
                ))}
                {paginationButtons.length > 1 && paginationButtons[paginationButtons.length - 1] < totalPages - 1 && (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white rounded-md shadow-sm">
                        ...
                    </span>
                )}
                {paginationButtons.includes(totalPages) && (
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'text-gray-500 bg-white'} rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                    >
                        {totalPages}
                    </button>
                )}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                    Next
                </button>
            </nav>
        </div>
    )
}