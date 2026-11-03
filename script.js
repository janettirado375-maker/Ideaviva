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
