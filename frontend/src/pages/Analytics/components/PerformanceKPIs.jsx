import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, Users, Zap, Timer } from 'lucide-react';

const KPICard = ({ title, current, previous, change, suffix = 'days', icon: Icon, color = 'blue', categoryName = null }) => {
  const isPositive = change > 0;
  const isImprovement = suffix === 'days' ? change < 0 : change > 0; // For days, decrease is good
  
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400', 
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400'
  };

  return (
    <Card className="dark:bg-[#0d1117] dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${colorClasses[color]}`} />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            {isImprovement ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs font-medium ${
              isImprovement ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {Math.abs(change).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold dark:text-white">
              {typeof current === 'string' ? current : current.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {suffix}
            </span>
          </div>
          
          {/* Show category name for fastest/slowest, previous value for others */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {categoryName ? (
              <>Category: {categoryName}</>
            ) : (
              <>Previous: {typeof previous === 'string' ? previous : previous?.toLocaleString()} {suffix}</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const PerformanceKPIs = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Average Processing Time"
        current={data.averageProcessingTime.current}
        previous={data.averageProcessingTime.previous}
        change={data.averageProcessingTime.change}
        suffix="days"
        icon={Clock}
        color="blue"
      />
      
      <KPICard
        title="Fastest Category"
        current={data.fastestCategory.time}
        previous={data.fastestCategory.previousTime}
        change={data.fastestCategory.change}
        suffix="days"
        icon={Zap}
        color="green"
        categoryName={data.fastestCategory.name}
      />
      
      <KPICard
        title="Slowest Category"
        current={data.slowestCategory.time}
        previous={data.slowestCategory.previousTime}
        change={data.slowestCategory.change}
        suffix="days"
        icon={Timer}
        color="red"
        categoryName={data.slowestCategory.name}
      />
      
      <KPICard
        title="Total Visa Types"
        current={data.totalVisaTypes.current}
        previous={data.totalVisaTypes.previous}
        change={data.totalVisaTypes.change}
        suffix="tracked"
        icon={Users}
        color="purple"
      />
    </div>
  );
};

export default PerformanceKPIs; 