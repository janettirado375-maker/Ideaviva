function buscar() {
  const campo = document.getElementById("busqueda");
  const resultado = document.getElementById("resultado");

  if (!campo || !resultado) {
    console.error("No se encontraron los elementos de búsqueda.");
    return;
  }

  const consulta = campo.value.trim();

  resultado.replaceChildren();

  if (consulta === "") {
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

function abrirHerramienta(nombre) {
  const panel = document.getElementById("panel-herramienta");

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

  panel.innerHTML = `
    <h2>${herramienta.titulo}</h2>
    <p>${herramienta.texto}</p>
    <button onclick="cerrarHerramienta()">Volver</button>
  `;

  panel.style.display = "block";
  panel.scrollIntoView({ behavior: "smooth" });
}

function cerrarHerramienta() {
  document.getElementById("panel-herramienta").style.display = "none";
}
// IDEA VIVA — Navegación del espacio de trabajo

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

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// IDEA VIVA — Conexión con Supabase

const SUPABASE_URL = "https://wozyeqmxetrxwvuidtqw.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_np6F63W601c3VF0iHq9YrA_89S8bo7j";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
async function probarConexion() {
  const { data, error } = await supabaseClient
    .from("proyectos")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Error de conexión:", error.message);
    return;
  }

  console.log("¡IDEA VIVA está conectada a Supabase!", data);
}
probarConexion();
// IDEA VIVA — Registro de usuarios

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
    mensaje.textContent = "La contraseña debe tener al menos 8 caracteres.";
    return;
  }

  mensaje.textContent = "Creando tu cuenta...";

  const { data, error } = await supabaseClient.auth.signUp({
    email: correo,
    password: clave,
    options: {
      emailRedirectTo: "https://janettirado375-maker.github.io/Ideaviva/",
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
// IDEA VIVA — Inicio de sesión

async function iniciarSesion() {
  const correo = document.getElementById("correo-usuario").value.trim();
  const clave = document.getElementById("clave-usuario").value;
  const mensaje = document.getElementById("mensaje-acceso");

  if (!correo || !clave) {
    mensaje.textContent = "Escribe tu correo y contraseña.";
    return;
  }

  mensaje.textContent = "Iniciando sesión...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
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
// IDEA VIVA — Comprobar sesión del usuario

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

comprobarSesion();
// IDEA VIVA — Cerrar sesión

async function cerrarSesionUsuario() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("No se pudo cerrar la sesión.");
    return;
  }

  document.getElementById("pantalla-acceso").style.display = "flex";
  mostrar("inicio");
}
// IDEA VIVA — Guardar proyectos

async function guardarProyecto(nombre, contenido) {
  const { data: sesion } = await supabaseClient.auth.getSession();

  const usuario = sesion.session?.user;

  if (!usuario) {
    alert("Debes iniciar sesión primero.");
    return;
  }

  const { data, error } = await supabaseClient
    .from("proyectos")
    .insert([
      {
        usuario_id: usuario.id,
        nombre: nombre,
        contenido: contenido
      }
    ]);

  if (error) {
    console.error("Error al guardar:", error.message);
    alert("No se pudo guardar el proyecto.");
    return;
  }

  alert("¡Proyecto guardado correctamente!");
}
