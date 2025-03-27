export interface AddressDto {
  id: string;
  street?: string;
  complementary?: string;
  street_number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  referencePoint?: string;
  createdAt: Date;
  updatedAt: Date;
  barbershopId: string;
}

export interface BankDto {
  id: string;
  holderName?: string;
  holderType: string;
  holderDocument: string;
  bank?: string;
  branchNumber?: string;
  branchCheckDigit?: string;
  accountCheckDigit?: string;
  accountNumber?: string;
  type?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BarbershopDto {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  password: string;
  haveLoyalty: boolean;
  fee?: number;
  slug: string;
  addressId?: string;
  bankId?: string;
  receiverId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BarberDto {
  id: string;
  name?: string;
  barbershopId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceDto {
  id: string;
  name?: string;
  description?: string;
  timeRequired?: string;
  amount?: number;
  barbershopId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleDto {
  id: string;
  time?: string;
  weekDay?: string;
  limit?: number;
  barbershopId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerDto {
  id: string;
  name?: string;
  email?: string;
  password: string;
  phone: string;
  document?: string;
  avatar?: string;
  cardId?: string;
  addressId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentDto {
  id: string;
  barberId: string;
  date: Date;
  serviceId?: string;
  scheduleId?: string;
  customerId?: string;
  barbershopId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentDto {
  id: string;
  paymentDate?: Date;
  status?: string;
  transactionId?: string;
  paymentMethod?: string;
  fee?: number;
  amount?: number;
  installments?: number;
  total?: number;
  customerId?: string;
  barbershopId?: string;
  serviceId?: string;
  barberId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BalanceDto {
  id: string;
  paymentDate?: Date;
  status?: string;
  amount?: number;
  type?: string;
  customerId?: string;
  barbershopId?: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
