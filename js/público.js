/* =========================================================
   Vendedores-Autos
   JAVASCRIPT DE LA PÁGINA PÚBLICA

   Este archivo controla:
   - Catálogo
   - Filtros
   - Búsqueda
   - Detalle de vehículos
   - Cotizador
   - WhatsApp
   - Llamadas
   - Prueba de manejo
   - Menú móvil
   - Registro básico de interacciones

   IMPORTANTE:
   Por ahora funciona con datos.js.
   Posteriormente conectaremos Firebase.
========================================================= */


/* =========================================================
   VARIABLES
========================================================= */

let categoriaActual = "";

let vehiculoActual = null;


/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  cargarInformacionAgencia();

  cargarPromocion();

  cargarCatalogo();

  cargarSelectores();

  configurarEventos();

  calcularMensualidad();

});


/* =========================================================
   INFORMACIÓN DE AGENCIA Y VENDEDOR
========================================================= */

function cargarInformacionAgencia() {

  if (!CONFIG) return;


  const agencia = CONFIG.agencia || {};

  const vendedor = CONFIG.vendedor || {};


  const nombreAgencia =
    document.getElementById("nombreAgencia");

  const nombreVendedor =
    document.getElementById("nombreVendedor");

  const logoAgencia =
    document.getElementById("logoAgencia");

  const footerAgencia =
    document.getElementById("footerAgencia");

  const footerVendedor =
    document.getElementById("footerVendedor");

  const logoFooter =
    document.getElementById("logoFooter");


  if (nombreAgencia) {

    nombreAgencia.textContent =
      agencia.nombre || "Agencia de Autos";

  }


  if (nombreVendedor) {

    nombreVendedor.textContent =
      vendedor.nombre || "Tu vendedor";

  }


  if (footerAgencia) {

    footerAgencia.textContent =
      agencia.nombre || "Agencia de Autos";

  }


  if (footerVendedor) {

    footerVendedor.textContent =
      vendedor.nombre || "Tu vendedor";

  }


  if (logoAgencia && agencia.logo) {

    logoAgencia.src = agencia.logo;

  }


  if (logoFooter && agencia.logo) {

    logoFooter.src = agencia.logo;

  }

}


/* =========================================================
   PROMOCIÓN
========================================================= */

function cargarPromocion() {

  if (!CONFIG || !CONFIG.promocion) return;


  const promo = CONFIG.promocion;


  const titulo =
    document.getElementById("promocionTitulo");

  const descripcion =
    document.getElementById("promocionDescripcion");

  const bono =
    document.getElementById("promocionBono");

  const descuento =
    document.getElementById("promocionDescuento");

  const imagen =
    document.getElementById("imagenPromocion");


  if (titulo) {

    titulo.textContent =
      promo.titulo || "";

  }


  if (descripcion) {

    descripcion.textContent =
      promo.descripcion || "";

  }


  if (bono) {

    bono.textContent =
      formatoMoneda(promo.bono || 0);

  }


  if (descuento) {

    descuento.textContent =
      formatoMoneda(promo.descuento || 0);

  }


  if (imagen && promo.imagen) {

    imagen.src = promo.imagen;

    imagen.onerror = function () {

      this.style.display = "none";

    };

  }

}


/* =========================================================
   CATÁLOGO DE VEHÍCULOS
========================================================= */

function cargarCatalogo() {

  const catalogo =
    document.getElementById("catalogo");


  if (!catalogo) return;


  let vehiculos =
    obtenerVehiculosDisponibles();


  /* FILTRO POR CATEGORÍA */

  if (categoriaActual) {

    vehiculos =
      vehiculos.filter(function (vehiculo) {

        return vehiculo.categoria === categoriaActual;

      });

  }


  /* FILTRO POR BÚSQUEDA */

  const buscador =
    document.getElementById("buscarModelo");


  if (buscador && buscador.value.trim() !== "") {

    const texto =
      buscador.value
        .toLowerCase()
        .trim();


    vehiculos =
      vehiculos.filter(function (vehiculo) {

        const contenido = (

          vehiculo.marca +
          " " +
          vehiculo.modelo +
          " " +
          vehiculo.version +
          " " +
          vehiculo.categoria

        ).toLowerCase();


        return contenido.includes(texto);

      });

  }


  catalogo.innerHTML = "";


  if (vehiculos.length === 0) {

    catalogo.innerHTML = `

      <div class="sin-resultados">

        <h3>No encontramos vehículos</h3>

        <p>
          Intenta cambiar la búsqueda o categoría.
        </p>

      </div>

    `;

    return;

  }


  vehiculos.forEach(function (vehiculo) {

    catalogo.appendChild(
      crearTarjetaVehiculo(vehiculo)
    );

  });

}


