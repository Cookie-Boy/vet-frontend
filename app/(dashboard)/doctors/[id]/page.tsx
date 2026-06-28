// app/(dashboard)/doctors/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { notFound } from "next/navigation";
import { doctorsApi } from "@/lib/api/doctors";
import { reviewsApi } from "@/lib/api/reviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, Phone, Stethoscope, Star, ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { ReviewForm } from "@/components/doctors/ReviewForm";
import { getSpecializationLabel } from "@/types/doctor";
import { ReviewsSection } from "@/components/doctors/ReviewsSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) notFound();

  const { id } = await params;
  const doctor = await doctorsApi.server.getById(id);
  const reviews = await reviewsApi.server.getByDoctorId(id).catch(() => []);

  const fullName = `${doctor.lastName} ${doctor.firstName} ${doctor.middleName || ""}`.trim();
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="mb-2">
        <Link href="/doctors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к списку врачей
        </Link>
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{fullName}</h1>
          <p className="text-muted-foreground flex items-center mt-1">
            <Stethoscope className="mr-1 h-4 w-4" />
            {getSpecializationLabel(doctor.specialization)}
          </p>
          {doctor.clinicName && (
            <div className="flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              {doctor.clinicName}
            </div>
          )}
          {avgRating && (
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{avgRating}</span>
              <span className="text-muted-foreground ml-1">({reviews.length} отзывов)</span>
            </div>
          )}
        </div>
        <Button>
          <Link href={`/appointments/new?doctorId=${doctor.id}`} className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Записаться на приём
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Информация</TabsTrigger>
          <TabsTrigger value="reviews">Отзывы ({reviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4 pt-4">
          <Card>
            <CardHeader><CardTitle>Контактные данные</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center"><Phone className="mr-2 h-4 w-4" /> {doctor.phoneNumber}</div>
              <div className="flex items-center"><Mail className="mr-2 h-4 w-4" /> {doctor.email}</div>
              <div className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> Работает: {doctor.startWorkingDay?.slice(0,5)} – {doctor.endWorkingDay?.slice(0,5)}</div>
            </CardContent>
          </Card>
          {doctor.bio && (
            <Card>
              <CardHeader><CardTitle>Биография</CardTitle></CardHeader>
              <CardContent><p className="whitespace-pre-wrap">{doctor.bio}</p></CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="reviews" className="pt-4">
          <ReviewsSection doctorId={id} initialReviews={reviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
}