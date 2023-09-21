export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:3000/api',
  appBaseUrl: 'http://localhost:4200',
  openApi: 'http://openapi.smartua.es',
  googleOAuth_ClientID: '314663795555-o1kmo76glu1jhep9u4cgbkn4bs4tmqm6.apps.googleusercontent.com',
  recordsByPage: 10,
  filters: [
    "uid",
    "description_origin",
    "lat",
    "lon",
    "organizationid",
    "alias",
    "cota",
    "description",
    "metric",
    "name",
    "origin",
    "typemeter"
  ],
  charts: [
    'assets/img/line-simple.png',
    'assets/img/bar-simple.png',
    'assets/img/gauge-grade.png',
    'assets/img/number.png'
  ],
  langs: [
    "es",
    "en"
  ],
  roles: [
    "Básico",
    "Administrador"
  ],
  messNoActive: "El código QR no se encuentra activo en estos momentos. Intentelo más tarde.",
  messNoExists: "Este código QR no existe",
  messExpired: "El código QR ha superado la fecha de validez.",
  messEmpty: "El código QR no tiene llamadas.",
  defaultDes: "Descripción del código QR"
};
