function buscar() {
  const consulta = document.getElementById("busqueda").value.trim();
  const resultado = document.getElementById("resultado");

  if (consulta === "") {
    resultado.innerText = "Escribe una pregunta para comenzar.";
    return;
  }

  resultado.innerHTML = `
    <h3>IDEA VIVA está lista para ayudarte</h3>
    <p>Tu consulta: ${consulta}</p>
    <p>Pronto conectaremos nuestro motor de inteligencia artificial.</p>
  `;
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
  document.querySelectorAll(".workspace").forEach(seccion => {
    seccion.classList.add("hidden");
  });

  const destino = document.getElementById(id);

  if (destino) {
    destino.classList.remove("hidden");
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  if (boton) {
    boton.classList.add("active");
  } else {
    const menu = document.querySelector(
      `.nav-item[onclick*="'${id}'"]`
    );
    if (menu) menu.classList.add("active");
  }
}
// IDEA VIVA — Conexión con Supabase

const SUPABASE_URL = "https://wozyeqmxetrxwvuidtqw.supabase.co";

const SUPABASE_ANON_KEY = sb_publishable_np6F63W601c3VF0iHq9YrA_89S8bo7j;

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
