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
