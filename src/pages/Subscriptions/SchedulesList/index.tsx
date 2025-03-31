import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useState } from 'react';
import { BarberDto } from '../../../dtos';

interface Schedule {
  id: string;
  time?: string;
  weekDay?: string; // valor tipo "0", "1", ..., "6"
  limit?: number;
  barbershopId: string;
  subscriptions?: { active: boolean }[];
  createdAt: Date;
  updatedAt: Date;
}

interface ScheduleListProps {
  schedules: Schedule[];
  onSelectTime?: (schedule: Schedule) => void;
  selectedScheduleId?: string;
  barbers: BarberDto[];
  handleSelectBarber?: (barber: BarberDto) => void;
  selectedBarberId?: string;
}

const getPeriod = (hour: number) => {
  if (hour < 6) return 'Madrugada';
  if (hour < 12) return 'Manhã';
  if (hour < 18) return 'Tarde';
  return 'Noite';
};

const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  onSelectTime,
  selectedScheduleId,
  selectedBarberId,
  barbers,
  handleSelectBarber,
}) => {
  const [selectedWeekDay, setSelectedWeekDay] = useState<string>('0');

  const filtered = schedules
    .filter((s) => s.time && s.weekDay === selectedWeekDay)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

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

  const isDayDisabled = (day: string) =>
    !schedules.some((s) => s.weekDay === day);

  return (
    <Box mt={3} pb={10}>
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        select
        label="Profissional"
        name="barberId"
        value={selectedBarberId}
        onChange={handleSelectBarber}
      >
        {barbers.map((barber) => (
          <MenuItem key={barber?.id} value={barber?.id}>
            {barber?.name || 'Sem nome'}
          </MenuItem>
        ))}
      </TextField>

      <ToggleButtonGroup
        sx={{ mb: 3, width: '100%' }}
        exclusive
        value={selectedWeekDay}
        onChange={(_, newDay) => newDay !== null && setSelectedWeekDay(newDay)}
      >
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((label, idx) => (
          <ToggleButton
            key={idx}
            color="primary"
            value={idx.toString()}
            disabled={isDayDisabled(idx.toString())}
            sx={{ flex: 1, padding: '6px' }}
          >
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

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
                      !!s.limit &&
                      Array.isArray(s.subscriptions) &&
                      s.subscriptions.filter(
                        (subscription) => subscription.active
                      ).length >= s.limit
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
