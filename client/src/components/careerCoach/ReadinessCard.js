function ReadinessCard({ readiness }) {

  const score = readiness?.score || 0;
  const level = readiness?.level || "Unknown";

  const getColor = () => {

    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";

    return "text-red-600";

  };

  const getBg = () => {

    if (score >= 85) return "bg-green-100";
    if (score >= 70) return "bg-blue-100";
    if (score >= 50) return "bg-yellow-100";

    return "bg-red-100";

  };

  return (

    <div className="bg-white rounded-3xl shadow-md p-8">

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

        {/* Left */}

        <div>

          <h2 className="text-3xl font-bold text-gray-800">

            Interview Readiness

          </h2>

          <p className="text-gray-500 mt-2">

            Based on all completed interviews,
            this score represents your current
            readiness for real interviews.

          </p>

        </div>

        {/* Right */}

        <div className="flex items-center gap-8">

          <div className={`w-36 h-36 rounded-full ${getBg()} flex items-center justify-center`}>

            <div className="text-center">

              <p className={`text-5xl font-bold ${getColor()}`}>

                {score}

              </p>

              <p className="text-gray-600 text-sm">

                /100

              </p>

            </div>

          </div>

          <div>

            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getBg()} ${getColor()}`}>

              {level}

            </span>

            <p className="text-gray-500 mt-4">

              Keep taking interviews to improve
              your readiness score.

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ReadinessCard;