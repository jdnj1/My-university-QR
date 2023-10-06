// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'http://192.168.18.5:3000/api',
  appBaseUrl: 'http://192.168.18.5:4200',
  openApi: 'http://openapi.smartua.es',
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
  messNoActive: "El código QR no se encuentra activo en estos momentos. Intentelo más tarde.",
  //Mensaje si el QR no tiene ninguna llamada activa (tambien se obtiene si todas las llamadas no estan configuradas correctamente)
  mess0Active: "El código QR no tiene ninguna llamada activa o no estan configuradas correctamente en estos momentos.",
  //Mensaje si el QR no existe
  messNoExists: "Este código QR no existe",
  //Mensaje si la fechad e validez del QR ha caducado
  messExpired: "El código QR ha superado la fecha de validez.",
  //Mensaje si el QR no tiene llamadas
  messEmpty: "El código QR no tiene llamadas.",

  defaultDes: "Descripción del código QR"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
