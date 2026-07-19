function EmptyState({

    generating,

    onGenerate

}) {

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl text-center">

                <div className="text-6xl">

                    🤖

                </div>

                <h2 className="text-3xl font-bold mt-5">

                    AI Career Coach

                </h2>

                <p className="mt-5 text-gray-600 leading-7">

                    Generate your personalized career
                    coaching report based on all
                    interviews you've completed.

                    <br/><br/>

                    Our AI will identify:

                </p>

                <ul className="text-left mt-6 space-y-2 text-gray-700">

                    <li>✅ Your strongest skills</li>

                    <li>✅ Areas requiring improvement</li>

                    <li>✅ Knowledge gaps</li>

                    <li>✅ Free learning resources</li>

                    <li>✅ Weekly study roadmap</li>

                    <li>✅ Career advice</li>

                </ul>

                <button

                    onClick={onGenerate}

                    disabled={generating}

                    className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"

                >

                    {

                        generating

                            ?

                            "Generating Report..."

                            :

                            "Generate AI Career Report"

                    }

                </button>

            </div>

        </div>

    );

}

export default EmptyState;