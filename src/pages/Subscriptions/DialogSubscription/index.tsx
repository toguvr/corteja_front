import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Link,
  InputLabel,
  Tooltip,
} from '@mui/material';
import { BarberDto, PlanDto, ScheduleDto } from '../../../dtos';
import ScheduleList from '../SchedulesList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useBarbershop } from '../../../hooks/barbershop';

interface ScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  handleOpenCardDialog: () => void;
  confirmarAssinatura: () => void;
  schedules: ScheduleDto[];
  handleSelectSchedule?: (schedule: ScheduleDto) => void;
  selectedScheduleId?: string;
  barbers: BarberDto[];
  handleSelectBarber?: (barber: BarberDto) => void;
  selectedBarberId?: string;
  selectedPlan: PlanDto;
  cards: BarberDto[];
  handleSelectCard?: (barber: BarberDto) => void;
  selectedCardId?: string;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  onClose,
  schedules,
  handleSelectSchedule,
  selectedScheduleId,
  selectedBarberId,
  barbers,
  handleSelectBarber,
  selectedCardId,
  cards,
  handleSelectCard,
  selectedPlan,
  handleOpenCardDialog,
  confirmarAssinatura,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { barbershop } = useBarbershop();
  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      await confirmarAssinatura();
      setLoading(false);
      onClose();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const steps = ['Escolher horário', 'Resumo'];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Assinatura</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <ScheduleList
            onSelectTime={handleSelectSchedule}
            selectedScheduleId={selectedScheduleId}
            schedules={schedules}
            selectedBarberId={selectedBarberId}
            barbers={barbers}
            handleSelectBarber={handleSelectBarber}
          />
        )}

        {activeStep === 1 && (
          <Box
            sx={{
              maxWidth: 500,
              margin: 'auto',
              p: 3,
              border: '1px solid #ddd',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Seu pedido
            </Typography>
            <Box display="flex" justifyContent="space-between" my={1}>
              <Typography>
                {selectedPlan?.interval === 'week'
                  ? 'Plano semanal'
                  : 'Plano mensal'}
              </Typography>
              <Typography>
                {(selectedPlan?.price / 100).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" my={1}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography>Tarifa de processamento</Typography>
                <Tooltip title="Esta tarifa garante o seu pagamento e nos possibilita fazer pagamentos ao seu profissional quando você concluir as seus agendamentos">
                  <InfoOutlinedIcon fontSize="small" />
                </Tooltip>
              </Box>
              <Typography>
                {(
                  (selectedPlan?.price * (Number(barbershop?.fee) / 100)) /
                  100
                ).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" my={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Total
              </Typography>
              <Box textAlign="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {(
                    (selectedPlan?.price *
                      (1 + Number(barbershop?.fee) / 100)) /
                    100
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Typography>
              </Box>
            </Box>

            <Box my={3}>
              <Typography variant="subtitle1" gutterBottom>
                Método de pagamento
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="payment-method-label">Método</InputLabel>
                <Select
                  labelId="payment-method-label"
                  label="Método"
                  onChange={handleSelectCard}
                  value={selectedCardId}
                  defaultValue={selectedCardId}
                >
                  {cards.map((card) => (
                    <MenuItem value={card?.id}>
                      {card?.brand} ****{card?.lastFourDigits}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                color="secondary"
                variant="text"
                onClick={handleOpenCardDialog}
              >
                Adicionar cartão
              </Button>
            </Box>

            <Button
              variant="contained"
              fullWidth
              color="secondary"
              loading={loading}
              sx={{ py: 1.5 }}
              onClick={confirmarAssinatura}
            >
              Confirmar assinatura mensal
            </Button>

            <Typography
              variant="caption"
              display="block"
              textAlign="center"
              mt={2}
            >
              Ao clicar no botão "Confirmar assinatura mensal", você concorda
              com a{' '}
              <Link href="#" underline="hover">
                Política de Reembolso e Pagamento
              </Link>
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep === 0 && <Button onClick={onClose}>Cancelar</Button>}
        {activeStep > 0 && <Button onClick={handleBack}>Voltar</Button>}
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === 0 && !selectedScheduleId}
        >
          {activeStep !== steps.length - 1 && 'Próximo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDialog;
