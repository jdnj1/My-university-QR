export const environment = {
  production: true,
  version: "v1.3.6",
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

   /**
   * Estrucutra de los iconos.
   * Para añadir uno nuevo, dirigirse a Bootstrap Icons.
   *
   * Name: nombre del icono que aparecerá en el select
   * Html: código html del icono que aparecerá en el select. En Boostrap Icons este codigo se encuentra en la sección "Code point"
   * Path: necesario para que aparezca los iconos en las gráficas. Se encuentran en los svg de los iconos. Si hay varios path, ponerlos juntos separandolos por un espacio.
   */
  icons: [
    {
      name:"No icon",
      html:"",
      path:""
    },
    {
      name:"Lightning charge fill",
      html:"&#xF46C;",
      path:"M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
    },
    {
      name:"Thermometer high",
      html:"&#xF5CE;",
      path:"M9.5 12.5a1.5 1.5 0 1 1-2-1.415V6.5a.5.5 0 0 1 1 0v4.585a1.5 1.5 0 0 1 1 1.415 M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1"
    },
    {
      name:"Droplet fill",
      html:"&#xF30B;",
      path:"M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6M6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13Z"
    },
    {
      name:"CO2",
      html:"&#xF61D;",
      path:"M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5m-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2M0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5"
    },

  ],
};
