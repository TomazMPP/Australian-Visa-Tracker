import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const VisaCard = ({ title, description }) => {
  return (
    <Card className="hover:bg-gray-100 cursor-pointer">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {description}
      </CardContent>
    </Card>
  );
};