import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const VisaCard = ({ id, title, description }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${id}/visas`);
  };

  return (
    <Card className="dark:bg-gray-900/50 dark:border-gray-800 hover:bg-slate-100 hover:dark:bg-gray-800/50 cursor-pointer transition-all duration-200 backdrop-blur-sm" onClick={handleClick}>
  <CardHeader>
    <CardTitle className="text-xl font-medium dark:text-gray-100">{title}</CardTitle>
  </CardHeader>
  <CardContent className="text-sm dark:text-gray-400">{description}</CardContent>
</Card>
  );
};

export default VisaCard;