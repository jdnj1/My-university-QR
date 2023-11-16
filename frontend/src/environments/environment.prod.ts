export const environment = {
  production: true,
  apiBaseUrl: 'http://192.168.18.5:3000/api',
  appBaseUrl: 'http://192.168.18.5:4200',
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
  //Mensaje si el QR no esta activado
  messNoActive: "El código QR no se encuentra activo en estos momentos. Inténtelo más tarde.",
  //Mensaje si el QR no tiene ninguna llamada activa (tambien se obtiene si todas las llamadas no estan configuradas correctamente)
  mess0Active: "El código QR no tiene ninguna llamada activa o no estan configuradas correctamente en estos momentos.",
  //Mensaje si el QR no existe
  messNoExists: "Este código QR no existe",
  //Mensaje si la fechad e validez del QR ha caducado
  messExpired: "El código QR ha superado la fecha de validez.",
  //Mensaje si el QR no tiene llamadas
  messEmpty: "El código QR no tiene llamadas.",

  defaultDes: "Descripción del código QR",

  //Colores de fondo para las graficas de solo el valor (preferiblemente colores suaves)
  maxColor: "#FF7878",
  minColor: "#1AA3F1",
  lastColor: "#0EB500"
};
