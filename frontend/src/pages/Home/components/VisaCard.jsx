import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const VisaCard = ({ id, title, description, isAnalyticsCard, donationUrl }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAnalyticsCard) {
      navigate('/analytics');
    } else {
      navigate(`/categories/${id}`);
    }
  };

  const cardClasses = isAnalyticsCard
  ? "bg-blue-200 dark:bg-slate-800/30 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700/30 cursor-pointer transition-all duration-200 backdrop-blur-sm"
  : "dark:bg-gray-900/50 dark:border-gray-800 hover:bg-slate-100 hover:dark:bg-gray-800/50 cursor-pointer transition-all duration-200 backdrop-blur-sm";

  return (
    <Card className={cardClasses} onClick={handleClick}>
      <CardHeader>
        <CardTitle className="text-xl font-medium dark:text-gray-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm dark:text-gray-400">{description}</CardContent>
    </Card>
  );
};

export default VisaCard;