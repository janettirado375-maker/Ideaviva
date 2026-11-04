/* ==========================================
   IDEA VIVA — SISTEMA PRINCIPAL
   ========================================== */


/* 1. BÚSQUEDA */

function buscar() {
  const campo = document.getElementById("busqueda");
  const resultado = document.getElementById("resultado");

  if (!campo || !resultado) return;

  const consulta = campo.value.trim();

  resultado.replaceChildren();

  if (!consulta) {
    resultado.textContent = "Escribe una pregunta para comenzar.";
    return;
  }

  const titulo = document.createElement("h3");
  titulo.textContent = "IDEA VIVA está lista para ayudarte";

  const pregunta = document.createElement("p");
  pregunta.textContent = "Tu consulta: " + consulta;

  const aviso = document.createElement("p");
  aviso.textContent =
    "Pronto conectaremos nuestro motor de inteligencia artificial.";

  resultado.append(titulo, pregunta, aviso);
}


/* 2. HERRAMIENTAS */

function abrirHerramienta(nombre) {
  const panel = document.getElementById("panel-herramienta");

  if (!panel) return;

  const herramientas = {
    investigacion: {
      titulo: "🔎 Investigación",
      texto: "Investiga y descubre información."
    },
    ia: {
      titulo: "🧠 IA inteligente",
      texto: "Prepara tus preguntas para conversar con IA."
    },
    creatividad: {
      titulo: "🎨 Creatividad",
      texto: "Prepara tus ideas para crear imágenes."
    },
    videos: {
      titulo: "🎬 Vídeos",
      texto: "Organiza tus ideas para producir vídeos."
    },
    aprendizaje: {
      titulo: "📚 Aprendizaje",
      texto: "Aprende y practica nuevos conocimientos."
    },
    proyectos: {
      titulo: "💡 Proyectos",
      texto: "Organiza y desarrolla tus proyectos."
    }
  };

  const herramienta = herramientas[nombre];

  if (!herramienta) return;

  panel.replaceChildren();

  const titulo = document.createElement("h2");
  titulo.textContent = herramienta.titulo;

  const texto = document.createElement("p");
  texto.textContent = herramienta.texto;

  const boton = document.createElement("button");
  boton.textContent = "Volver";
  boton.onclick = cerrarHerramienta;

  panel.append(titulo, texto, boton);
  panel.style.display = "block";
  panel.scrollIntoView({ behavior: "smooth" });
}

function cerrarHerramienta() {
  const panel = document.getElementById("panel-herramienta");
  if (panel) panel.style.display = "none";
}


/* 3. NAVEGACIÓN */

