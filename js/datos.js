/* =====================================================
   CONFIGURACIÓN DEL VENDEDOR
===================================================== */

const CONFIG = {

  agencia: "Agencia de Autos",

  vendedor: "Carlos Ramírez",

  telefono: "529980000000",

  whatsapp: "529980000000",

  logo: "img/logo/logo.png",

  colores: {

    principal: "#111827",

    secundario: "#2563eb",

    verde: "#16a34a"

  }

};


/* =====================================================
   PROMOCIÓN ACTUAL
===================================================== */

const PROMOCION = {

  activa: true,

  titulo:
    "Este 10 de mayo mamá puede estrenar",

  descripcion:
    "Aprovecha las promociones especiales de este mes.",

  bono: 30000,

  descuento: 10000,

  imagen:
    "img/promociones/promocion.jpg"

};


/* =====================================================
   VEHÍCULOS
===================================================== */

const VEHICULOS = [

  {

    id: "xpander-cross",

    marca: "Mitsubishi",

    modelo: "Xpander Cross",

    version: "2026",

    categoria: "SUV",

    precio: 489000,

    imagen:
      "img/autos/xpander-cross.jpg",

    caracteristicas: {

      motor: "1.5 L",

      transmision: "Automática",

      pasajeros: "7",

      combustible: "Gasolina"

    }

  },


  {

    id: "outlander",

    marca: "Mitsubishi",

    modelo: "Outlander",

    version: "2026",

    categoria: "SUV",

    precio: 699000,

    imagen:
      "img/autos/outlander.jpg",

    caracteristicas: {

      motor: "2.5 L",

      transmision: "Automática",

      pasajeros: "7",

      combustible: "Gasolina"

    }

  },


  {

    id: "kicks",

    marca: "Nissan",

    modelo: "Kicks",

    version: "2026",

    categoria: "SUV",

    precio: 389000,

    imagen:
      "img/autos/kicks.jpg",

    caracteristicas: {

      motor: "2.0 L",

      transmision: "Automática",

      pasajeros: "5",

      combustible: "Gasolina"

    }

  },


  {

    id: "corolla",

    marca: "Toyota",

    modelo: "Corolla",

    version: "2026",

    categoria: "Sedán",

    precio: 399000,

    imagen:
      "img/autos/corolla.jpg",

    caracteristicas: {

      motor: "2.0 L",

      transmision: "Automática",

      pasajeros: "5",

      combustible: "Gasolina"

    }

  }

];
