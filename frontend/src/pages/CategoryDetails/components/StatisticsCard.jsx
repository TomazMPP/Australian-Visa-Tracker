import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const StatisticCard = ({ title, description, value }) => {
  const pluralizeDays = value === 1 ? "day" : "days";
  return (
    <Card className="dark:bg-[#0d1117] dark:border-gray-800 md:w-48 mx-auto">
    <CardHeader className="p-2">
      <CardTitle className="text-xs text-center dark:text-gray-400">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pt-0 pb-2 px-2 text-center">
      <p className="text-lg md:text-xl font-bold dark:text-white">{value} {pluralizeDays}</p>
      <p className="text-[10px] md:text-xs dark:text-gray-500">{description}</p>
    </CardContent>
  </Card>
  );
};

export default StatisticCard;