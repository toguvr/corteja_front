import { Box, Typography, Grid, Button } from '@mui/material';

interface Schedule {
  id: string;
  time?: string;
  weekDay?: string; // valor tipo "0", "1", ..., "6"
  limit?: number;
  barbershopId: string;
  createdAt: Date;
  updatedAt: Date;
  appointments?: { date: string }[];
  subscriptions?: { active: boolean }[];
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
  const selectedWeekDay = selectedDate.getDay();

  const filtered = schedules
    .filter((s) => Number(s.weekDay) === selectedWeekDay && s.time)
    .sort((a, b) => (a.time && b.time ? a.time.localeCompare(b.time) : 0));

  const grouped: Record<string, Schedule[]> = {
    Madrugada: [],
    Manhã: [],
    Tarde: [],
    Noite: [],
  };

  filtered.forEach((s) => {
    if (!s.time) return;
    const hour = parseInt(s.time.split(':')[0], 10);
    grouped[getPeriod(hour)].push(s);
  });

  const now = new Date();

  return (
    <Box mt={3} pb={10}>
      {(['Madrugada', 'Manhã', 'Tarde', 'Noite'] as const).map((period) =>
        grouped[period].length ? (
          <Box key={period} mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              {period}
            </Typography>
            <Grid container spacing={1}>
              {grouped[period].map((s) => {
                const [hour, minute] = s.time!.split(':').map(Number);
                const scheduleDateTime = new Date(selectedDate);
                scheduleDateTime.setHours(hour, minute, 0, 0);

                const isPast = scheduleDateTime < now;

                const appointmentsToday = s.appointments?.filter((a) => {
                  const aDate = new Date(a.date);
                  return (
                    aDate.getFullYear() === selectedDate.getFullYear() &&
                    aDate.getMonth() === selectedDate.getMonth() &&
                    aDate.getDate() === selectedDate.getDate()
                  );
                }).length;

                const activeSubscriptions = s.subscriptions?.filter(
                  (sub) => sub.active
                ).length;

                const limitReached =
                  !!s.limit &&
                  ((appointmentsToday ?? 0) >= s.limit ||
                    (activeSubscriptions ?? 0) >= s.limit);

                return (
                  <Grid item key={s.id}>
                    <Button
                      variant={
                        selectedScheduleId === s.id ? 'contained' : 'outlined'
                      }
                      disabled={
                        isPast || (selectedScheduleId !== s.id && limitReached)
                      }
                      onClick={() => onSelectTime?.(s)}
                      sx={{ minWidth: 80 }}
                    >
                      {s.time}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ) : null
      )}
    </Box>
  );
};

export default ScheduleList;
