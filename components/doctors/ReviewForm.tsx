// components/doctors/ReviewForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useCreateReview } from "@/hooks/useReviews";
import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "next-auth/react";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Отзыв должен содержать минимум 5 символов"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  doctorId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ doctorId, onSuccess }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const createReview = useCreateReview();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    if (!session?.user) {
      toast.error("Необходимо авторизоваться");
      return;
    }

    try {
      await createReview.mutateAsync({
        doctorId,
        authorName: session.user.name || "Аноним",
        rating,
        comment: values.comment,
      });
      toast.success("Спасибо за отзыв!");
      reset();
      setRating(5);
      onSuccess?.();
    } catch (error) {
      toast.error("Не удалось отправить отзыв");
    }
  };

  // Если пользователь не авторизован, показываем сообщение
  if (!session?.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Оставить отзыв</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Чтобы оставить отзыв, пожалуйста,{" "}
            <a href="/login" className="text-primary hover:underline">
              войдите в систему
            </a>
            .
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Оставить отзыв</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Оценка</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      value <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="comment">Ваш отзыв</Label>
            <Textarea 
              id="comment" 
              {...register("comment")} 
              rows={4} 
              placeholder="Расскажите о вашем опыте..." 
            />
            {errors.comment && (
              <p className="text-sm text-destructive">{errors.comment.message}</p>
            )}
          </div>
          <Button type="submit" disabled={createReview.isPending}>
            {createReview.isPending ? "Отправка..." : "Отправить отзыв"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}