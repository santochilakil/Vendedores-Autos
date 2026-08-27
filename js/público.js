/* =====================================================
   VARIABLES
===================================================== */

let vehiculoActual = null;

let categoriaActual = "";


/* =====================================================
   INICIO
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    cargarConfiguracion();

    cargarPromocion();

    mostrarVehiculos();

    cargarSelects();

    calcularMensualidad();

    configurarEventos();

  }
);


/* =====================================================
   CONFIGURACIÓN
===================================================== */

function cargarConfiguracion() {

  document.getElementById(
    "nombreAgencia"
  ).textContent =
    CONFIG.agencia;


  document.getElementById(
    "nombreVendedor"
  ).textContent =
    CONFIG.vendedor;


  document.getElementById(
    "footerAgencia"
  ).textContent =
    CONFIG.agencia;


  document.getElementById(
    "footerVendedor"
  ).textContent =
    CONFIG.vendedor;


  document.getElementById(
    "logoAgencia"
  ).src =
    CONFIG.logo;


  document.getElementById(
    "logoFooter"
  ).src =
    CONFIG.logo;

}


/* =====================================================
   PROMOCIÓN
===================================================== */

function cargarPromocion() {

  if (!PROMOCION.activa) {

    document.getElementById(
      "promocion"
    ).style.display = "none";

    return;

  }


  document.getElementById(
    "promocionTitulo"
  ).textContent =
    PROMOCION.titulo;


  document.getElementById(
    "promocionDescripcion"
  ).textContent =
    PROMOCION.descripcion;


  document.getElementById(
    "promocionBono"
  ).textContent =
    formatoPrecio(
      PROMOCION.bono
    );


  document.getElementById(
    "promocionDescuento"
  ).textContent =
    formatoPrecio(
      PROMOCION.descuento
    );


  document.getElementById(
    "imagenPromocion"
  ).src =
    PROMOCION.imagen;

}


/* =====================================================
   MOSTRAR VEHÍCULOS
===================================================== */

function mostrarVehiculos() {

  const contenedor =
    document.getElementById(
      "catalogo"
    );


  const busqueda =
    document.getElementById(
      "buscarModelo"
    ).value
      .toLowerCase()
      .trim();


  const filtrados =
    VEHICULOS.filter(
      vehiculo => {

        const coincideCategoria =
          !categoriaActual ||
          vehiculo.categoria === categoriaActual;


        const texto =
          `${vehiculo.marca} ${vehiculo.modelo}`
            .toLowerCase();


        const coincideBusqueda =
          !busqueda ||
          texto.includes(busqueda);


        return (
          coincideCategoria &&
          coincideBusqueda
        );

      }
    );


  contenedor.innerHTML = "";


  if (!filtrados.length) {

    contenedor.innerHTML = `

      <div class="sin-resultados">

        <h3>
          No encontramos vehículos
        </h3>

        <p>
          Intenta con otra búsqueda.
        </p>

      </div>

    `;

    return;

  }


  filtrados.forEach(
    vehiculo => {

      const tarjeta =
        document.createElement(
          "article"
        );


      tarjeta.className =
        "vehiculo-card";


      tarjeta.innerHTML = `

        <div class="vehiculo-imagen">

          <img
            src="${vehiculo.imagen}"
            alt="${vehiculo.marca} ${vehiculo.modelo}"
            onerror="this.style.display='none'"
          >

          <div class="imagen-placeholder">
            🚗
          </div>

        </div>


        <div class="vehiculo-info">

          <span class="marca">
            ${vehiculo.marca}
          </span>


          <h3>
            ${vehiculo.modelo}
          </h3>


          <p class="version">
            ${vehiculo.version}
          </p>


          <div class="precio">

            <small>
              Desde
            </small>

            ${formatoPrecio(
              vehiculo.precio
            )}

          </div>


          <div class="card-botones">

            <button
              class="btn-secundario-card"
              onclick="
                verVehiculo('${vehiculo.id}')
              "
            >
              Ver vehículo
            </button>


            <button
              class="btn-principal-card"
              onclick="
                abrirCotizadorVehiculo(
                  '${vehiculo.id}'
                )
              "
            >
              Cotizar
            </button>

          </div>

        </div>

      `;


      contenedor.appendChild(
        tarjeta
      );

    }
  );

}


/* =====================================================
   VER VEHÍCULO
===================================================== */

