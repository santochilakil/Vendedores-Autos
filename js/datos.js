/* =========================================================
   DATOS PRINCIPALES DE LA PLATAFORMA
   Vendedores-Autos

   Este archivo contiene la información editable de la agencia.
   Más adelante estos datos serán administrados desde Firebase
   mediante el Panel ADMIN.
========================================================= */


const CONFIG = {

  /* =======================================================
     INFORMACIÓN DE LA AGENCIA
  ======================================================= */

  agencia: {
    nombre: "Agencia de Autos",

    logo: "img/logo/logo.png",

    telefono: "529980000000",

    whatsapp: "529980000000",

    ciudad: "Cancún, Quintana Roo",

    horario: "Lunes a sábado de 9:00 a 19:00"
  },


  /* =======================================================
     INFORMACIÓN DEL VENDEDOR
  ======================================================= */

  vendedor: {

    nombre: "Tu vendedor",

    telefono: "529980000000",

    whatsapp: "529980000000",

    foto: ""
  },


  /* =======================================================
     PROMOCIÓN DEL MES

     Estos datos posteriormente serán modificables
     desde tu Panel ADMIN.
  ======================================================= */

  promocion: {

    activa: true,

    etiqueta: "PROMOCIÓN DEL MES",

    titulo: "Este mes mamá puede estrenar",

    descripcion:
      "Aprovecha las promociones especiales disponibles durante este mes.",

    bono: 30000,

    descuento: 10000,

    imagen: "img/promociones/promocion.jpg"
  },


  /* =======================================================
     CONFIGURACIÓN DEL COTIZADOR
  ======================================================= */

  cotizador: {

    tasaAnual: 13.5,

    mostrarTasa: false,

    engancheMinimo: 0,

    enganchePredeterminado: 100000,

    plazoPredeterminado: 60,

    plazos: [
      24,
      36,
      48,
      60,
      72
    ]
  },


  /* =======================================================
     VEHÍCULOS
     
     Aquí podremos agregar, quitar o modificar modelos.

     Posteriormente el Panel ADMIN modificará estos datos
     directamente desde Firebase.
  ======================================================= */

  vehiculos: [

    {
      id: "xpander-cross",

      marca: "Mitsubishi",

      modelo: "Xpander Cross",

      version: "2026",

      categoria: "SUV",

      precio: 459900,

      imagen: "img/autos/xpander-cross.jpg",

      disponible: true,

      destacado: true,

      descripcion:
        "SUV familiar de 7 pasajeros con gran espacio y tecnología.",

      caracteristicas: [
        "7 pasajeros",
        "Motor 1.5 L",
        "Transmisión automática",
        "Cámara de reversa"
      ]
    },


    {
      id: "outlander",

      marca: "Mitsubishi",

      modelo: "Outlander",

      version: "2026",

      categoria: "SUV",

      precio: 649900,

      imagen: "img/autos/outlander.jpg",

      disponible: true,

      destacado: true,

      descripcion:
        "SUV premium con tecnología, seguridad y amplio espacio.",

      caracteristicas: [
        "7 pasajeros",
        "Motor 2.5 L",
        "Transmisión automática",
        "Pantalla multimedia"
      ]
    },


    {
      id: "kicks",

      marca: "Nissan",

      modelo: "Kicks",

      version: "2026",

      categoria: "SUV",

      precio: 449900,

      imagen: "img/autos/kicks.jpg",

      disponible: true,

      destacado: false,

      descripcion:
        "SUV urbana con diseño moderno y excelente eficiencia.",

      caracteristicas: [
        "5 pasajeros",
        "Motor eficiente",
        "Pantalla multimedia",
        "Cámara de reversa"
      ]
    },


    {
      id: "corolla",

      marca: "Toyota",

      modelo: "Corolla",

      version: "2026",

      categoria: "Sedán",

      precio: 419900,

      imagen: "img/autos/corolla.jpg",

      disponible: true,

      destacado: false,

      descripcion:
        "Sedán reconocido por confiabilidad, comodidad y eficiencia.",

      caracteristicas: [
        "5 pasajeros",
        "Motor eficiente",
        "Transmisión automática",
        "Sistema de seguridad"
      ]
    }

  ]

};


/* =========================================================
   FUNCIONES AUXILIARES
========================================================= */


/*
   Formatea un número como moneda mexicana.
*/

function formatoMoneda(numero) {

  return new Intl.NumberFormat("es-MX", {

    style: "currency",

    currency: "MXN",

    maximumFractionDigits: 0

  }).format(numero);

}


/*
   Busca un vehículo por su ID.
*/

function obtenerVehiculo(id) {

  return CONFIG.vehiculos.find(

    vehiculo => vehiculo.id === id

  );

}


/*
   Devuelve únicamente vehículos disponibles.
*/

function obtenerVehiculosDisponibles() {

  return CONFIG.vehiculos.filter(

    vehiculo => vehiculo.disponible

  );

}

