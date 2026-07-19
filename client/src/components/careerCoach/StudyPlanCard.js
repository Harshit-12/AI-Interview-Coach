function StudyPlanCard({ studyPlan = [] }) {

    return (

        <div className="bg-white rounded-3xl shadow-md p-8">

            {/* Header */}

            <div className="flex items-center gap-3 mb-8">

                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">

                    🗺️

                </div>

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">

                        Personalized Learning Roadmap

                    </h2>

                    <p className="text-gray-500">

                        Your AI-generated weekly study plan.

                    </p>

                </div>

            </div>

            {

                studyPlan.length > 0 ?

                <div className="space-y-8">

                    {

                        studyPlan.map((week, index) => (

                            <div
                                key={index}
                                className="
                                    border
                                    border-gray-200
                                    rounded-2xl
                                    p-6
                                    hover:shadow-lg
                                    transition
                                "
                            >

                                {/* Week */}

                                <div className="flex items-center justify-between">

                                    <span className="
                                        bg-blue-100
                                        text-blue-700
                                        px-4
                                        py-2
                                        rounded-full
                                        font-semibold
                                    ">

                                        📅 Week {week.week}

                                    </span>

                                </div>

                                {/* Focus */}

                                <div className="mt-5">

                                    <p className="text-sm text-gray-500">

                                        Focus Area

                                    </p>

                                    <h3 className="text-xl font-bold text-gray-800 mt-1">

                                        🎯 {week.focus}

                                    </h3>

                                </div>

                                {/* Tasks */}

                                <div className="mt-6">

                                    <p className="text-sm font-semibold text-gray-600 mb-3">

                                        Recommended Tasks

                                    </p>

                                    <div className="space-y-3">

                                        {

                                            week.tasks?.map((task, i) => (

                                                <div
                                                    key={i}
                                                    className="
                                                        flex
                                                        items-start
                                                        gap-3
                                                        bg-gray-50
                                                        rounded-xl
                                                        p-3
                                                    "
                                                >

                                                    <span className="text-green-600 mt-1">

                                                        ✔

                                                    </span>

                                                    <span className="text-gray-700">

                                                        {task}

                                                    </span>

                                                </div>

                                            ))

                                        }

                                    </div>

                                </div>

                            </div>

                        ))

                    }

                </div>

                :

                <div className="text-center py-10">

                    <div className="text-5xl">

                        📖

                    </div>

                    <h3 className="text-xl font-semibold mt-4">

                        Learning Roadmap Unavailable

                    </h3>

                    <p className="text-gray-500 mt-2">

                        Complete more interviews to generate
                        a personalized learning roadmap.

                    </p>

                </div>

            }

        </div>

    );

}

export default StudyPlanCard;