/* =========================================================
   CREAR TARJETA DE VEHÍCULO
========================================================= */

function crearTarjetaVehiculo(vehiculo) {

  const tarjeta =
    document.createElement("article");


  tarjeta.className =
    "tarjeta-vehiculo";


  tarjeta.innerHTML = `

    <div class="vehiculo-imagen-contenedor">

      <img
        class="vehiculo-imagen"
        src="${vehiculo.imagen}"
        alt="${vehiculo.marca} ${vehiculo.modelo}"
      >

      ${
        vehiculo.destacado
        ?
        `<span class="vehiculo-destacado">
          Destacado
        </span>`
        :
        ""
      }

    </div>


    <div class="vehiculo-info">

      <span class="vehiculo-categoria">
        ${vehiculo.categoria}
      </span>


      <small class="vehiculo-marca">
        ${vehiculo.marca}
      </small>


      <h3>
        ${vehiculo.modelo}
      </h3>


      <p class="vehiculo-version">
        ${vehiculo.version}
      </p>


      <p class="vehiculo-descripcion">
        ${vehiculo.descripcion || ""}
      </p>


      <div class="vehiculo-precio">

        <small>
          Desde
        </small>

        <strong>
          ${formatoMoneda(vehiculo.precio)}
        </strong>

      </div>


      <button
        class="btn-principal btn-ancho"
        onclick="abrirVehiculo('${vehiculo.id}')"
      >
        Ver vehículo
      </button>

    </div>

  `;


  const imagen =
    tarjeta.querySelector(".vehiculo-imagen");


  if (imagen) {

    imagen.onerror = function () {

      this.style.display = "none";

    };

  }


  return tarjeta;

}


/* =========================================================
   DETALLE DEL VEHÍCULO
========================================================= */

function abrirVehiculo(id) {

  const vehiculo =
    obtenerVehiculo(id);


  if (!vehiculo) return;


  vehiculoActual =
    vehiculo;


  registrarInteraccion(
    "vehiculo",
    vehiculo
  );


  const modal =
    document.getElementById("modalVehiculo");


  const imagen =
    document.getElementById("detalleImagen");

  const marca =
    document.getElementById("detalleMarca");

  const modelo =
    document.getElementById("detalleModelo");

  const version =
    document.getElementById("detalleVersion");

  const precio =
    document.getElementById("detallePrecio");

  const caracteristicas =
    document.getElementById(
      "detalleCaracteristicas"
    );


  if (imagen) {

    imagen.src =
      vehiculo.imagen;

    imagen.alt =
      vehiculo.marca +
      " " +
      vehiculo.modelo;

    imagen.onerror = function () {

      this.style.display = "none";

    };

  }


  if (marca) {

    marca.textContent =
      vehiculo.marca;

  }


  if (modelo) {

    modelo.textContent =
      vehiculo.modelo;

  }


  if (version) {

    version.textContent =
      vehiculo.version;

  }


  if (precio) {

    precio.textContent =
      formatoMoneda(
        vehiculo.precio
      );

  }


  if (caracteristicas) {

    caracteristicas.innerHTML = "";


    if (
      vehiculo.caracteristicas &&
      vehiculo.caracteristicas.length
    ) {

      vehiculo.caracteristicas.forEach(
        function (caracteristica) {

          const elemento =
            document.createElement("div");


          elemento.className =
            "caracteristica";


          elemento.textContent =
            "✓ " + caracteristica;


          caracteristicas.appendChild(
            elemento
          );

        }
      );

    }

  }


  if (modal) {

    modal.classList.add("activo");

  }

}


/* =========================================================
   CERRAR MODALES
========================================================= */

