import { useEffect, useState } from "react";
import API from "../services/api";

import LoadingScreen from "../components/careerCoach/LoadingScreen";
import EmptyState from "../components/careerCoach/EmptyState";
import ReadinessCard from "../components/careerCoach/ReadinessCard";
import SummaryCard from "../components/careerCoach/SummaryCard";
import StrengthWeaknessCard from "../components/careerCoach/StrengthWeaknessCard";
import StudyPlanCard from "../components/careerCoach/StudyPlanCard";
import ResourceCard from "../components/careerCoach/ResourceCard";
// import CareerAdviceCard from "../components/careerCoach/CareerAdviceCard";
// import MotivationCard from "../components/careerCoach/MotivationCard";

function CareerCoach() {

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(true);

    const [generating, setGenerating] = useState(false);

    useEffect(() => {

        fetchCareerReport();

    }, []);

    //--------------------------------------
    // Fetch Report
    //--------------------------------------

    const fetchCareerReport = async () => {

        try {

            const res =
                await API.get("/career-coach");

            setReport(res.data.report);
            console.log("Fetched Career Coach report:", res.data.report);
        }

        catch (error) {

            console.log(error);

            setReport(null);

        }

        finally {

            setLoading(false);

        }

    };

    //--------------------------------------
    // Generate Report
    //--------------------------------------

    const generateReport = async () => {

        try {

            setGenerating(true);

            const res =
                await API.post(
                    "/career-coach/generate"
                );

            setReport(res.data.report);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setGenerating(false);

        }

    };

    //--------------------------------------

    if (loading) {

        return <LoadingScreen />;

    }

    //--------------------------------------

    if (!report) {

        return (

            <EmptyState

                generating={generating}

                onGenerate={generateReport}

            />

        );

    }

    //--------------------------------------

    return (

        <div className="min-h-screen bg-gray-100">

            {/* Header */}

            <div className="bg-white shadow-sm">

                <div className="max-w-7xl mx-auto px-6 py-8">

                    <h1 className="text-4xl font-bold text-gray-800">

                        🤖 AI Career Coach

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Personalized career insights generated
                        from your interview performance.

                    </p>

                </div>

            </div>

            {/* Content */}

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Readiness */}

                <ReadinessCard

                    readiness={report.interviewReadiness}

                />

                {/* Summary */}

                <div className="mt-8">

                    <SummaryCard

                        summary={report.candidateSummary}

                    />

                </div>

                {/* Strengths */}

                <div className="mt-8">

                    <StrengthWeaknessCard

                        strengths={report.overallStrengths}

                        weaknesses={report.overallWeaknesses}

                        knowledgeGaps={report.knowledgeGaps}

                    />

                </div>

                {/* Study Plan */}

                <div className="mt-8">

                    <StudyPlanCard

                        studyPlan={report.weeklyStudyPlan}

                    />

                </div>

                {/* Resources */}

                <div className="mt-8">

                    <ResourceCard

                        resources={
                            report.recommendedResources
                        }

                    />

                </div>

                {/* Advice */}

                {/* <div className="mt-8">

                    <CareerAdviceCard

                        advice={report.careerAdvice}

                        nextInterviewFocus={
                            report.nextInterviewFocus
                        }

                    />

                </div> */}

                {/* Motivation */}
{/* 
                <div className="mt-8">

                    <MotivationCard

                        message={
                            report.motivationalMessage
                        }

                    />

                </div> */}

            </div>

        </div>

    );

}

export default CareerCoach;