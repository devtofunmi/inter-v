'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

interface PracticeResult {
  id: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
}

interface DashboardAnalyticsProps {
  results: PracticeResult[];
  averageScore: number;
  interviewsCompleted: number;
}

export default function DashboardAnalytics({
  results,
  averageScore,
  interviewsCompleted,
}: DashboardAnalyticsProps) {
  // Prepare line chart data
  const chartData =
    results?.slice(-7).map((result) => ({
      date: new Date(result.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: result.score,
    })) || [];

  // Convert averageScore (out of 10) to percentage
  const progressPercent = (averageScore / 10) * 100;

  // Data for radial chart
  const radialData = [
    { name: 'Progress', value: progressPercent },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 mb-10">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Performance Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side — stats */}
        <div className="space-y-5">
          <div>
            <h3 className="text-sm uppercase tracking-wide text-gray-500">
              Interviews Completed
            </h3>
            <p className="text-3xl font-extrabold text-blue-500">
              {interviewsCompleted}
            </p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-wide text-gray-500">
              Average Score
            </h3>
            <p className="text-3xl font-extrabold text-blue-500">
              {averageScore.toFixed(1)} / 10
            </p>
          </div>
        </div>

        {/* Center — radial progress ring */}
        <div className="flex justify-center items-center relative">
          <ResponsiveContainer width={200} height={200}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="80%"
              outerRadius="100%"
              barSize={12}
              data={radialData}
              startAngle={90}
              endAngle={450}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>

              {/* Gray track (background ring) */}
              <RadialBar
                background={{ fill: '#E5E7EB' }}
                dataKey="value"
                cornerRadius={50}
                clockWise
                fill="url(#blueGradient)"
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute text-center">
            <p className="text-2xl font-bold text-gray-900">
              {averageScore.toFixed(1)}
            </p>
            <p className="text-2xl text-gray-900 font-bold">/ 10</p>
          </div>
        </div>

        {/* Right side — line chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.7} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                stroke="#9ca3af"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#lineGradient)"
                strokeWidth={4}
                dot={{ r: 5, fill: '#3B82F6' }}
                activeDot={{ r: 8, stroke: '#1E40AF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}