function verVehiculo(id) {

  const vehiculo =
    VEHICULOS.find(
      item => item.id === id
    );


  if (!vehiculo) return;


  vehiculoActual =
    vehiculo;


  registrarInteraccion(
    "vista_vehiculo",
    vehiculo
  );


  document.getElementById(
    "detalleImagen"
  ).src =
    vehiculo.imagen;


  document.getElementById(
    "detalleMarca"
  ).textContent =
    vehiculo.marca;


  document.getElementById(
    "detalleModelo"
  ).textContent =
    vehiculo.modelo;


  document.getElementById(
    "detalleVersion"
  ).textContent =
    vehiculo.version;


  document.getElementById(
    "detallePrecio"
  ).textContent =
    formatoPrecio(
      vehiculo.precio
    );


  const caracteristicas =
    document.getElementById(
      "detalleCaracteristicas"
    );


  caracteristicas.innerHTML = `

    <div>
      <small>Motor</small>
      <strong>
        ${vehiculo.caracteristicas.motor}
      </strong>
    </div>

    <div>
      <small>Transmisión</small>
      <strong>
        ${vehiculo.caracteristicas.transmision}
      </strong>
    </div>

    <div>
      <small>Pasajeros</small>
      <strong>
        ${vehiculo.caracteristicas.pasajeros}
      </strong>
    </div>

    <div>
      <small>Combustible</small>
      <strong>
        ${vehiculo.caracteristicas.combustible}
      </strong>
    </div>

  `;


  abrirModal(
    "modalVehiculo"
  );

}


/* =====================================================
   SELECTS
===================================================== */

function cargarSelects() {

  const cotizador =
    document.getElementById(
      "cotizadorModelo"
    );


  const prueba =
    document.getElementById(
      "pruebaModelo"
    );


  VEHICULOS.forEach(
    vehiculo => {

      const opcion1 =
        document.createElement(
          "option"
        );


      opcion1.value =
        vehiculo.id;


      opcion1.textContent =
        `${vehiculo.marca} ${vehiculo.modelo}`;


      cotizador.appendChild(
        opcion1
      );


      const opcion2 =
        opcion1.cloneNode(true);


      prueba.appendChild(
        opcion2
      );

    }
  );

}


/* =====================================================
   COTIZADOR
===================================================== */

function calcularMensualidad() {

  const id =
    document.getElementById(
      "cotizadorModelo"
    ).value;


  const vehiculo =
    VEHICULOS.find(
      item => item.id === id
    );


  if (!vehiculo) return;


  const enganche =
    Number(
      document.getElementById(
        "cotizadorEnganche"
      ).value
    ) || 0;


  const plazo =
    Number(
      document.getElementById(
        "cotizadorPlazo"
      ).value
    );


  const tasaAnual =
    12.9;


  const monto =
    Math.max(
      vehiculo.precio -
      enganche,
      0
    );


  const tasaMensual =
    tasaAnual /
    100 /
    12;


  let mensualidad;


  if (
    monto <= 0
  ) {

    mensualidad = 0;

  } else {

    mensualidad =
      monto *
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

  }


  document.getElementById(
    "mensualidad"
  ).textContent =
    formatoPrecio(
      Math.round(
        mensualidad
      )
    );

}


/* =====================================================
   ABRIR COTIZADOR
===================================================== */

function abrirCotizador() {

  document.getElementById(
    "cotizador"
  ).scrollIntoView({
    behavior: "smooth"
  });

}


function abrirCotizadorVehiculo(id) {

  document.getElementById(
    "cotizadorModelo"
  ).value = id;


  calcularMensualidad();


  document.getElementById(
    "cotizador"
  ).scrollIntoView({
    behavior: "smooth"
  });


  registrarInteraccion(
    "inicio_cotizacion",
    VEHICULOS.find(
      item => item.id === id
    )
  );

}


/* =====================================================
   COTIZAR VEHÍCULO ACTUAL
===================================================== */

function cotizarVehiculoActual() {

  if (!vehiculoActual) return;


  cerrarModal(
    "modalVehiculo"
  );


  abrirCotizadorVehiculo(
    vehiculoActual.id
  );

}


/* =====================================================
   WHATSAPP
===================================================== */

function contactarWhatsApp() {

  registrarInteraccion(
    "click_whatsapp"
  );


  const mensaje =
    `Hola ${CONFIG.vendedor}, vi su página de vehículos y me gustaría recibir información.`;


  abrirWhatsApp(
    mensaje
  );

}


function contactarVehiculo() {

  if (!vehiculoActual) return;


  registrarInteraccion(
    "whatsapp_vehiculo",
    vehiculoActual
  );


  const mensaje =
    `Hola ${CONFIG.vendedor}, me interesa el ${vehiculoActual.marca} ${vehiculoActual.modelo} ${vehiculoActual.version}.`;


  abrirWhatsApp(
    mensaje
  );

}


function enviarCotizacion() {

  const id =
    document.getElementById(
      "cotizadorModelo"
    ).value;


  const vehiculo =
    VEHICULOS.find(
      item => item.id === id
    );


  const enganche =
    Number(
      document.getElementById(
        "cotizadorEnganche"
      ).value
    ) || 0;


  const plazo =
    document.getElementById(
      "cotizadorPlazo"
    ).value;


  const mensualidad =
    document.getElementById(
      "mensualidad"
    ).textContent;


  registrarInteraccion(
    "cotizacion_whatsapp",
    vehiculo,
    {
      enganche,
      plazo,
      mensualidad
    }
  );


  const mensaje =
    `Hola ${CONFIG.vendedor}.

Me interesa el ${vehiculo.marca} ${vehiculo.modelo}.

Precio:
${formatoPrecio(vehiculo.precio)}

Enganche:
${formatoPrecio(enganche)}

Plazo:
${plazo} meses

Mensualidad aproximada:
${mensualidad}

Me gustaría recibir más información.`;


  abrirWhatsApp(
    mensaje
  );

}


