import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Paper,
  Divider,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Select,
  InputLabel,
  FormControl,
  Button,
  Stepper,
  Step,
  StepLabel,
  MobileStepper,
  Autocomplete,
} from '@mui/material';
import { useAuth } from '../../../hooks/auth';
import { toast } from 'react-toastify';
import api from '../../../services/api';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const banks = [
  {
    value: '100',
    name: '100 - PLANNER CV S.A.',
  },
  {
    value: '101',
    name: '101 - RENASCENCA DTVM LTDA',
  },
  {
    value: '102',
    name: '102 - XP INVESTIMENTOS CCTVM S/A',
  },
  {
    value: '104',
    name: '104 - CAIXA ECONOMICA FEDERAL',
  },
  {
    value: '105',
    name: '105 - LECCA CFI S.A.',
  },
  {
    value: '107',
    name: '107 - BCO BOCOM BBM S.A.',
  },
  {
    value: '108',
    name: '108 - PORTOCRED S.A. - CFI',
  },
  {
    value: '111',
    name: '111 - OLIVEIRA TRUST DTVM S.A.',
  },
  {
    value: '113',
    name: '113 - MAGLIANO S.A. CCVM',
  },
  {
    value: '114',
    name: '114 - CENTRAL COOPERATIVA DE CRÉDITO NO ESTADO DO ESPÍRITO SANTO',
  },
  {
    value: '117',
    name: '117 - ADVANCED CC LTDA',
  },
  {
    value: '118',
    name: '118 - STANDARD CHARTERED BI S.A.',
  },
  {
    value: '119',
    name: '119 - BCO WESTERN UNION',
  },
  {
    value: '120',
    name: '120 - BCO RODOBENS S.A.',
  },
  {
    value: '121',
    name: '121 - BCO AGIBANK S.A.',
  },
  {
    value: '122',
    name: '122 - BCO BRADESCO BERJ S.A.',
  },
  {
    value: '124',
    name: '124 - BCO WOORI BANK DO BRASIL S.A.',
  },
  {
    value: '125',
    name: '125 - PLURAL BCO BM',
  },
  {
    value: '126',
    name: '126 - BR PARTNERS BI',
  },
  {
    value: '127',
    name: '127 - CODEPE CVC S.A.',
  },
  {
    value: '128',
    name: '128 - MS BANK S.A. BCO DE CÂMBIO',
  },
  {
    value: '129',
    name: '129 - UBS BRASIL BI S.A.',
  },
  {
    value: '130',
    name: '130 - CARUANA SCFI',
  },
  {
    value: '131',
    name: '131 - TULLETT PREBON BRASIL CVC LTDA',
  },
  {
    value: '132',
    name: '132 - ICBC DO BRASIL BM S.A.',
  },
  {
    value: '133',
    name: '133 - CRESOL CONFEDERAÇÃO',
  },
  {
    value: '134',
    name: '134 - BGC LIQUIDEZ DTVM LTDA',
  },
  {
    value: '136',
    name: '136 - UNICRED',
  },
  {
    value: '138',
    name: '138 - GET MONEY CC LTDA',
  },
  {
    value: '139',
    name: '139 - INTESA SANPAOLO BRASIL S.A. BM',
  },
  {
    value: '140',
    name: '140 - EASYNVEST - TÍTULO CV SA',
  },
  {
    value: '142',
    name: '142 - BROKER BRASIL CC LTDA.',
  },
  {
    value: '143',
    name: '143 - TREVISO CC S.A.',
  },
  {
    value: '144',
    name: '144 - BEXS BCO DE CAMBIO S.A.',
  },
  {
    value: '145',
    name: '145 - LEVYCAM CCV LTDA',
  },
  {
    value: '146',
    name: '146 - GUITTA CC LTDA',
  },
  {
    value: '149',
    name: '149 - FACTA S.A. CFI',
  },
  {
    value: '157',
    name: '157 - ICAP DO BRASIL CTVM LTDA.',
  },
  {
    value: '159',
    name: '159 - CASA CREDITO S.A. SCM',
  },
  {
    value: '163',
    name: '163 - COMMERZBANK BRASIL S.A. - BCO MÚLTIPLO',
  },
  {
    value: '169',
    name: '169 - BCO OLÉ BONSUCESSO CONSIGNADO S.A.',
  },
  {
    value: '173',
    name: '173 - BRL TRUST DTVM SA',
  },
  {
    value: '174',
    name: '174 - PERNAMBUCANAS FINANC S.A. CFI',
  },
  {
    value: '177',
    name: '177 - GUIDE',
  },
  {
    value: '180',
    name: '180 - CM CAPITAL MARKETS CCTVM LTDA',
  },
  {
    value: '182',
    name: '182 - DACASA FINANCEIRA S/A - SCFI',
  },
  {
    value: '183',
    name: '183 - SOCRED SA - SCMEPP',
  },
  {
    value: '184',
    name: '184 - BCO ITAÚ BBA S.A.',
  },
  {
    value: '188',
    name: '188 - ATIVA S.A. INVESTIMENTOS CCTVM',
  },
  {
    value: '189',
    name: '189 - HS FINANCEIRA',
  },
  {
    value: '190',
    name: '190 - SERVICOOP',
  },
  {
    value: '191',
    name: '191 - NOVA FUTURA CTVM LTDA.',
  },
  {
    value: '194',
    name: '194 - PARMETAL DTVM LTDA',
  },
  {
    value: '196',
    name: '196 - FAIR CC S.A.',
  },
  {
    value: '197',
    name: '197 - STONE PAGAMENTOS S.A.',
  },
  {
    value: '208',
    name: '208 - BANCO BTG PACTUAL S.A.',
  },
  {
    value: '212',
    name: '212 - BANCO ORIGINAL',
  },
  {
    value: '213',
    name: '213 - BCO ARBI S.A.',
  },
  {
    value: '217',
    name: '217 - BANCO JOHN DEERE S.A.',
  },
  {
    value: '218',
    name: '218 - BCO BS2 S.A.',
  },
  {
    value: '222',
    name: '222 - BCO CRÉDIT AGRICOLE BR S.A.',
  },
  {
    value: '224',
    name: '224 - BCO FIBRA S.A.',
  },
  {
    value: '233',
    name: '233 - BANCO CIFRA',
  },
  {
    value: '237',
    name: '237 - BCO BRADESCO S.A.',
  },
  {
    value: '241',
    name: '241 - BCO CLASSICO S.A.',
  },
  {
    value: '243',
    name: '243 - BCO MÁXIMA S.A.',
  },
  {
    value: '246',
    name: '246 - BCO ABC BRASIL S.A.',
  },
  {
    value: '249',
    name: '249 - BANCO INVESTCRED UNIBANCO S.A.',
  },
  {
    value: '250',
    name: '250 - BCV',
  },
  {
    value: '253',
    name: '253 - BEXS CC S.A.',
  },
  {
    value: '254',
    name: '254 - PARANA BCO S.A.',
  },
  {
    value: '260',
    name: '260 - NU PAGAMENTOS S.A.',
  },
  {
    value: '265',
    name: '265 - BCO FATOR S.A.',
  },
  {
    value: '266',
    name: '266 - BCO CEDULA S.A.',
  },
  {
    value: '268',
    name: '268 - BARI CIA HIPOTECÁRIA',
  },
  {
    value: '269',
    name: '269 - HSBC BANCO DE INVESTIMENTO',
  },
  {
    value: '270',
    name: '270 - SAGITUR CC LTDA',
  },
  {
    value: '271',
    name: '271 - IB CCTVM S.A.',
  },
  {
    value: '272',
    name: '272 - AGK CC S.A.',
  },
  {
    value: '273',
    name: '273 - CCR DE SÃO MIGUEL DO OESTE',
  },
  {
    value: '274',
    name: '274 - MONEY PLUS SCMEPP LTDA',
  },
  {
    value: '276',
    name: '276 - SENFF S.A. - CFI',
  },
  {
    value: '278',
    name: '278 - GENIAL INVESTIMENTOS CVM S.A.',
  },
  {
    value: '279',
    name: '279 - CCR DE PRIMAVERA DO LESTE',
  },
  {
    value: '280',
    name: '280 - AVISTA S.A. CFI',
  },
  {
    value: '281',
    name: '281 - CCR COOPAVEL',
  },
  {
    value: '283',
    name: '283 - RB CAPITAL INVESTIMENTOS DTVM LTDA.',
  },
  {
    value: '285',
    name: '285 - FRENTE CC LTDA.',
  },
  {
    value: '286',
    name: '286 - CCR DE OURO',
  },
  {
    value: '288',
    name: '288 - CAROL DTVM LTDA.',
  },
  {
    value: '289',
    name: '289 - DECYSEO CC LTDA.',
  },
  {
    value: '290',
    name: '290 - PAGSEGURO',
  },
  {
    value: '292',
    name: '292 - BS2 DTVM S.A.',
  },
  {
    value: '293',
    name: '293 - LASTRO RDV DTVM LTDA',
  },
  {
    value: '296',
    name: '296 - VISION S.A. CC',
  },
  {
    value: '298',
    name: '298 - VIPS CC LTDA.',
  },
  {
    value: '299',
    name: '299 - SOROCRED CFI S.A.',
  },
  {
    value: '300',
    name: '300 - BCO LA NACION ARGENTINA',
  },
  {
    value: '301',
    name: '301 - BPP IP S.A.',
  },
  {
    value: '306',
    name: '306 - PORTOPAR DTVM LTDA',
  },
  {
    value: '307',
    name: '307 - TERRA INVESTIMENTOS DTVM',
  },
  {
    value: '309',
    name: '309 - CAMBIONET CC LTDA',
  },
  {
    value: '310',
    name: '310 - VORTX DTVM LTDA.',
  },
  {
    value: '315',
    name: '315 - PI DTVM S.A.',
  },
  {
    value: '318',
    name: '318 - BCO BMG S.A.',
  },
  {
    value: '319',
    name: '319 - OM DTVM LTDA',
  },
  {
    value: '320',
    name: '320 - BCO CCB BRASIL S.A.',
  },
  {
    value: '321',
    name: '321 - CREFAZ SCMEPP LTDA',
  },
  {
    value: '322',
    name: '322 - CCR DE ABELARDO LUZ',
  },
  {
    value: '323',
    name: '323 - MERCADO PAGO',
  },
  {
    value: '325',
    name: '325 - ÓRAMA DTVM S.A.',
  },
  {
    value: '329',
    name: '329 - QI SCD S.A.',
  },
  {
    value: '330',
    name: '330 - BANCO BARI S.A.',
  },
  {
    value: '331',
    name: '331 - FRAM CAPITAL DTVM S.A.',
  },
  {
    value: '332',
    name: '332 - ACESSO',
  },
  {
    value: '335',
    name: '335 - BANCO DIGIO',
  },
  {
    value: '336',
    name: '336 - BCO C6 S.A.',
  },
  {
    value: '340',
    name: '340 - SUPER PAGAMENTOS E ADMINISTRACAO DE MEIOS ELETRONICOS S.A.',
  },
  {
    value: '341',
    name: '341 - ITAÚ UNIBANCO S.A.',
  },
  {
    value: '342',
    name: '342 - CREDITAS SCD',
  },
  {
    value: '343',
    name: '343 - FFA SCMEPP LTDA.',
  },
  {
    value: '348',
    name: '348 - BCO XP S.A.',
  },
  {
    value: '349',
    name: '349 - AMAGGI S.A. CFI',
  },
  {
    value: '352',
    name: '352 - TORO CTVM LTDA',
  },
  {
    value: '354',
    name: '354 - NECTON INVESTIMENTOS S.A CVM',
  },
  {
    value: '355',
    name: '355 - ÓTIMO SCD S.A.',
  },
  {
    value: '364',
    name: '364 - GERENCIANET PAGAMENTOS DO BRASIL LTDA',
  },
  {
    value: '366',
    name: '366 - BCO SOCIETE GENERALE BRASIL',
  },
  {
    value: '370',
    name: '370 - BCO MIZUHO S.A.',
  },
  {
    value: '376',
    name: '376 - BCO J.P. MORGAN S.A.',
  },
  {
    value: '380',
    name: '380 - PICPAY SERVICOS S.A.',
  },
  {
    value: '383',
    name: '383 - JUNO',
  },
  {
    value: '389',
    name: '389 - BCO MERCANTIL DO BRASIL S.A.',
  },
  {
    value: '394',
    name: '394 - BCO BRADESCO FINANC. S.A.',
  },
  {
    value: '399',
    name: '399 - KIRTON BANK',
  },
  {
    value: '403',
    name: '403 - CORA CDS S.A.',
  },
  {
    value: '412',
    name: '412 - BCO CAPITAL S.A.',
  },
  {
    value: '422',
    name: '422 - BCO SAFRA S.A.',
  },
  {
    value: '456',
    name: '456 - BCO MUFG BRASIL S.A.',
  },
  {
    value: '461',
    name: '461 - Asaas I.P S.A',
  },
  {
    value: '464',
    name: '464 - BCO SUMITOMO MITSUI BRASIL S.A.',
  },
  {
    value: '473',
    name: '473 - BCO CAIXA GERAL BRASIL S.A.',
  },
  {
    value: '477',
    name: '477 - CITIBANK N.A.',
  },
  {
    value: '479',
    name: '479 - BCO ITAUBANK S.A.',
  },
  {
    value: '487',
    name: '487 - DEUTSCHE BANK S.A.BCO ALEMAO',
  },
  {
    value: '488',
    name: '488 - JPMORGAN CHASE BANK',
  },
  {
    value: '492',
    name: '492 - ING BANK N.V.',
  },
  {
    value: '495',
    name: '495 - BCO LA PROVINCIA B AIRES BCE',
  },
  {
    value: '505',
    name: '505 - BCO CREDIT SUISSE S.A.',
  },
  {
    value: '536',
    name: '536 - NEON PAGAMENTOS S.A. IP',
  },
  {
    value: '545',
    name: '545 - SENSO CCVM S.A.',
  },
  {
    value: '600',
    name: '600 - BCO LUSO BRASILEIRO S.A.',
  },
  {
    value: '604',
    name: '604 - BCO INDUSTRIAL DO BRASIL S.A.',
  },
  {
    value: '610',
    name: '610 - BCO VR S.A.',
  },
  {
    value: '611',
    name: '611 - BCO PAULISTA S.A.',
  },
  {
    value: '612',
    name: '612 - BCO GUANABARA S.A.',
  },
  {
    value: '613',
    name: '613 - OMNI BANCO S.A.',
  },
  {
    value: '623',
    name: '623 - BANCO PAN',
  },
  {
    value: '626',
    name: '626 - BCO FICSA S.A.',
  },
  {
    value: '630',
    name: '630 - SMARTBANK',
  },
  {
    value: '633',
    name: '633 - BCO RENDIMENTO S.A.',
  },
  {
    value: '634',
    name: '634 - BCO TRIANGULO S.A.',
  },
  {
    value: '637',
    name: '637 - BCO SOFISA S.A.',
  },
  {
    value: '643',
    name: '643 - BCO PINE S.A.',
  },
  {
    value: '652',
    name: '652 - ITAÚ UNIBANCO HOLDING S.A.',
  },
  {
    value: '653',
    name: '653 - BCO INDUSVAL S.A.',
  },
  {
    value: '654',
    name: '654 - BCO A.J. RENNER S.A.',
  },
  {
    value: '655',
    name: '655 - BCO VOTORANTIM S.A.',
  },
  {
    value: '707',
    name: '707 - BCO DAYCOVAL S.A',
  },
  {
    value: '712',
    name: '712 - BCO OURINVEST S.A.',
  },
  {
    value: '739',
    name: '739 - BCO CETELEM S.A.',
  },
  {
    value: '741',
    name: '741 - BCO RIBEIRAO PRETO S.A.',
  },
  {
    value: '743',
    name: '743 - BANCO SEMEAR',
  },
  {
    value: '745',
    name: '745 - BCO CITIBANK S.A.',
  },
  {
    value: '746',
    name: '746 - BCO MODAL S.A.',
  },
  {
    value: '747',
    name: '747 - BCO RABOBANK INTL BRASIL S.A.',
  },
  {
    value: '748',
    name: '748 - BCO COOPERATIVO SICREDI S.A.',
  },
  {
    value: '751',
    name: '751 - SCOTIABANK BRASIL',
  },
  {
    value: '752',
    name: '752 - BCO BNP PARIBAS BRASIL S A',
  },
  {
    value: '753',
    name: '753 - NOVO BCO CONTINENTAL S.A. - BM',
  },
  {
    value: '754',
    name: '754 - BANCO SISTEMA',
  },
  {
    value: '755',
    name: '755 - BOFA MERRILL LYNCH BM S.A.',
  },
  {
    value: '756',
    name: '756 - BANCOOB',
  },
  {
    value: '757',
    name: '757 - BCO KEB HANA DO BRASIL S.A.',
  },
  {
    value: '000',
    name: '000 - Banco não informado',
  },
  {
    value: '001',
    name: '001 - BCO DO BRASIL S.A.',
  },
  {
    value: '003',
    name: '003 - BCO DA AMAZONIA S.A.',
  },
  {
    value: '004',
    name: '004 - BCO DO NORDESTE DO BRASIL S.A.',
  },
  {
    value: '007',
    name: '007 - BNDES',
  },
  {
    value: '010',
    name: '010 - CREDICOAMO',
  },
  {
    value: '011',
    name: '011 - C.SUISSE HEDGING-GRIFFO CV S/A',
  },
  {
    value: '012',
    name: '012 - BANCO INBURSA',
  },
  {
    value: '014',
    name: '014 - STATE STREET BR S.A. BCO COMERCIAL',
  },
  {
    value: '015',
    name: '015 - UBS BRASIL CCTVM S.A.',
  },
  {
    value: '016',
    name: '016 - CCM DESP TRÂNS SC E RS',
  },
  {
    value: '017',
    name: '017 - BNY MELLON BCO S.A.',
  },
  {
    value: '018',
    name: '018 - BCO TRICURY S.A.',
  },
  {
    value: '021',
    name: '021 - BCO BANESTES S.A.',
  },
  {
    value: '024',
    name: '024 - BCO BANDEPE S.A.',
  },
  {
    value: '025',
    name: '025 - BCO ALFA S.A.',
  },
  {
    value: '029',
    name: '029 - BANCO ITAÚ CONSIGNADO S.A.',
  },
  {
    value: '033',
    name: '033 - BCO SANTANDER (BRASIL) S.A.',
  },
  {
    value: '036',
    name: '036 - BCO BBI S.A.',
  },
  {
    value: '037',
    name: '037 - BCO DO EST. DO PA S.A.',
  },
  {
    value: '040',
    name: '040 - BCO CARGILL S.A.',
  },
  {
    value: '041',
    name: '041 - BCO DO ESTADO DO RS S.A.',
  },
  {
    value: '047',
    name: '047 - BCO DO EST. DE SE S.A.',
  },
  {
    value: '060',
    name: '060 - CONFIDENCE CC S.A.',
  },
  {
    value: '062',
    name: '062 - HIPERCARD BM S.A.',
  },
  {
    value: '063',
    name: '063 - BANCO BRADESCARD',
  },
  {
    value: '064',
    name: '064 - GOLDMAN SACHS DO BRASIL BM S.A',
  },
  {
    value: '065',
    name: '065 - BCO ANDBANK S.A.',
  },
  {
    value: '066',
    name: '066 - BCO MORGAN STANLEY S.A.',
  },
  {
    value: '069',
    name: '069 - BCO CREFISA S.A.',
  },
  {
    value: '070',
    name: '070 - BRB - BCO DE BRASILIA S.A.',
  },
  {
    value: '074',
    name: '074 - BCO. J.SAFRA S.A.',
  },
  {
    value: '075',
    name: '075 - BCO ABN AMRO S.A.',
  },
  {
    value: '076',
    name: '076 - BCO KDB BRASIL S.A.',
  },
  {
    value: '077',
    name: '077 - BANCO INTER',
  },
  {
    value: '078',
    name: '078 - HAITONG BI DO BRASIL S.A.',
  },
  {
    value: '079',
    name: '079 - BCO ORIGINAL DO AGRO S/A',
  },
  {
    value: '080',
    name: '080 - B&amp;T CC LTDA.',
  },
  {
    value: '081',
    name: '081 - BANCOSEGURO S.A.',
  },
  {
    value: '082',
    name: '082 - BANCO TOPÁZIO S.A.',
  },
  {
    value: '083',
    name: '083 - BCO DA CHINA BRASIL S.A.',
  },
  {
    value: '084',
    name: '084 - UNIPRIME NORTE DO PARANÁ - CC',
  },
  {
    value: '085',
    name: '085 - COOP CENTRAL AILOS',
  },
  {
    value: '089',
    name: '089 - CCR REG MOGIANA',
  },
  {
    value: '091',
    name: '091 - CCCM UNICRED CENTRAL RS',
  },
  {
    value: '092',
    name: '092 - BRK S.A. CFI',
  },
  {
    value: '093',
    name: '093 - PÓLOCRED SCMEPP LTDA.',
  },
  {
    value: '094',
    name: '094 - BANCO FINAXIS',
  },
  {
    value: '095',
    name: '095 - TRAVELEX BANCO DE CÂMBIO S.A.',
  },
  {
    value: '096',
    name: '096 - BCO B3 S.A.',
  },
  {
    value: '097',
    name: '097 - CREDISIS CENTRAL DE COOPERATIVAS DE CRÉDITO LTDA.',
  },
  {
    value: '098',
    name: '098 - CREDIALIANÇA CCR',
  },
  {
    value: '099',
    name: '099 - UNIPRIME CENTRAL CCC LTDA.',
  },
];
export default function RegisterInformationForm() {
  const { signIn } = useAuth();
  const [cepBuscado, setCepBuscado] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    trading_name: '',
    password: '',
    slug: '',
    avatar: '',
    fee: 10,
    haveLoyalty: true,
    document: '',
    type: 'individual',
    birth_date: '',
    monthly_income: '',
    professional_occupation: '',
    phone: '',
    mother_name: '',
    description: '',
    annual_revenue: '',
    bank_code: '',
    agencia: '',
    agencia_dv: '',
    conta: '',
    conta_dv: '',
    legal_name: '',
    company_name: '',
    charge_transfer_fees: true,
    transfer_interval: 'weekly',
    transfer_day: 5,
    representative: {
      name: '',
      phone: '',
      email: '',
      document: '',
      mother_name: '',
      birthdate: '',
      monthly_income: '',
      professional_occupation: '',
      annual_revenue: '',
      corporation_type: '',
      founding_date: '',
      self_declared_legal_representative: true,
      address: {
        street: '',
        complementary: '',
        street_number: '',
        neighborhood: '',
        city: '',
        state: '',
        zip_code: '',
        reference_point: '',
      },
    },
    address: {
      street: '',
      complementary: '',
      street_number: '',
      neighborhood: '',
      city: '',
      state: '',
      zip_code: '',
      reference_point: '',
    },
    bank_account: {
      legal_name: '',
      type_receiver: 'checking',
      document_number: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const steps =
    form.type === 'individual'
      ? ['Seus dados', 'Endereço', 'Conta Bancária']
      : [
          'Dados da Barbearia',
          'Endereço',
          'Sócio Administrador',
          'Conta Bancária',
        ];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleSubmit(); // Último passo envia
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };
  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const isCheckbox = inputType === 'checkbox';
    const finalValue = isCheckbox ? checked : value;

    if (name.includes('.')) {
      const keys = name.split('.');

      if (keys.length === 2) {
        const [parent, child] = keys;
        setForm((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: finalValue,
          },
        }));
      } else if (keys.length === 3) {
        const [grandparent, parent, child] = keys;
        setForm((prev) => ({
          ...prev,
          [grandparent]: {
            ...prev[grandparent],
            [parent]: {
              ...prev[grandparent]?.[parent],
              [child]: finalValue,
            },
          },
        }));
      }
    } else {
      const updatedForm = {
        ...form,
        [name]: finalValue,
      };

      if (name === 'name') {
        updatedForm.slug = value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      setForm(updatedForm);
    }
  };
  function formatBirthdate(value: string): string {
    if (value.length >= 5) {
      return value.replace(/^(\d{2})(\d{2})(\d{0,4}).*/, '$1/$2/$3');
    } else if (value.length >= 3) {
      return value.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
    }
    return value;
  }
  const buscarEndereco = async () => {
    const cepLimpo = form.address.zip_code.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      alert('Digite um CEP válido com 8 dígitos.');
      return;
    }

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado.');
        return;
      }

      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        },
      }));

      setCepBuscado(true);
    } catch (err) {
      alert('Erro ao buscar o CEP.');
    }
  };
  const buscarEnderecoRepresentante = async () => {
    console.log('buscando endereco representante', form.representative.address);
    const cepLimpo = form?.representative?.address?.zip_code.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      alert('Digite um CEP válido com 8 dígitos.');
      return;
    }

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado.');
        return;
      }

      setForm((prev) => ({
        ...prev,
        representative: {
          ...prev.representative,
          address: {
            ...prev.representative.address,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          },
        },
      }));

      setCepBuscado(true);
    } catch (err) {
      alert('Erro ao buscar o CEP.');
    }
  };

  function formatPhoneNumber(phoneNumber: string) {
    // Extrai o DDD (área) e o número
    const areaCode = phoneNumber.slice(0, 2); // Primeiro os dois dígitos
    const number = phoneNumber.slice(2); // O restante do número

    return { ddd: areaCode, number: number, type: 'mobile' };
  }
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const [year, month, day] = form.birth_date.split('/');
      const isIndividual = form.type === 'individual';

      const payload = {
        password: form.password,
        register_information: {
          type: form.type,
          document: form.document,
          name: form.name,
          email: form.email,
          phone_numbers: [formatPhoneNumber(form.phone)],
          site_url: null,
          company_name: form.company_name || '',
          trading_name: form.legal_name || '',
          annual_revenue: form.annual_revenue || '',
          founding_date: form.representative.founding_date || '',
          address: {
            street: form.address.street,
            complementary: form.address.complementary || 'sem complemento',
            street_number: form.address.street_number,
            neighborhood: form.address.neighborhood,
            city: form.address.city,
            state: form.address.state,
            zip_code: form.address.zip_code,
            reference_point: form.address.reference_point || 'sem referencia',
          },
          ...(form.type === 'company' && {
            main_address: {
              street: form.address.street,
              complement: form.address.complementary || 'sem complemento',
              number: form.address.street_number,
              neighborhood: form.address.neighborhood,
              city: form.address.city,
              state: form.address.state,
              zip_code: form.address.zip_code,
              reference_point: form.address.reference_point || 'sem referencia',
            },

            managing_partners: [
              {
                name: form.representative.name,
                email: form.representative.email,
                document: form.representative.document,
                type: 'individual',
                mother_name: form.representative.mother_name,
                birth_date: form.representative.birthdate,
                monthly_income: form.representative.monthly_income,
                professional_occupation:
                  form.representative.professional_occupation,
                self_declared_legal_representative:
                  form.representative.self_declared_legal_representative,
                address: {
                  street: form.address.street,
                  complement: form.address.complementary || 'sem complemento',
                  number: form.address.street_number,
                  neighborhood: form.address.neighborhood,
                  city: form.address.city,
                  state: form.address.state,
                  zip_code: form.address.zip_code,
                  reference_point:
                    form.address.reference_point || 'sem referencia',
                },
                phone_numbers: [formatPhoneNumber(form.representative.phone)],
              },
            ],
          }),
          ...(isIndividual && {
            birthdate: form.birth_date,
            professional_occupation: form.professional_occupation,
            mother_name: form.mother_name,
            monthly_income: form.monthly_income,
          }),
        },
        default_bank_account: {
          bank: form.bank_code,
          branch_number: form.agencia,
          branch_check_digit: form.agencia_dv,
          account_number: form.conta,
          account_check_digit: form.conta_dv,
          type: 'checking',
          holder_type: form.type,
          holder_document: form.bank_account.document_number,
          holder_name: form.bank_account.legal_name,
        },
      };

      const { data } = await api.post('/barbershops', payload);
      toast.success('Barbearia cadastrada com sucesso!');
      await signIn({ ...form, role: 'admin', page: '/empresa/dashboard' });
    } catch (err) {
      console.error(err);
      toast.error('Erro ao cadastrar barbearia.');
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (value) => {
    const cents = Number(value || 0);
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleMoneyChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    const cents = Number(raw);
    setForm((prev) => ({
      ...prev,
      [e.target.name]: isNaN(cents) ? '' : cents,
    }));
  };
  const slugify = (text: string) =>
    text
      .toString()
      .normalize('NFD') // remove acentos
      .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-') // troca tudo por hífen
      .replace(/^-+|-+$/g, ''); // remove hífens extras
  return (
    <Box p={2}>
      {' '}
      <Typography variant="h5" gutterBottom>
        Tipo de Pessoa
      </Typography>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="person-type-label">Tipo</InputLabel>
        <Select
          labelId="person-type-label"
          value={form.type}
          label="Tipo"
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <MenuItem value="company">Pessoa Jurídica</MenuItem>
          <MenuItem value="individual">Pessoa Física</MenuItem>
        </Select>
      </FormControl>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && (
        <Box>
          {form.type === 'company' ? (
            <>
              <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="CNPJ"
                      fullWidth
                      autoComplete="off"
                      //  error={!!errors.holder_document}
                      //  helperText={errors.holder_document}
                      value={form.document}
                      onChange={(e) => {
                        let onlyNumbers = e.target.value.replace(/\D/g, '');

                        if (onlyNumbers.length > 12) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
                            '$1.$2.$3/$4-$5'
                          );
                        } else if (onlyNumbers.length > 8) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{3})(\d{3})(\d{0,4})/,
                            '$1.$2.$3/$4'
                          );
                        } else if (onlyNumbers.length > 5) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{3})(\d{0,3})/,
                            '$1.$2.$3'
                          );
                        } else if (onlyNumbers.length > 2) {
                          onlyNumbers = onlyNumbers.replace(
                            /^(\d{2})(\d{0,3})/,
                            '$1.$2'
                          );
                        }

                        setForm({ ...form, document: onlyNumbers });
                      }}
                      inputProps={{ maxLength: 18 }} // 14 números + 4 pontuações
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={form.name}
                      onChange={handleChange}
                      name="name"
                      fullWidth
                      label="Nome da empresa"
                    />{' '}
                    {form.name && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 0.5, ml: 0.5, color: 'text.secondary' }}
                      >
                        Seu link: <strong>{slugify(form.name)}</strong>
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={form.email}
                      onChange={handleChange}
                      name="email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Senha"
                      value={form.password}
                      onChange={handleChange}
                      name="password"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Celular"
                      fullWidth
                      // error={!!errors.phone}
                      // helperText={errors.phone}
                      value={form.phone}
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
                        setForm({ ...form, phone: onlyNumbers });
                      }}
                      inputProps={{ maxLength: 15 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Razão Social"
                      value={form.trading_name}
                      onChange={handleChange}
                      name="trading_name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome Fantasia"
                      value={form.company_name}
                      onChange={handleChange}
                      name="company_name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="annual_revenue"
                      label="Receita Anual"
                      value={formatCurrency(form.annual_revenue)}
                      onChange={handleMoneyChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Paper>
            </>
          ) : (
            <>
              <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="CPF"
                      fullWidth
                      placeholder="Digite o CPF"
                      autoComplete="off"
                      // error={!!errors.document}
                      // helperText={errors.document}
                      value={form.document}
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
                        setForm({ ...form, document: onlyNumbers });
                      }}
                      inputProps={{ maxLength: 14 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome"
                      value={form.name}
                      onChange={handleChange}
                      name="name"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={form.email}
                      onChange={handleChange}
                      name="email"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Senha"
                      value={form.password}
                      onChange={handleChange}
                      name="password"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Celular"
                      fullWidth
                      // error={!!errors.phone}
                      // helperText={errors.phone}
                      value={form.phone}
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
                        setForm({ ...form, phone: onlyNumbers });
                      }}
                      inputProps={{ maxLength: 15 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Data de nascimento"
                      fullWidth
                      value={formatBirthdate(form.birth_date)}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, '');
                        setForm({ ...form, birth_date: onlyNumbers });
                      }}
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ocupação"
                      value={form.professional_occupation}
                      onChange={handleChange}
                      name="professional_occupation"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Renda Mensal"
                      value={formatCurrency(form.monthly_income)}
                      onChange={handleMoneyChange}
                      name="monthly_income"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome da Mãe"
                      value={form.mother_name}
                      onChange={handleChange}
                      name="mother_name"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
        </Box>
      )}
      {activeStep === 1 && (
        <Box>
          {
            <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CEP"
                    value={form.address.zip_code}
                    onChange={handleChange}
                    name="address.zip_code"
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    size="medium"
                    onClick={buscarEndereco}
                  >
                    Buscar
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Rua"
                    value={form.address.street}
                    onChange={handleChange}
                    name="address.street"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={form.address.street_number}
                    onChange={handleChange}
                    name="address.street_number"
                    label="Número"
                    defaultValue="10"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Complemento"
                    value={form.address.complementary}
                    onChange={handleChange}
                    name="address.complementary"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    value={form.address.neighborhood}
                    onChange={handleChange}
                    name="address.neighborhood"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    value={form.address.city}
                    onChange={handleChange}
                    name="address.city"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={form.address.state}
                    onChange={handleChange}
                    name="address.state"
                    label="Estado"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ponto de Referência"
                    value={form.address.reference_point}
                    onChange={handleChange}
                    name="address.reference_point"
                  />
                </Grid>
              </Grid>
            </Paper>
          }
        </Box>
      )}
      {activeStep === 2 && (
        <Box>
          {
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={banks}
                    getOptionLabel={(option) => option.name}
                    value={
                      banks.find((bank) => bank.value === form.bank_code) ||
                      null
                    }
                    onChange={(_, newValue) =>
                      setForm({ ...form, bank_code: newValue?.value || '' })
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Banco" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Agência"
                    value={form.agencia}
                    onChange={handleChange}
                    name="agencia"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dígito da Agência"
                    value={form.agencia_dv}
                    onChange={handleChange}
                    name="agencia_dv"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Conta"
                    value={form.conta}
                    onChange={handleChange}
                    name="conta"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dígito da Conta"
                    value={form.conta_dv}
                    onChange={handleChange}
                    name="conta_dv"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Documento do Titular"
                    onChange={handleChange}
                    name="bank_account.document_number"
                    value={form.bank_account.document_number}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome do Titular"
                    value={form.bank_account.legal_name}
                    onChange={handleChange}
                    name="bank_account.legal_name"
                  />
                </Grid>
              </Grid>{' '}
            </Paper>
          }
        </Box>
      )}
      {activeStep === 3 && (
        <Box>
          {
            <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={form.representative.name}
                    onChange={handleChange}
                    name="representative.name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={form.representative.email}
                    onChange={handleChange}
                    name="representative.email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CPF"
                    value={form.representative.document}
                    onChange={handleChange}
                    name="representative.document"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome da Mãe"
                    value={form.representative.mother_name}
                    onChange={handleChange}
                    name="representative.mother_name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Data de nascimento"
                    fullWidth
                    value={formatBirthdate(form.representative.birthdate)}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, '');
                      setForm({
                        ...form,
                        representative: {
                          ...form.representative,
                          birthdate: onlyNumbers,
                        },
                      });
                    }}
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Renda Mensal"
                    onChange={handleMoneyChange}
                    value={formatCurrency(form.representative.monthly_income)}
                    name="representative.monthly_income"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ocupação"
                    value={form.representative.professional_occupation}
                    onChange={handleChange}
                    name="representative.professional_occupation"
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked={false} />}
                    label="Representante Legal Autodeclarado"
                    value={
                      form.representative.self_declared_legal_representative
                    }
                    onChange={handleChange}
                    name="representative.self_declared_legal_representative"
                  />
                </Grid> */}
              </Grid>

              <Typography variant="subtitle1" gutterBottom mt={2}>
                Endereço do Sócio
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CEP"
                    value={form.representative.address.zip_code}
                    onChange={handleChange}
                    name="representative.address.zip_code"
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    size="medium"
                    loading={cepBuscado}
                    onClick={buscarEnderecoRepresentante}
                  >
                    Buscar
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Rua"
                    value={form.representative.address.street}
                    onChange={handleChange}
                    name="representative.address.street"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número"
                    value={form.representative.address.street_number}
                    onChange={handleChange}
                    name="representative.address.street_number"
                    defaultValue="10"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={form.representative.address.complementary}
                    onChange={handleChange}
                    name="representative.address.complementary"
                    label="Complemento"
                    defaultValue="com"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    value={form.representative.address.neighborhood}
                    onChange={handleChange}
                    name="representative.address.neighborhood"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    value={form.representative.address.city}
                    onChange={handleChange}
                    name="representative.address.city"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Estado"
                    value={form.representative.address.state}
                    onChange={handleChange}
                    name="representative.address.state"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ponto de Referência"
                    value={form.representative.address.reference_point}
                    onChange={handleChange}
                    name="representative.address.reference_point"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom mt={2}>
                Telefone do Sócio
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Celular"
                    fullWidth
                    margin="normal"
                    size="small"
                    // error={!!errors.phone}
                    // helperText={errors.phone}
                    value={form.representative.phone}
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
                      setForm({
                        ...form,
                        representative: {
                          ...form.representative,
                          phone: onlyNumbers,
                        },
                      });
                    }}
                    inputProps={{ maxLength: 15 }}
                  />
                </Grid>
              </Grid>
            </Paper>
          }
        </Box>
      )}
      <MobileStepper
        variant="dots"
        steps={steps.length}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} loading={loading}>
            {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Voltar
          </Button>
        }
      />
    </Box>
  );
}
