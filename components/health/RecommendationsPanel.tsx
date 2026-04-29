// components/health/RecommendationsPanel.tsx
"use client";

import { useRecommendations, useRequestAnalysis } from "@/hooks/useHealthData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, RefreshCw } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";

interface RecommendationsPanelProps {
  petId: string;
}

export function RecommendationsPanel({ petId }: RecommendationsPanelProps) {
  const { data: recommendations, isLoading } = useRecommendations(petId);
  const requestAnalysis = useRequestAnalysis();

  const handleRequestAnalysis = async () => {
    try {
      await requestAnalysis.mutateAsync(petId);
      toast.success("Запрос на анализ отправлен. Рекомендации скоро появятся.");
    } catch (error) {
      toast.error("Не удалось запросить анализ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleRequestAnalysis} disabled={requestAnalysis.isPending}>
          <RefreshCw className={`mr-2 h-4 w-4 ${requestAnalysis.isPending ? "animate-spin" : ""}`} />
          Запросить анализ сейчас
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Загрузка рекомендаций...</p>}

      {!isLoading && (!recommendations || recommendations.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <Lightbulb className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Нет рекомендаций. Запросите анализ или дождитесь автоматической генерации.</p>
          </CardContent>
        </Card>
      )}

      {recommendations?.map((rec, index) => (
        <Card key={rec.generatedAt}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Рекомендация от {format(parseISO(rec.generatedAt), "d MMMM yyyy, HH:mm", { locale: ru })}</span>
              <Badge variant="outline">{rec.period}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Сводка</h4>
              <p className="text-muted-foreground">{rec.summary}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Рекомендации</h4>
              <ul className="list-disc pl-5 space-y-1">
                {rec.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-center p-2 bg-muted rounded">
                <p className="text-muted-foreground">Ср. пульс</p>
                <p className="font-medium">{rec.stats.avgHeartRate.toFixed(1)}</p>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <p className="text-muted-foreground">Ср. дыхание</p>
                <p className="font-medium">{rec.stats.avgRespiratoryRate.toFixed(1)}</p>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <p className="text-muted-foreground">Ср. темп.</p>
                <p className="font-medium">{rec.stats.avgTemperature.toFixed(1)}°</p>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <p className="text-muted-foreground">Аномалий</p>
                <p className="font-medium">{rec.stats.anomalyCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}