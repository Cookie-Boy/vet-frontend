"use client";

import { useReviews } from "@/hooks/useReviews";
import { ReviewForm } from "./ReviewForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Review } from "@/types/doctor";

interface ReviewsSectionProps {
  doctorId: string;
  initialReviews: Review[];
}

export function ReviewsSection({ doctorId, initialReviews }: ReviewsSectionProps) {
  const { data: reviews } = useReviews(doctorId, initialReviews);

  return (
    <div className="space-y-6">
      <ReviewForm doctorId={doctorId} />
      {!reviews || reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center text-muted-foreground py-8">
            <Star className="mx-auto h-8 w-8 mb-2" />
            <p>Пока нет отзывов. Будьте первым!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{review.authorName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}