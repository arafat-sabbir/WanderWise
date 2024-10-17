

const BookingPage = ({searchParams}) => {

  // Get the value of 'status' and 'transactionId'
  const status = searchParams.status;
  const transactionId = searchParams.transactionId


  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-md text-center">
        {status === 'canceled' ? (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-6">
              Payment Canceled
            </h1>
            <p className="text-gray-600 mb-4">
              Your payment has been canceled. If this was a mistake, please try again or contact support for assistance.
            </p>
            <div className="text-lg text-gray-700 font-medium">
              <p className="mb-2">
                <strong>Transaction ID:</strong> {transactionId}
              </p>
            </div>
            <div className="mt-6">
              <a
                href="/"
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Back to Home
              </a>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-red-600 mb-6">
              Unknown Status
            </h1>
            <p className="text-gray-600 mb-4">
              We could not determine the status of your payment. Please try again later.
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Back to Home
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
