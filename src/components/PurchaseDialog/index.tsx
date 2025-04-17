import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { useAuth } from '../../hooks/auth';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useBarbershop } from '../../hooks/barbershop';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useBarbershopServices } from '../../hooks/service';
import { ServiceDto } from '../../dtos';
import { useBalance } from '../../hooks/balance';
import * as Yup from 'yup';
import { isValidCellphone, isValidCPF } from '../../utils/validators';

const steps = ['Escolher Serviços', 'Seus Dados', 'Resumo do Pedido'];

type BillingAddress = {
  line_1: string;
  line_2: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
};

type CardData = {
  number: string;
  holder_name: string;
  holder_document: string;
  exp_month: string;
  exp_year: string;
  cvv: string;
  billing_address: BillingAddress;
};

export default function PurchaseDialog({
  openForm,
  setOpenForm,
}: {
  openForm: boolean;
  setOpenForm: any;
}) {
  const { user } = useAuth();
  const { barbershop } = useBarbershop();
  const { services } = useBarbershopServices();
  const { fetchBalance } = useBalance();
  const [cart, setCart] = useState<ServiceDto[]>([]);
  const [orderId, setOrderId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [installments, setInstallments] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    cpf: '',
    phone_number: user.phone || '',
  });
  const [cardData, setCardData] = useState<CardData>({
    number: '',
    holder_name: '',
    holder_document: user.document || '',
    exp_month: '',
    exp_year: '',
    cvv: '',
    billing_address: {
      line_1: '',
      line_2: '',
      zip_code: '',
      city: '',
      state: '',
      country: 'Brasil',
    },
  });
  const [pix, setPix] = useState({ qrCode: '', qrCodeUrl: '' });
  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pix.qrCode);
    toast.success('Código Pix copiado!');
  };
  // const handleChange = (event: any) => {
  //   const {
  //     target: { value },
  //   } = event;

  //   const selectedIds = typeof value === 'string' ? value.split(',') : value;

  //   const newCart = services.filter((service) =>
  //     selectedIds.includes(service.id)
  //   );

  //   setCart(newCart);
  // };

  const handleChange = (event: any) => {
    const selectedId = event.target.value;

    const selectedService = services.find((s) => s.id === selectedId);

    setCart(selectedService ? [selectedService] : []);
  };

  async function getPaymentStatus() {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (response.data.status === 'PAID' && response.data.payments.length) {
        fetchBalance();
        handleClose();
        return toast.success('Pagamento confirmado');
      }
      return toast.error('Pagamento ainda nao encontrado');
    } catch (err: any) {
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message || 'Erro ao buscar o status do pagamento'
        );
      }
    } finally {
      setLoading(false);
    }
  }
  const handleClose = () => {
    setOpenForm(false);
    setCurrentStep(1);
  };
  function sumPrices(): number {
    const totalCentavos = cart.reduce((acc, item) => acc + item?.amount, 0);
    return totalCentavos;
  }

  async function handleGeneratePix() {
    setLoading(true);

    const schema = Yup.object().shape({
      holder_document: Yup.string()
        .test('is-valid-cpf', 'CPF inválido', (value) =>
          value ? isValidCPF(value) : false
        )
        .required('CPF obrigatório'),
      phone_number: Yup.string()
        .test('is-valid-cellphone', 'Celular inválido', (value) =>
          value ? isValidCellphone(value) : false
        )
        .required('Celular obrigatório'),
    });

    const data = {
      card: cardData,
      installments,
      cartIds: cart.map((item) => item.id),
      isPix: true,
      document: cardData.holder_document.replace(/\D/g, ''),
      phone: values.phone_number.replace(/\D/g, ''),
      barbershopId: barbershop?.id,
    };

    try {
      await schema.validate(
        {
          holder_document: cardData.holder_document.replace(/\D/g, ''),
          phone_number: values.phone_number.replace(/\D/g, ''),
        },
        { abortEarly: false }
      );
      const response = await api.post('/orders', data);
      setPix(response.data.result.pix);
      setOrderId(response.data.id);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          validationErrors[error.path!] = error.message;
        });
        setErrors(validationErrors);
        return;
      }
      toast.error('Erro ao gerar pix, tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const getNextButton = () => {
    if (currentStep === 1) {
      return (
        <Button onClick={() => setCurrentStep(currentStep + 1)}>
          Seguinte
        </Button>
      );
    } else if (currentStep === 2) {
      return (
        <Button
          onClick={() => {
            handleGeneratePix();
            setCurrentStep(currentStep + 1);
          }}
        >
          Seguinte
        </Button>
      );
    } else if (currentStep === 3) {
      return <Button onClick={getPaymentStatus}>Finalizar</Button>;
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openForm}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            handleClose();
          },
        },
      }}
    >
      <DialogTitle></DialogTitle>
      <Stepper sx={{ padding: 2 }} activeStep={currentStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {currentStep == 1 && (
        <>
          <DialogContent dividers>
            <DialogContentText fontWeight="bold">
              Escolher Serviços
            </DialogContentText>
            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Serviços
              </InputLabel>
              {/* <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={cart.map((service) => service.id)}
                onChange={handleChange}
                fullWidth
                input={<OutlinedInput label="Serviços" />}
                renderValue={(selected) =>
                  services
                    .filter((s) => selected.includes(s.id))
                    .map((s) => s.name)
                    .join(', ')
                }
              >
                {services.map((service) => (
                  <MenuItem key={service?.id} value={service?.id}>
                    <Checkbox
                      checked={cart.some((item) => item.id === service.id)}
                    />
                    <ListItemText
                      primary={
                        service?.name +
                        ' - ' +
                        (service?.amount / 100).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      }
                    />
                  </MenuItem>
                ))}
              </Select> */}
              <Select
                labelId="demo-single-select-label"
                id="demo-single-select"
                value={cart[0]?.id || ''}
                onChange={handleChange}
                fullWidth
                input={<OutlinedInput label="Serviço" />}
              >
                {services.map((service) => (
                  <MenuItem key={service?.id} value={service?.id}>
                    <ListItemText
                      primary={
                        service?.name +
                        ' - ' +
                        (service?.amount / 100).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
        </>
      )}
      {currentStep == 2 && (
        <>
          <DialogContent dividers>
            <DialogContentText fontWeight="bold">Seus dados</DialogContentText>
            <TextField
              label="CPF"
              fullWidth
              margin="normal"
              placeholder="Digite o CPF"
              autoComplete="off"
              error={!!errors.holder_document}
              helperText={errors.holder_document}
              value={cardData.holder_document}
              onChange={(e) => {
                let onlyNumbers = e.target.value.replace(/\D/g, '');
                if (onlyNumbers.length > 9) {
                  onlyNumbers = onlyNumbers.replace(
                    /^(\d{3})(\d{3})(\d{3})(\d{0,2})/,
                    '$1.$2.$3-$4'
                  );
                } else if (onlyNumbers.length > 6) {
                  onlyNumbers = onlyNumbers.replace(
                    /^(\d{3})(\d{3})(\d{0,3})/,
                    '$1.$2.$3'
                  );
                } else if (onlyNumbers.length > 3) {
                  onlyNumbers = onlyNumbers.replace(
                    /^(\d{3})(\d{0,3})/,
                    '$1.$2'
                  );
                }
                setCardData({ ...cardData, holder_document: onlyNumbers });
              }}
              inputProps={{ maxLength: 14 }}
            />

            <TextField
              label="Contato"
              fullWidth
              margin="normal"
              error={!!errors.phone_number}
              helperText={errors.phone_number}
              value={values.phone_number}
              onChange={(e) => {
                let onlyNumbers = e.target.value.replace(/\D/g, '');
                if (onlyNumbers.length > 10) {
                  onlyNumbers = onlyNumbers.replace(
                    /^(\d{2})(\d{5})(\d{4}).*/,
                    '($1) $2-$3'
                  );
                } else if (onlyNumbers.length > 5) {
                  onlyNumbers = onlyNumbers.replace(
                    /^(\d{2})(\d{4})(\d{0,4})/,
                    '($1) $2-$3'
                  );
                } else if (onlyNumbers.length > 2) {
                  onlyNumbers = onlyNumbers.replace(
                    /^(\d{2})(\d{0,5})/,
                    '($1) $2'
                  );
                }
                setValues({ ...values, phone_number: onlyNumbers });
              }}
              inputProps={{ maxLength: 15 }}
            />
          </DialogContent>
        </>
      )}
      {currentStep == 3 && (
        <>
          <DialogContent dividers>
            <DialogContentText fontWeight="bold" color="primary">
              Resumo do Pedido
            </DialogContentText>
            <Box
              sx={{
                textAlign: 'left',
                padding: '12px 0',
                borderBottom: '1px solid #ddd',
                mb: '16px',
              }}
            >
              {cart.map((item) => (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography>{item.name}</Typography>
                  <Typography>
                    {(Math.round(item?.amount) / 100).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Typography>
                </Box>
              ))}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography>Tarifa de processamento</Typography>
                  <Tooltip title="Esta tarifa garante o seu pagamento e nos possibilita fazer pagamentos ao seu profissional quando você concluir as seus agendamentos">
                    <InfoOutlinedIcon fontSize="small" />
                  </Tooltip>
                </Box>
                <Typography>
                  {(
                    Math.round(sumPrices() * (Number(barbershop?.fee) / 100)) /
                    100
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {(
                    Math.round(
                      sumPrices() * (1 + Number(barbershop?.fee) / 100)
                    ) / 100
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="body2" color="gray">
                Pagamento 100% Seguro
              </Typography>

              <Box
                sx={{
                  my: 2,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img src={pix.qrCodeUrl} alt="QR Code Pix" width="200" />
              </Box>

              <Button
                onClick={handleCopyPixCode}
                color="success"
                variant="contained"
                fullWidth={false}
                startIcon={<ContentCopyIcon />}
              >
                Copiar código Pix
              </Button>
            </Box>
          </DialogContent>
        </>
      )}
      <DialogActions>
        {currentStep === 1 ? (
          <Button onClick={handleClose}>Cancel</Button>
        ) : (
          <Button onClick={() => setCurrentStep(currentStep - 1)}>
            Voltar
          </Button>
        )}
        {getNextButton()}
      </DialogActions>
    </Dialog>
  );
}