function abrirWhatsApp(
  mensaje
) {

  const url =
    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;


  window.open(
    url,
    "_blank"
  );

}


/* =====================================================
   PRUEBA DE MANEJO
===================================================== */

function abrirPruebaManejo() {

  cerrarModal(
    "modalVehiculo"
  );


  abrirModal(
    "modalPrueba"
  );


  if (vehiculoActual) {

    document.getElementById(
      "pruebaModelo"
    ).value =
      vehiculoActual.id;

  }

}


function solicitarPrueba() {

  const nombre =
    document.getElementById(
      "nombrePrueba"
    ).value.trim();


  const telefono =
    document.getElementById(
      "telefonoPrueba"
    ).value.trim();


  const id =
    document.getElementById(
      "pruebaModelo"
    ).value;


  const vehiculo =
    VEHICULOS.find(
      item => item.id === id
    );


  if (
    !nombre ||
    !telefono
  ) {

    alert(
      "Completa tu nombre y teléfono para solicitar la prueba."
    );

    return;

  }


  registrarInteraccion(
    "solicitud_prueba",
    vehiculo,
    {
      nombre,
      telefono
    }
  );


  const mensaje =
    `Hola ${CONFIG.vendedor}.

Quiero solicitar una prueba de manejo.

Nombre:
${nombre}

Teléfono:
${telefono}

Vehículo:
${vehiculo.marca} ${vehiculo.modelo}`;


  abrirWhatsApp(
    mensaje
  );

}


/* =====================================================
   LLAMADA
===================================================== */

function llamarVendedor() {

  registrarInteraccion(
    "click_llamada"
  );


  window.location.href =
    `tel:+${CONFIG.telefono}`;

}


/* =====================================================
   CONTACTO
===================================================== */

function abrirContacto() {

  abrirModal(
    "modalContacto"
  );

}


/* =====================================================
   MENÚ
===================================================== */

function abrirMenu() {

  const menu =
    document.getElementById(
      "menuPublico"
    );


  menu.classList.toggle(
    "menu-abierto"
  );

}


/* =====================================================
   MODALES
===================================================== */

function abrirModal(id) {

  document
    .getElementById(id)
    .classList.add(
      "activo"
    );


  document.body.style.overflow =
    "hidden";

}


function cerrarModal(id) {

  document
    .getElementById(id)
    .classList.remove(
      "activo"
    );


  document.body.style.overflow =
    "";

}


/* =====================================================
   EVENTOS
===================================================== */

function configurarEventos() {

  document.getElementById(
    "buscarModelo"
  ).addEventListener(
    "input",
    mostrarVehiculos
  );


  document.getElementById(
    "filtroCategoria"
  ).addEventListener(
    "change",
    function() {

      categoriaActual =
        this.value;

      actualizarPestanas();

      mostrarVehiculos();

    }
  );


  document.getElementById(
    "cotizadorModelo"
  ).addEventListener(
    "change",
    calcularMensualidad
  );


  document.getElementById(
    "cotizadorEnganche"
  ).addEventListener(
    "input",
    calcularMensualidad
  );


  document.getElementById(
    "cotizadorPlazo"
  ).addEventListener(
    "change",
    calcularMensualidad
  );


  document
    .querySelectorAll(
      ".pestana"
    )
    .forEach(
      boton => {

        boton.addEventListener(
          "click",
          function() {

            categoriaActual =
              this.dataset.categoria;


            actualizarPestanas();

            document.getElementById(
              "filtroCategoria"
            ).value =
              categoriaActual;


            mostrarVehiculos();

          }
        );

      }
    );

}


/* =====================================================
   PESTAÑAS
===================================================== */

function actualizarPestanas() {

  document
    .querySelectorAll(
      ".pestana"
    )
    .forEach(
      boton => {

        boton.classList.toggle(
          "activa",
          boton.dataset.categoria ===
            categoriaActual
        );

      }
    );

}


/* =====================================================
   SCROLL MODELOS
===================================================== */

function irAModelos() {

  document.getElementById(
    "modelos"
  ).scrollIntoView({
    behavior: "smooth"
  });

}


/* =====================================================
   FORMATO
===================================================== */

function formatoPrecio(
  numero
) {

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0
    }
  ).format(numero);

}


/* =====================================================
   REGISTRO DE INTERACCIONES

   POR AHORA DEMO.
   DESPUÉS → FIREBASE.

   El cliente NO necesita registrarse.
===================================================== */

function registrarInteraccion(
  tipo,
  vehiculo = null,
  datos = {}
) {

  const registro = {

    tipo,

    vehiculo:
      vehiculo
        ? vehiculo.id
        : null,

    datos,

    fecha:
      new Date().toISOString()

  };


  const historial =
    JSON.parse(
      localStorage.getItem(
        "interaccionesDemo"
      ) || "[]"
    );


  historial.push(
    registro
  );


  localStorage.setItem(
    "interaccionesDemo",
    JSON.stringify(
      historial
    )
  );

}
