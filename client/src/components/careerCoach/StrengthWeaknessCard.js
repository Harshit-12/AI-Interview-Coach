function StrengthWeaknessCard({
    strengths = [],
    weaknesses = [],
    knowledgeGaps = []
}) {

    return (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ---------------- Strengths ---------------- */}

            <div className="bg-white rounded-3xl shadow-md p-6">

                <div className="flex items-center gap-3 mb-5">

                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

                        🌟

                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-gray-800">

                            Strengths

                        </h2>

                        <p className="text-sm text-gray-500">

                            Skills you consistently demonstrate

                        </p>

                    </div>

                </div>

                {

                    strengths.length > 0

                        ?

                        <div className="space-y-3">

                            {

                                strengths.map((item, index) => (

                                    <div
                                        key={index}
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            bg-green-50
                                            rounded-xl
                                            px-4
                                            py-3
                                        "
                                    >

                                        <span className="text-green-600 font-bold">

                                            ✓

                                        </span>

                                        <span className="text-gray-700">

                                            {item}

                                        </span>

                                    </div>

                                ))

                            }

                        </div>

                        :

                        <p className="text-gray-400">

                            No strengths identified yet.

                        </p>

                }

            </div>

            {/* ---------------- Weaknesses ---------------- */}

            <div className="bg-white rounded-3xl shadow-md p-6">

                <div className="flex items-center gap-3 mb-5">

                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">

                        ⚠️

                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-gray-800">

                            Areas to Improve

                        </h2>

                        <p className="text-sm text-gray-500">

                            Focus here for maximum improvement

                        </p>

                    </div>

                </div>

                {

                    weaknesses.length > 0

                        ?

                        <div className="space-y-3">

                            {

                                weaknesses.map((item, index) => (

                                    <div
                                        key={index}
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            bg-red-50
                                            rounded-xl
                                            px-4
                                            py-3
                                        "
                                    >

                                        <span className="text-red-600 font-bold">

                                            ●

                                        </span>

                                        <span className="text-gray-700">

                                            {item}

                                        </span>

                                    </div>

                                ))

                            }

                        </div>

                        :

                        <p className="text-gray-400">

                            Great! No recurring weaknesses found.

                        </p>

                }

            </div>

            {/* ---------------- Knowledge Gaps ---------------- */}

            <div className="bg-white rounded-3xl shadow-md p-6">

                <div className="flex items-center gap-3 mb-5">

                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

                        📚

                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-gray-800">

                            Knowledge Gaps

                        </h2>

                        <p className="text-sm text-gray-500">

                            Topics requiring additional study

                        </p>

                    </div>

                </div>

                {

                    knowledgeGaps.length > 0

                        ?

                        <div className="flex flex-wrap gap-3">

                            {

                                knowledgeGaps.map((item, index) => (

                                    <span
                                        key={index}
                                        className="
                                            bg-blue-100
                                            text-blue-700
                                            px-4
                                            py-2
                                            rounded-full
                                            text-sm
                                            font-medium
                                        "
                                    >

                                        {item}

                                    </span>

                                ))

                            }

                        </div>

                        :

                        <p className="text-gray-400">

                            No knowledge gaps detected.

                        </p>

                }

            </div>

        </div>

    );

}

export default StrengthWeaknessCard;