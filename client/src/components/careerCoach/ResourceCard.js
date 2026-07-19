function ResourceCard({ resources = [] }) {

    //-----------------------------------------
    // Badge Colors
    //-----------------------------------------

    const getBadgeColor = (type = "") => {

        const value = type.toLowerCase();

        if (value.includes("official"))
            return "bg-green-100 text-green-700";

        if (value.includes("youtube"))
            return "bg-red-100 text-red-700";

        if (value.includes("github"))
            return "bg-gray-200 text-gray-800";

        if (value.includes("documentation"))
            return "bg-blue-100 text-blue-700";

        if (value.includes("course"))
            return "bg-purple-100 text-purple-700";

        return "bg-indigo-100 text-indigo-700";

    };

    //-----------------------------------------

    return (

        <div className="bg-white rounded-3xl shadow-md p-8">

            {/* Header */}

            <div className="flex items-center gap-3 mb-8">

                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">

                    📚

                </div>

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">

                        Recommended Learning Resources

                    </h2>

                    <p className="text-gray-500">

                        AI-selected free resources to strengthen your weakest areas.

                    </p>

                </div>

            </div>

            {

                resources.length > 0 ?

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {

                        resources.map((resource, index) => (

                            <div

                                key={index}

                                className="
                                    border
                                    border-gray-200
                                    rounded-2xl
                                    p-6
                                    hover:shadow-lg
                                    transition
                                    flex
                                    flex-col
                                    justify-between
                                "

                            >

                                {/* Resource Type */}

                                <div className="flex justify-between items-center">

                                    <span

                                        className={`
                                            px-3
                                            py-1
                                            rounded-full
                                            text-xs
                                            font-semibold
                                            ${getBadgeColor(resource.resourceType)}
                                        `}

                                    >

                                        {resource.resourceType || "Learning Resource"}

                                    </span>

                                </div>

                                {/* Topic */}

                                <div className="mt-5">

                                    <p className="text-sm text-gray-500">

                                        Topic

                                    </p>

                                    <h3 className="text-xl font-bold text-gray-800 mt-1">

                                        {resource.topic}

                                    </h3>

                                </div>

                                {/* Resource Name */}

                                <div className="mt-5">

                                    <p className="text-sm text-gray-500">

                                        Resource

                                    </p>

                                    <p className="text-lg font-semibold text-blue-700 mt-1">

                                        {resource.resourceName}

                                    </p>

                                </div>

                                {/* Reason */}

                                <div className="mt-5">

                                    <p className="text-sm text-gray-500">

                                        Why This Resource?

                                    </p>

                                    <p className="text-gray-700 mt-2 leading-7">

                                        {resource.reason}

                                    </p>

                                </div>

                                {/* Visit Button */}

                                {

                                    resource.url && (

                                        <a

                                            href={resource.url}

                                            target="_blank"

                                            rel="noreferrer"

                                            className="
                                                mt-8
                                                w-full
                                                bg-blue-600
                                                hover:bg-blue-700
                                                text-white
                                                text-center
                                                py-3
                                                rounded-xl
                                                transition
                                                font-medium
                                            "

                                        >

                                            Visit Resource ↗

                                        </a>

                                    )

                                }

                            </div>

                        ))

                    }

                </div>

                :

                <div className="text-center py-12">

                    <div className="text-6xl">

                        📖

                    </div>

                    <h3 className="text-2xl font-semibold mt-5">

                        No Resources Available

                    </h3>

                    <p className="text-gray-500 mt-3">

                        Generate your AI Career Coach report
                        to receive personalized learning resources.

                    </p>

                </div>

            }

        </div>

    );

}

export default ResourceCard;