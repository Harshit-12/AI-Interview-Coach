// src/pages/PerformanceInsights.js

import { useEffect, useState } from "react";
import API from "../services/api";
import StatsCard from "../components/StatsCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function PerformanceInsights() {



const [loading, setLoading] = useState(true);
const [performanceData, setPerformanceData] = useState({
  overallAverage: 0,
  bestScore: 0,
  totalInterviews: 0,
  totalQuestions: 0,
  strengths: [],
  weaknesses: [],
  chartData: []
});
  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {

    try {
        setLoading(true);
      const res =
        await API.get(
          "/session/performance"
        );

      setPerformanceData(
        res.data
      );
      console.log(res.data);
    } catch (error) {

      console.error(error);

    }
    finally{
        setLoading(false);
    }

  };

    if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">

        <div className="
          w-12
          h-12
          border-4
          border-blue-500
          border-t-transparent
          rounded-full
          animate-spin
        " />

        <p className="text-gray-500">
          Loading your Performance Insights...
        </p>

      </div>
    </div>
  );
}
  if (
  !performanceData.chartData?.length
) {

  return (

    <div
      className="
        min-h-[70vh]
        flex
        items-center
        justify-center
      "
    >

      <div
        className="
          bg-white
          p-10
          rounded-3xl
          shadow-xl
          text-center
          max-w-md
        "
      >

        <div className="text-6xl mb-4">
          📊
        </div>

        <h2 className="text-2xl font-bold">
          No Performance Data Yet
        </h2>

        <p className="text-gray-500 mt-3">
          Complete your first interview
          to unlock AI performance insights.
        </p>

      </div>

    </div>

  );

}
  return (
    <>
  
    <div className="
      p-8
      bg-gray-50
      min-h-screen
    ">

      <h1 className="
        text-3xl
        font-bold
        text-gray-800
        mb-8
      ">
        Performance Insights
      </h1>

      <div className="
        bg-white
        rounded-2xl
        shadow-md
        p-6
      ">

        <h2 className="
          text-xl
          font-semibold
          mb-6
        ">
          Interview Score Trends
        </h2>

        <ResponsiveContainer
          width="100%"
          height={400}
        >

          <BarChart
            data={performanceData.chartData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            {/* <XAxis
              dataKey="role"
            /> */}
        <XAxis
            dataKey="date"
        />
            <YAxis
              domain={[0, 10]}
            />

            <Tooltip />

            <Bar
              dataKey="avgScore"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>


 <div className="
      p-8
      bg-gray-50
      min-h-screen
    ">

 <h2 className="
          text-xl
          font-semibold
          mb-6
        ">
          Performance Stats
        </h2>

<div
  className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-4
    gap-6
    mb-8
  "
>
    

  <StatsCard
    title="Overall Average"
    value={`${performanceData.overallAverage}/10`}
    icon="📈"
    color="blue"
  />

  <StatsCard
    title="Best Score"
    value={`${performanceData.bestScore}/10`}
    icon="🏆"
    color="yellow"
  />

  <StatsCard
    title="Interviews"
    value={performanceData.totalInterviews}
    icon="🎤"
    color="green"
  />

  <StatsCard
    title="Questions Attempted"
    value={performanceData.totalQuestions}
    icon="❓"
    color="purple"
  />

  
</div>
</div>
    </>
    
  );

}

export default PerformanceInsights;