function mostrar(id, boton) {
  const destino = document.getElementById(id);

  if (!destino) {
    console.warn("No existe el módulo:", id);
    return;
  }

  document.querySelectorAll(".workspace").forEach(seccion => {
    seccion.classList.add("hidden");
  });

  destino.classList.remove("hidden");

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  const botonActivo = boton || document.querySelector(
    `.nav-item[onclick*="'${id}'"]`
  );

  if (botonActivo) {
    botonActivo.classList.add("active");
  }

  if (id === "proyectos") {
    cargarProyectos();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* 4. CONEXIÓN CON SUPABASE */

const SUPABASE_URL =
  "https://wozyeqmxetrxwvuidtqw.supabase.co";

// Conserva aquí tu clave pública publishable actual.
const SUPABASE_ANON_KEY =
  "sb_publishable_np6F63W601c3VF0iHq9YrA_89S8bo7j";

if (!window.supabase) {
  throw new Error(
    "No se pudo cargar Supabase. Comprueba tu conexión."
  );
}

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


/* 5. COMPROBAR CONEXIÓN */

async function probarConexion() {
  const { error } = await supabaseClient
    .from("proyectos")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Error al consultar Supabase:", error.message);
    return false;
  }

  console.log("Consulta a Supabase realizada correctamente.");
  return true;
}


/* 6. REGISTRO DE USUARIOS */

async function registrarUsuario() {
  const nombre = document.getElementById("nombre-usuario").value.trim();
  const correo = document.getElementById("correo-usuario").value.trim();
  const clave = document.getElementById("clave-usuario").value;
  const mensaje = document.getElementById("mensaje-acceso");

  if (!nombre || !correo || !clave) {
    mensaje.textContent = "Completa todos los campos.";
    return;
  }

  if (clave.length < 8) {
    mensaje.textContent =
      "La contraseña debe tener al menos 8 caracteres.";
    return;
  }

  mensaje.textContent = "Creando tu cuenta...";

  const { error } = await supabaseClient.auth.signUp({
    email: correo,
    password: clave,
    options: {
      emailRedirectTo:
        "https://janettirado375-maker.github.io/Ideaviva/",
      data: {
        nombre: nombre
      }
    }
  });

  if (error) {
    mensaje.textContent = error.message;
    return;
  }

  mensaje.textContent =
    "Cuenta creada. Revisa tu correo para confirmar el registro.";
}


/* 7. INICIAR SESIÓN */

async function iniciarSesion() {
  const correo = document.getElementById("correo-usuario").value.trim();
  const clave = document.getElementById("clave-usuario").value;
  const mensaje = document.getElementById("mensaje-acceso");

  if (!correo || !clave) {
    mensaje.textContent = "Escribe tu correo y contraseña.";
    return;
  }

  mensaje.textContent = "Iniciando sesión...";

  const { error } = await supabaseClient.auth.signInWithPassword({
    email: correo,
    password: clave
  });

  if (error) {
    mensaje.textContent = error.message;
    return;
  }

  document.getElementById("pantalla-acceso").style.display = "none";

  mostrar("inicio");
  mensaje.textContent = "";
}


/* 8. COMPROBAR SESIÓN */

async function comprobarSesion() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error("Error al comprobar sesión:", error.message);
    return;
  }

  if (data.session) {
    document.getElementById("pantalla-acceso").style.display = "none";
    mostrar("inicio");
  } else {
    document.getElementById("pantalla-acceso").style.display = "flex";
  }
}


/* 9. CERRAR SESIÓN */

async function cerrarSesionUsuario() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("No se pudo cerrar la sesión.");
    return;
  }

  document.getElementById("pantalla-acceso").style.display = "flex";
  mostrar("inicio");
}


/* 10. GUARDAR PROYECTOS */

async function guardarProyecto(nombre, contenido) {
  nombre = nombre.trim();
  contenido = contenido.trim();

  if (!nombre || !contenido) {
    alert("Escribe el nombre y el contenido del proyecto.");
    return;
  }

  const { data: sesion } = await supabaseClient.auth.getSession();
  const usuario = sesion.session?.user;

  if (!usuario) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  const { error } = await supabaseClient
    .from("proyectos")
    .insert([{
      usuario_id: usuario.id,
      nombre: nombre,
      contenido: contenido
    }]);

  if (error) {
    console.error("Error al guardar:", error.message);
    alert("No se pudo guardar el proyecto.");
    return;
  }

  alert("¡Proyecto guardado correctamente!");

  document.getElementById("nombre-proyecto").value = "";
  document.getElementById("contenido-proyecto").value = "";

  await cargarProyectos();
}


/* 11. MOSTRAR PROYECTOS */

async function cargarProyectos() {
  const lista = document.getElementById("lista-proyectos");

  if (!lista) return;

  const { data: sesion } = await supabaseClient.auth.getSession();
  const usuario = sesion.session?.user;

  if (!usuario) {
    lista.textContent = "Inicia sesión para ver tus proyectos.";
    return;
  }

  lista.textContent = "Cargando tus proyectos...";

  const { data, error } = await supabaseClient
    .from("proyectos")
    .select("id, nombre, contenido, creado_en")
    .eq("usuario_id", usuario.id)
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error al cargar proyectos:", error.message);
    lista.textContent = "No se pudieron cargar tus proyectos.";
    return;
  }

  lista.replaceChildren();

  if (!data || data.length === 0) {
    lista.textContent = "Todavía no tienes proyectos guardados.";
    return;
  }

  data.forEach(proyecto => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-proyecto";

    const titulo = document.createElement("h3");
    titulo.textContent = proyecto.nombre;

    const texto = document.createElement("p");
    texto.textContent = proyecto.contenido;

    tarjeta.append(titulo, texto);
    lista.appendChild(tarjeta);
  });
}

/* 12. INICIAR SISTEMA */

comprobarSesion();
               
