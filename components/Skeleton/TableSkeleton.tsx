import Container from "../Shared/Container";

const TableSkeleton = () => {
  return (
    <div className="min-h-screen py-10">
      <Container className="mx-auto">
        <div className="w-full overflow-x-auto">
          <table className="table-auto w-full border-2 border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center animate-pulse"></th>
                <th className="border border-gray-300 px-4 py-2 text-center animate-pulse"></th>
                <th className="border border-gray-300 px-4 py-2 text-center animate-pulse"></th>
                <th className="border border-gray-300 px-4 py-2 text-center animate-pulse"></th>
                <th className="border border-gray-300 px-4 py-2 text-center animate-pulse"></th>
              </tr>
            </thead>
            <tbody>
              {/* Loading skeleton for each row */}
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="animate-pulse bg-gray-200 h-6 w-24 mx-auto rounded"></div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="animate-pulse bg-gray-200 h-6 w-16 mx-auto rounded"></div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="animate-pulse bg-gray-200 h-6 w-28 mx-auto rounded"></div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="animate-pulse bg-gray-200 h-6 w-20 mx-auto rounded"></div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="animate-pulse bg-gray-200 h-6 w-16 mx-auto rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
};

export default TableSkeleton;
