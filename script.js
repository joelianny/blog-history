// ==================== NAVEGACIÓN ====================
function mostrarSeccion(idSeccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(sec => {
        sec.classList.remove('activa');
    });
    // Mostrar la seleccionada
    document.getElementById(idSeccion).classList.add('activa');
    
    // Si es calendario, dibujarlo
    if (idSeccion === 'calendario') {
        dibujarCalendario();
        cargarNota();
    }
}

// ==================== CALENDARIO ====================
let fechaActual = new Date();

function dibujarCalendario() {
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    const nombresMes = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    document.getElementById('nombre-mes').textContent = `${nombresMes[mes]} ${anio}`;
    
    const primerDia = new Date(anio, mes, 1).getDay();
    const diasDelMes = new Date(anio, mes + 1, 0).getDate();
    const hoy = new Date();
    
    let html = '';
    
    // Espacios vacíos antes del primer día
    for (let i = 0; i < primerDia; i++) {
        html += '<div class="dia vacio"></div>';
    }
    
    // Días del mes
    for (let dia = 1; dia <= diasDelMes; dia++) {
        let claseHoy = '';
        if (dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()) {
            claseHoy = ' hoy';
        }
        html += `<div class="dia${claseHoy}" onclick="seleccionarDia(${dia})">${dia}</div>`;
    }
    
    document.getElementById('dias-calendario').innerHTML = html;
}

function seleccionarDia(dia) {
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    document.getElementById('texto-nota').dataset.fecha = `${anio}-${mes}-${dia}`;
    cargarNota();
}

function guardarNota() {
    const fecha = document.getElementById('texto-nota').dataset.fecha || 'hoy';
    const texto = document.getElementById('texto-nota').value;
    localStorage.setItem(`nota-${fecha}`, texto);
    
    const mensaje = document.getElementById('mensaje-guardado');
    mensaje.textContent = '✅ ¡Nota guardada!';
    setTimeout(() => mensaje.textContent = '', 2000);
}

function cargarNota() {
    const fecha = document.getElementById('texto-nota').dataset.fecha || 'hoy';
    const notaGuardada = localStorage.getItem
(`nota-${fecha}`);
    document.getElementById('texto-nota').value = notaGuardada || '';
}

// ==================== TAREAS ====================
let listaTareas = JSON.parse(localStorage.getItem('tareas-blog')) || [];

function renderizarTareas() {
    const lista = document.getElementById('lista-tareas');
    lista.innerHTML = '';
    
    listaTareas.forEach((tarea, indice) => {
        const li = document.createElement('li');
        li.className = tarea.hecha ? 'hecha' : '';
        li.innerHTML = `
            <span onclick="cambiarEstado(${indice})">${tarea.texto}</span>
            <button class="btn-eliminar" onclick="eliminarTarea(${indice})">🗑️</button>
        `;
        lista.appendChild(li);
    });
}

function agregarTarea() {
    const input = document.getElementById('nueva-tarea');
    const texto = input.value.trim();
    
    if (texto) {
        listaTareas.push({ texto: texto, hecha: false });
        localStorage.setItem('tareas-blog', JSON.stringify(listaTareas));
        input.value = '';
        renderizarTareas();
    }
}

function cambiarEstado(indice) {
    listaTareas[indice].hecha = !listaTareas[indice].hecha;
    localStorage.setItem('tareas-blog', JSON.stringify(listaTareas));
    renderizarTareas();
}

function eliminarTarea(indice) {
    listaTareas.splice(indice, 1);
    localStorage.setItem('tareas-blog', JSON.stringify(listaTareas));
    renderizarTareas();
}

// Mostrar sección de inicio al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderizarTareas();
});