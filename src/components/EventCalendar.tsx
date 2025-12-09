import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Event } from "@/types";

const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Pengajian Rutin Ahad",
    date: new Date(2024, 11, 15),
    description: "Kajian kitab bersama Ustadz Ahmad",
    type: "pengajian",
  },
  {
    id: "2",
    title: "Shalat Jumat",
    date: new Date(2024, 11, 13),
    description: "Khutbah oleh Ustadz Ridwan",
    type: "shalat",
  },
  {
    id: "3",
    title: "Pernikahan",
    date: new Date(2024, 11, 20),
    description: "Akad nikah Bapak Fulan & Ibu Fulanah",
    type: "reservasi",
  },
  {
    id: "4",
    title: "Isra Mi'raj",
    date: new Date(2024, 11, 25),
    description: "Peringatan Isra Mi'raj Nabi Muhammad SAW",
    type: "acara",
  },
];

const typeColors = {
  pengajian: "bg-primary text-primary-foreground",
  shalat: "bg-emerald-dark text-primary-foreground",
  acara: "bg-gold text-accent-foreground",
  reservasi: "bg-secondary text-secondary-foreground",
};

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDateEvents = sampleEvents.filter(
    (event) =>
      date && event.date.toDateString() === date.toDateString()
  );

  const eventDates = sampleEvents.map((e) => e.date.toDateString());

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="shadow-islamic border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Kalender Kegiatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-xl border-0 pointer-events-auto"
            modifiers={{
              event: (day) => eventDates.includes(day.toDateString()),
            }}
            modifiersClassNames={{
              event: "bg-primary/20 text-primary font-bold",
            }}
          />
        </CardContent>
      </Card>

      <Card className="shadow-islamic border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {date
              ? format(date, "EEEE, d MMMM yyyy", { locale: id })
              : "Pilih Tanggal"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {event.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <Badge className={typeColors[event.type]}>
                      {event.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Masjid Pendidikan Ibnul Qayyim</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Tidak ada kegiatan pada tanggal ini</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
