/**
 * Constantes da aplicação cliente
 */

export const APP_CONFIG = {
  ORDER_HOURS: {
    START: '11:00',
    END: '23:00',
    DISPLAY: 'Pedidos das 11:00 às 23:00'
  },
  CONTACT: {
    PHONE: '8 800 700-67-76',
    PHONE_LABEL: 'Ligações Grátis'
  },
  DELIVERY: {
    FEE: 2,
    DEFAULT_TYPE: 'takeaway' as const
  },
  PACKAGING: {
    FEE: 1
  },
  LOCATIONS: [
    { value: 'omsk', label: 'Omsk' },
    { value: 'baker-street', label: '123 Baker Street' }
  ]
} as const