function cerrarModal(id) {

  const modal =
    document.getElementById(id);


  if (modal) {

    modal.classList.remove("activo");

  }

}


/* =========================================================
   COTIZADOR
========================================================= */

function cargarSelectores() {

  const selector =
    document.getElementById(
      "cotizadorModelo"
    );


  const selectorPrueba =
    document.getElementById(
      "pruebaModelo"
    );


  const vehiculos =
    obtenerVehiculosDisponibles();


  if (selector) {

    selector.innerHTML = "";


    vehiculos.forEach(
      function (vehiculo) {

        const opcion =
          document.createElement("option");


        opcion.value =
          vehiculo.id;


        opcion.textContent =
          vehiculo.marca +
          " " +
          vehiculo.modelo;


        selector.appendChild(
          opcion
        );

      }
    );

  }


  if (selectorPrueba) {

    selectorPrueba.innerHTML = "";


    vehiculos.forEach(
      function (vehiculo) {

        const opcion =
          document.createElement("option");


        opcion.value =
          vehiculo.id;


        opcion.textContent =
          vehiculo.marca +
          " " +
          vehiculo.modelo;


        selectorPrueba.appendChild(
          opcion
        );

      }
    );

  }


  if (
    vehiculos.length > 0 &&
    selector
  ) {

    selector.value =
      vehiculos[0].id;

  }

}


/* =========================================================
   CALCULAR MENSUALIDAD
========================================================= */

function calcularMensualidad() {

  const selector =
    document.getElementById(
      "cotizadorModelo"
    );


  const engancheInput =
    document.getElementById(
      "cotizadorEnganche"
    );


  const plazoInput =
    document.getElementById(
      "cotizadorPlazo"
    );


  const resultado =
    document.getElementById(
      "mensualidad"
    );


  if (
    !selector ||
    !engancheInput ||
    !plazoInput ||
    !resultado
  ) {

    return;

  }


  const vehiculo =
    obtenerVehiculo(
      selector.value
    );


  if (!vehiculo) {

    resultado.textContent =
      "$0";

    return;

  }


  let enganche =
    Number(
      engancheInput.value
    );


  const plazo =
    Number(
      plazoInput.value
    );


  const precio =
    Number(
      vehiculo.precio
    );


  if (isNaN(enganche)) {

    enganche = 0;

  }


  if (enganche < 0) {

    enganche = 0;

  }


  if (enganche > precio) {

    enganche = precio;

  }


  const montoFinanciado =
    precio - enganche;


  const tasaAnual =
    Number(
      CONFIG.cotizador.tasaAnual
    ) || 0;


  const tasaMensual =
    tasaAnual / 100 / 12;


  let mensualidad = 0;


  if (
    tasaMensual > 0 &&
    montoFinanciado > 0
  ) {

    mensualidad =
      montoFinanciado *
      (
        tasaMensual *
        Math.pow(
          1 + tasaMensual,
          plazo
        )
      ) /
      (
        Math.pow(
          1 + tasaMensual,
          plazo
        ) - 1
      );

  } else if (
    montoFinanciado > 0
  ) {

    mensualidad =
      montoFinanciado /
      plazo;

  }


  resultado.textContent =
    formatoMoneda(
      Math.round(
        mensualidad
      )
    );

}


/* =========================================================
   IR AL COTIZADOR
========================================================= */

function abrirCotizador() {

  const seccion =
    document.getElementById(
      "cotizador"
    );


  if (seccion) {

    seccion.scrollIntoView({

      behavior: "smooth"

    });

  }

}


/* =========================================================
   COTIZAR VEHÍCULO ACTUAL
========================================================= */

function cotizarVehiculoActual() {

  if (!vehiculoActual) return;


  const selector =
    document.getElementById(
      "cotizadorModelo"
    );


  if (selector) {

    selector.value =
      vehiculoActual.id;

  }


  cerrarModal(
    "modalVehiculo"
  );


  abrirCotizador();


  calcularMensualidad();

}


/* =========================================================
   BOTÓN "ME INTERESA ESTA COTIZACIÓN"
========================================================= */

