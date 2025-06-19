import React from 'react';
import { HiMiniArrowTopRightOnSquare } from 'react-icons/hi2';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-gray-800 p-6 space-y-8">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold text-brand">FlyFF Admin Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">
          Monitor and manage your FlyFF server in real time.
        </p>
      </header>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Graph Cards */}
        {/* <div className="col-span-1 xl:col-span-2 space-y-4"> */}
        {/* Player Activity Line Chart */}
        {/* <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold text-brand">
              Player Activity (Last 7 Days)
            </h2>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={playerActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="players"
                    stroke="var(--color-brand)"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div> */}

        {/* Vote Shop Bar Chart */}
        {/* <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold text-brand">
              Vote Shop Engagement
            </h2>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={voteShopData}
                  layout="vertical"
                  margin={{ left: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="item" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="votes"
                    fill="var(--color-secondary)"
                    radius={[5, 5, 5, 5]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div> */}
        {/* </div> */}

        {/* Status Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold text-brand mb-2">
              Server Statistics
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>Total Accounts</span>
                <div className="cursor-pointer px-2 py-1 rounded-full text-xs bg-brand/20 text-brand flex gap-x-1 items-center justify-center ">
                  <span className="font-semibold">143</span>
                  <HiMiniArrowTopRightOnSquare size={12} />
                </div>
              </li>
              <li className="flex items-center justify-between">
                <span>Total Characters</span>
                <div className="cursor-pointer px-2 py-1 rounded-full text-xs bg-secondary/20 text-secondary flex gap-x-1 items-center justify-center ">
                  <span className="font-semibold">420</span>
                  <HiMiniArrowTopRightOnSquare size={12} />
                </div>
              </li>
              <li className="flex items-center justify-between">
                <span>Total Guilds</span>
                <div className="cursor-pointer px-2 py-1 rounded-full text-xs bg-muted flex gap-x-1 items-center justify-center ">
                  <span className="font-semibold">666</span>
                  <HiMiniArrowTopRightOnSquare size={12} />
                </div>
              </li>
            </ul>
          </div>

          {/* <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold text-brand mb-2">
              Recent Activity
            </h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>🟢 User "Admin" logged in</li>
              <li>🛒 Vote Shop purchase: Knight Blade</li>
              <li>📥 Patch 1.2.3 deployed</li>
              <li>⚠️ Warning: Low disk space on Server B</li>
            </ul>
          </div> */}
        </div>
      </div>

      {/* News Section */}
      {/* <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold text-brand mb-4">
          News & Announcements
        </h2>
        <ul className="space-y-4">
          <li className="border-l-4 border-brand pl-4">
            <h3 className="text-lg font-medium">New Vote Shop Items Added</h3>
            <p className="text-sm text-gray-600">
              We’ve added new weapons and consumables to the Vote Shop!
            </p>
          </li>
          <li className="border-l-4 border-secondary pl-4">
            <h3 className="text-lg font-medium">
              Scheduled Server Maintenance
            </h3>
            <p className="text-sm text-gray-600">
              Expect downtime on Friday, June 7th at 1 AM.
            </p>
          </li>
          <li className="border-l-4 border-accent-gold pl-4">
            <h3 className="text-lg font-medium">Patch 1.2.3 Released</h3>
            <p className="text-sm text-gray-600">
              New fixes, improved performance, and UI enhancements.
            </p>
          </li>
        </ul>
      </section> */}
    </div>
  );
};

export default Dashboard;
