import { Box, Typography, Grid, Button } from '@mui/material';

interface Schedule {
  id: string;
  time?: string;
  weekDay?: string; // valor tipo "0", "1", ..., "6"
  limit?: number;
  barbershopId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ScheduleListProps {
  schedules: Schedule[];
  selectedDate: Date;
  onSelectTime?: (schedule: Schedule) => void;
  selectedScheduleId?: string;
}

const getPeriod = (hour: number) => {
  if (hour < 6) return 'Madrugada';
  if (hour < 12) return 'Manhã';
  if (hour < 18) return 'Tarde';
  return 'Noite';
};

const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  selectedDate,
  onSelectTime,
  selectedScheduleId,
}) => {
  const selectedWeekDay = selectedDate.getDay(); // número de 0 a 6

  // Filtrar e ordenar os horários do dia selecionado
  const filtered = schedules
    .filter((s) => Number(s.weekDay) === selectedWeekDay && s.time)
    .sort((a, b) => {
      if (!a.time || !b.time) return 0;
      return a.time.localeCompare(b.time);
    });

  // Agrupar por período
  const grouped: Record<string, Schedule[]> = {
    Madrugada: [],
    Manhã: [],
    Tarde: [],
    Noite: [],
  };

  filtered.forEach((s) => {
    if (!s.time) return;
    const [hourStr] = s.time.split(':');
    const hour = parseInt(hourStr, 10);
    const period = getPeriod(hour);
    grouped[period].push(s);
  });

  return (
    <Box mt={3} pb={10}>
      {(['Madrugada', 'Manhã', 'Tarde', 'Noite'] as const).map((period) =>
        grouped[period].length > 0 ? (
          <Box key={period} mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              {period}
            </Typography>
            <Grid container spacing={1}>
              {grouped[period].map((s) => (
                <Grid item key={s.id}>
                  <Button
                    variant={
                      selectedScheduleId === s.id ? 'contained' : 'outlined'
                    }
                    disabled={
                      selectedScheduleId !== s.id &&
                      !!s.limit &&
                      ((Array.isArray(s.appointments) &&
                        s.appointments.filter((a) => {
                          const aDate = new Date(a.date);
                          return (
                            aDate.getFullYear() ===
                              selectedDate.getFullYear() &&
                            aDate.getMonth() === selectedDate.getMonth() &&
                            aDate.getDate() === selectedDate.getDate()
                          );
                        }).length >= s.limit) ||
                        (Array.isArray(s.appointments) &&
                          s.subscriptions.filter((sub) => sub.active).length >=
                            s.limit))
                    }
                    onClick={() => onSelectTime?.(s)}
                    sx={{ minWidth: 80 }}
                  >
                    {s.time}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null
      )}
    </Box>
  );
};

export default ScheduleList;