function enviarCotizacion() {

  const selector =
    document.getElementById(
      "cotizadorModelo"
    );


  const engancheInput =
    document.getElementById(
      "cotizadorEnganche"
    );


  const plazoInput =
    document.getElementById(
      "cotizadorPlazo"
    );


  if (!selector) return;


  const vehiculo =
    obtenerVehiculo(
      selector.value
    );


  if (!vehiculo) return;


  const enganche =
    Number(
      engancheInput.value
    ) || 0;


  const plazo =
    Number(
      plazoInput.value
    ) || 0;


  registrarInteraccion(

    "cotizacion",

    {

      vehiculo: vehiculo,

      enganche: enganche,

      plazo: plazo

    }

  );


  abrirContacto();

}


/* =========================================================
   CONTACTO
========================================================= */

function abrirContacto() {

  const modal =
    document.getElementById(
      "modalContacto"
    );


  if (modal) {

    modal.classList.add("activo");

  }

}


/* =========================================================
   WHATSAPP
========================================================= */

function contactarWhatsApp() {

  const telefono =
    CONFIG.vendedor.whatsapp ||
    CONFIG.agencia.whatsapp;


  if (!telefono) return;


  let mensaje =
    "Hola, me interesa conocer los vehículos disponibles.";


  if (vehiculoActual) {

    mensaje =
      "Hola, me interesa el " +
      vehiculoActual.marca +
      " " +
      vehiculoActual.modelo +
      ".";

  }


  const url =
    "https://wa.me/" +
    telefono +
    "?text=" +
    encodeURIComponent(
      mensaje
    );


  registrarInteraccion(
    "whatsapp",
    vehiculoActual
  );


  window.open(
    url,
    "_blank"
  );

}


/* =========================================================
   WHATSAPP DESDE VEHÍCULO
========================================================= */

function contactarVehiculo() {

  contactarWhatsApp();

}


/* =========================================================
   LLAMAR AL VENDEDOR
========================================================= */

function llamarVendedor() {

  const telefono =
    CONFIG.vendedor.telefono ||
    CONFIG.agencia.telefono;


  if (!telefono) return;


  registrarInteraccion(
    "llamada",
    vehiculoActual
  );


  window.location.href =
    "tel:" + telefono;

}


/* =========================================================
   PRUEBA DE MANEJO
========================================================= */

function abrirPruebaManejo() {

  const modal =
    document.getElementById(
      "modalPrueba"
    );


  const selector =
    document.getElementById(
      "pruebaModelo"
    );


  if (
    selector &&
    vehiculoActual
  ) {

    selector.value =
      vehiculoActual.id;

  }


  if (modal) {

    modal.classList.add("activo");

  }

}


/* =========================================================
   SOLICITAR PRUEBA
========================================================= */

function solicitarPrueba() {

  const nombre =
    document.getElementById(
      "nombrePrueba"
    );


  const telefono =
    document.getElementById(
      "telefonoPrueba"
    );


  const selector =
    document.getElementById(
      "pruebaModelo"
    );


  if (
    !nombre ||
    !telefono ||
    !selector
  ) {

    return;

  }


  const nombreValor =
    nombre.value.trim();


  const telefonoValor =
    telefono.value.trim();


  if (!nombreValor) {

    alert(
      "Por favor escribe tu nombre."
    );

    nombre.focus();

    return;

  }


  if (!telefonoValor) {

    alert(
      "Por favor escribe tu teléfono."
    );

    telefono.focus();

    return;

  }


  const vehiculo =
    obtenerVehiculo(
      selector.value
    );


  registrarInteraccion(

    "prueba_manejo",

    {

      nombre:
        nombreValor,

      telefono:
        telefonoValor,

      vehiculo:
        vehiculo

    }

  );


  const numero =
    CONFIG.vendedor.whatsapp ||
    CONFIG.agencia.whatsapp;


  let mensaje =
    "Hola, quiero solicitar una prueba de manejo.";

  
  mensaje +=
    "\nNombre: " +
    nombreValor;


  mensaje +=
    "\nTeléfono: " +
    telefonoValor;


  if (vehiculo) {

    mensaje +=
      "\nVehículo: " +
      vehiculo.marca +
      " " +
      vehiculo.modelo;

  }


  if (numero) {

    const url =
      "https://wa.me/" +
      numero +
      "?text=" +
      encodeURIComponent(
        mensaje
      );


    window.open(
      url,
      "_blank"
    );

  }


  cerrarModal(
    "modalPrueba"
  );

}


