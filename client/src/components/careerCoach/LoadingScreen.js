function LoadingScreen() {

    return (

        <div className="min-h-screen flex items-center justify-center">

            <div className="text-center">

                <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"/>

                <h2 className="mt-6 text-xl font-semibold">

                    Loading AI Career Coach...

                </h2>

                <p className="text-gray-500 mt-2">

                    Preparing your personalized insights.

                </p>

            </div>

        </div>

    );

}

export default LoadingScreen;