import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const VisaCard = ({ title, description }) => {
  return (
    <Card className="hover:bg-gray-100 cursor-pointer">
      <CardHeader>
      <CardTitle className="text-xl font-medium">{title}</CardTitle> 
      </CardHeader>
      <CardContent className="text-sm text-gray-600">{description}</CardContent> 
    </Card>
  );
};

export default VisaCard;