/* =========================================================
   MENÚ MÓVIL
========================================================= */

function abrirMenu() {

  const menu =
    document.getElementById(
      "menuPublico"
    );


  if (!menu) return;


  menu.classList.toggle(
    "menu-abierto"
  );

}


/* =========================================================
   IR A MODELOS
========================================================= */

function irAModelos() {

  const modelos =
    document.getElementById(
      "modelos"
    );


  if (modelos) {

    modelos.scrollIntoView({

      behavior: "smooth"

    });

  }

}


/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {

  const buscador =
    document.getElementById(
      "buscarModelo"
    );


  if (buscador) {

    buscador.addEventListener(
      "input",
      function () {

        cargarCatalogo();

      }
    );

  }


  const filtro =
    document.getElementById(
      "filtroCategoria"
    );


  if (filtro) {

    filtro.addEventListener(
      "change",
      function () {

        categoriaActual =
          this.value;

        actualizarPestanas();

        cargarCatalogo();

      }
    );

  }


  const pestanas =
    document.querySelectorAll(
      ".pestana"
    );


  pestanas.forEach(
    function (pestana) {

      pestana.addEventListener(
        "click",
        function () {

          categoriaActual =
            this.dataset.categoria || "";


          const filtro =
            document.getElementById(
              "filtroCategoria"
            );


          if (filtro) {

            filtro.value =
              categoriaActual;

          }


          actualizarPestanas();

          cargarCatalogo();

        }
      );

    }
  );


  const cotizadorModelo =
    document.getElementById(
      "cotizadorModelo"
    );


  const cotizadorEnganche =
    document.getElementById(
      "cotizadorEnganche"
    );


  const cotizadorPlazo =
    document.getElementById(
      "cotizadorPlazo"
    );


  if (cotizadorModelo) {

    cotizadorModelo.addEventListener(
      "change",
      calcularMensualidad
    );

  }


  if (cotizadorEnganche) {

    cotizadorEnganche.addEventListener(
      "input",
      calcularMensualidad
    );

  }


  if (cotizadorPlazo) {

    cotizadorPlazo.addEventListener(
      "change",
      calcularMensualidad
    );

  }


  /* CERRAR MODALES TOCANDO EL FONDO */

  document.querySelectorAll(
    ".modal"
  ).forEach(
    function (modal) {

      modal.addEventListener(
        "click",
        function (evento) {

          if (
            evento.target === modal
          ) {

            modal.classList.remove(
              "activo"
            );

          }

        }
      );

    }
  );

}


/* =========================================================
   ACTUALIZAR PESTAÑAS
========================================================= */

function actualizarPestanas() {

  const pestanas =
    document.querySelectorAll(
      ".pestana"
    );


  pestanas.forEach(
    function (pestana) {

      const categoria =
        pestana.dataset.categoria || "";


      pestana.classList.toggle(

        "activa",

        categoria === categoriaActual

      );

    }
  );

}


/* =========================================================
   REGISTRO BÁSICO DE INTERACCIONES
=========================================================

   IMPORTANTE:

   Esto es temporal.

   Más adelante esta función enviará los datos
   directamente a Firebase.

   Así podremos mostrar en el panel del vendedor:

   - Visitas
   - Modelos vistos
   - Cotizaciones
   - Enganches
   - WhatsApp
   - Pruebas de manejo
   - Llamadas

========================================================= */

function registrarInteraccion(
  tipo,
  datos
) {

  try {

    const registros =
      JSON.parse(
        localStorage.getItem(
          "interaccionesVendedoresAutos"
        )
      ) || [];


    registros.push({

      tipo:
        tipo,

      fecha:
        new Date().toISOString(),

      datos:
        datos || null

    });


    localStorage.setItem(

      "interaccionesVendedoresAutos",

      JSON.stringify(
        registros
      )

    );

  } catch (error) {

    console.log(
      "No se pudo registrar la interacción."
    );

  }

}


/* =========================================================
   REGISTRAR VISITA
========================================================= */

registrarInteraccion(
  "visita",
  {
    pagina: "publica"
  }
);
