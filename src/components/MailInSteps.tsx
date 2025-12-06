import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Camera, Package, Wrench, Truck } from "lucide-react";

export const MailInSteps = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Camera,
      title: t('mailin.step1.title'),
      text: t('mailin.step1.text')
    },
    {
      icon: Package,
      title: t('mailin.step2.title'),
      text: t('mailin.step2.text')
    },
    {
      icon: Wrench,
      title: t('mailin.step3.title'),
      text: t('mailin.step3.text')
    },
    {
      icon: Truck,
      title: t('mailin.step4.title'),
      text: t('mailin.step4.text')
    }
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, index) => (
        <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <step.icon className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-serif font-bold text-primary mb-2">{index + 1}</div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm">{step.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};