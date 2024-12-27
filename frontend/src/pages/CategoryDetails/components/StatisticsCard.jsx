import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const StatisticCard = ({ title, description, value }) => {
  const pluralizeDays = value === 1 ? "day" : "days";
  return (
    <Card className="dark:bg-gray-900/50 dark:border-gray-800 hover:dark:bg-gray-800/50 transition-all duration-200 backdrop-blur-sm rounded-lg shadow-sm w-48">
    <CardHeader className="pb-0 pb-0">
      <CardTitle className="text-xs font-semibold dark:text-gray-400">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-2 pt-0">
      <p className="text-xl font-bold dark:text-gray-100 mb-1">{value} {pluralizeDays}</p>
      <p className="text-xs dark:text-gray-400">{description}</p>
    </CardContent>
  </Card>
  );
};

export default StatisticCard;