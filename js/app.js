const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
  e.preventDefault();

  const terminoBusqueda = document.querySelector("#termino").value;
  if (terminoBusqueda === "") {
    mostrarAlerta("Campos incompletos");
    return;
  }

  buscarImagenes();
}

function mostrarAlerta(mensaje) {
  const existeAlerta = document.querySelector(".error-alerta");
  if (!existeAlerta) {
    const alerta = document.createElement("p");
    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center",
      "error-alerta"
    );
    alerta.innerHTML = `
    <strong class="font-bold">¡Error!</strong>
    <span class="block sm:inline">${mensaje}</span>
  `;

    formulario.appendChild(alerta);
    setTimeout(() => {
      alerta.remove();
    }, 2500);
  }
}

function buscarImagenes() {
  const busqueda = document.querySelector("#termino").value;
  const key = "24218269-6e32802e37d8ef847c1b42cc8";
  const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&image_type=photo&per_page=${registrosPorPagina}&page=${paginaActual}`;
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      totalPaginas = calcularPaginas(datos.totalHits);
      mostrarImagenes(datos.hits);
    });
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(listaImagenes) {
  limpiarHTML();

  if (listaImagenes.length === 0) {
    mostrarAlerta("No hay coincidencias con tu búsqueda");
    return;
  }

  //Iterar sobre el arreglo de imagenes
  listaImagenes.forEach((datosImagen) => {
    const { previewURL, likes, views, largeImageURL } = datosImagen;

    resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}" />
                <div class="p-4">
                    <p class="font-bold">${likes} <span class="font-light">likes</span></p>
                    <p class="font-bold">${views} <span class="font-light">views</span></p>
                    <a 
                        href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                        class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                    >
                        Ver Imagen
                    </a>
                </div>
            </div>
        </div>
        `;
  });
  limpiarPaginador();
  imprimirPaginador();
}

//Generador que va registar la cantidad de elementos de acuredo a las paginas
function* crearPaginador(totalPaginas) {
  for (let i = 1; i <= totalPaginas; i++) {
    yield i;
  }
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);
  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    const boton = document.createElement("a");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-5",
      "uppercase",
      "rounded"
    );
    boton.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    };
    paginacionDiv.appendChild(boton);
  }
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function limpiarPaginador() {
  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild);
  }
}
