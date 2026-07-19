function SummaryCard({ summary }) {

  return (

    <div className="bg-white rounded-3xl shadow-md p-8">

      <div className="flex items-center gap-3 mb-5">

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">

          📋

        </div>

        <div>

          <h2 className="text-2xl font-bold text-gray-800">

            Career Summary

          </h2>

          <p className="text-gray-500">

            AI-generated overview of your interview performance.

          </p>

        </div>

      </div>

      <div className="border-l-4 border-blue-500 pl-6">

        <p className="text-gray-700 leading-8 text-lg">

          {summary}

        </p>

      </div>

    </div>

  );

}

export default SummaryCard;