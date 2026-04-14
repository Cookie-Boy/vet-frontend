// components/pets/MedicalRecordView.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MedicalRecordDto } from "@/types/pet";

interface MedicalRecordViewProps {
  record?: MedicalRecordDto;
}

export function MedicalRecordView({ record }: MedicalRecordViewProps) {
  if (!record) return <p className="text-muted-foreground">Нет данных медицинской карты</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Вакцинации</CardTitle></CardHeader>
        <CardContent>
          {record.vaccinations && record.vaccinations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Следующая</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.vaccinations.map((v, i) => (
                  <TableRow key={i}>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>{v.date}</TableCell>
                    <TableCell>{v.nextDueDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">Вакцинации не указаны</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Аллергии</CardTitle></CardHeader>
        <CardContent>
          {record.allergies && record.allergies.length > 0 ? (
            <ul className="list-disc pl-5">
              {record.allergies.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Аллергии не указаны</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Хронические заболевания</CardTitle></CardHeader>
        <CardContent>
          {record.chronicDiseases && record.chronicDiseases.length > 0 ? (
            <ul className="list-disc pl-5">
              {record.chronicDiseases.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Заболевания не указаны</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}