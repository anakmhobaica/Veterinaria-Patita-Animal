let db;

const form = document.getElementById('form-historial'),
    nombreMascota = document.getElementById('mascota'),
    nombreDueno = document.getElementById('cliente'),
    fecha = document.getElementById('fecha'),
    motivo = document.getElementById('motivo'),
    especificaciones = document.getElementById('especificaciones'),
    guardarButton = document.getElementById('guardar-historial'),
    nuevoButton = document.getElementById('nuevo-historial'),
    deleteButton = document.getElementById('delete-historial');

const openDB = () => {
  console.log('Abriendo DB');
  let crearDB = indexedDB.open('veterinaria', 1);

  crearDB.onerror = function(event) {
      console.log('error', event)
  }

  crearDB.onsuccess = function() {
      db = crearDB.result;     
      form.reset();  
      cargarHistoriales(); 
  }

  crearDB.onupgradeneeded = function(e) {
      let database = e.target.result;
     
      let usuario = database.createObjectStore('usuario', {keyPath: 'id_usuario', autoIncrement: true } );
   
      usuario.createIndex('correo', 'correo', {unique : true } );
      usuario.createIndex('contrasena', 'contrasena', {unique : false } );
      usuario.createIndex('nombre', 'nombre', {unique : false } );
      usuario.createIndex('apellido', 'apellido', {unique : false } );
      usuario.createIndex('telefono', 'telefono', {unique : false } );
      usuario.createIndex('tipo_usuario', 'tipo_usuario', {unique : false } );
      usuario.createIndex('primerLogin', 'primerLogin', {unique : false}); 

      let veterinario = {nombre: 'Pepito', apellido: 'Perez', telefono: '7123718724', correo: 'veterinario.patitanimal@gmail.com', contrasena: '1234', tipo_usuario: 'veterinario', primerLogin: true};
      usuario.add(veterinario);

      let cita = database.createObjectStore('cita', {keyPath: 'id_cita', autoIncrement: true } );
   
      cita.createIndex('id_mascota', 'id_mascota', {unique : false } );
      cita.createIndex('fecha', 'fecha', {unique : true } );
      cita.createIndex('id_cliente', 'id_cliente', {unique : false } );
      cita.createIndex('id_historialMedico', 'id_historialMedico', {unique : false } );

      let mascota = database.createObjectStore('mascota', {keyPath: 'id_mascota', autoIncrement: true } );
   
      mascota.createIndex('nombre', 'nombre', {unique : false } );
      mascota.createIndex('descripcion', 'descripcion', {unique : false } );
      mascota.createIndex('edad', 'edad', {unique : false } );    
      mascota.createIndex('id_dueno', 'id_dueno', {unique : false } );         

      let historialMedico = database.createObjectStore('historialMedico', {keyPath: 'id_historialMedico', autoIncrement: true } );
   
      historialMedico.createIndex('id_mascota', 'id_mascota', {unique : false } );
      historialMedico.createIndex('examenes', 'examenes', {unique : false } );
      historialMedico.createIndex('diagnostico', 'diagnostico', {unique : false } );    

      console.log('base de datos creada y lista');
   }
}

const getObjectStore = (store_name, mode) => {
  let transaccion = db.transaction(store_name, mode);
  transaccion.onerror = (event) => {
    console.log('Ha ocurrido un error:', event);
  }
  return transaccion.objectStore(store_name);
}

document.addEventListener('DOMContentLoaded', () => {
  openDB();

  form.onsubmit = (e) => { e.preventDefault(); crearHistorial(); }
  nuevoButton.addEventListener('click', mostrarNuevoHistorial);

  let estadoSesion = document.getElementById('estado-sesion');
  
  estadoSesion.innerHTML = 
      `<a href="modificar-usuario.html" class="login">CUENTA</a>
       <a class="login" id="button-logout">CERRAR SESIÓN</a> 
      `;
  let buttonLogout = document.getElementById('button-logout');
  buttonLogout.addEventListener('click', deleteUserStorage);
  function deleteUserStorage(e){
    sessionStorage.removeItem('usuario');
    window.location.href = '/index.html';
  }
  
  let botonVolver = document.getElementById('btn_pagar');

  botonVolver.onclick = (e) => {
      history.back();
  }
});

const cargarDatosHistorial = (historial) => {
  form.onsubmit = (e) => { e.preventDefault(); actualizarHistorial(historial); }
  guardarButton.innerHTML = "ACTUALIZAR";
  deleteButton.removeAttribute('disabled');
  deleteButton.onclick = (e) => { e.preventDefault(); eliminarHistorial(historial); }
  const contenedorHistorial = document.getElementById('history-info');
  console.log(historial);

  if (historial) {
    nombreMascota.value = historial.mascota;
    nombreDueno.value = historial.dueno;
    fecha.value = historial.fecha;
    motivo.value = historial.motivo;
    especificaciones.value = historial.especificaciones;
  } else {

  }
}

const crearHistorial = () => {
  const nuevoHistorial = {
    mascota: nombreMascota.value,
    dueno: nombreDueno.value,
    fecha: fecha.value,
    motivo: motivo.value,
    especificaciones: especificaciones.value,
  };

  const request = getObjectStore('historialMedico', 'readwrite').add(nuevoHistorial);
  request.onsuccess = () => {
    form.reset();
    cargarHistoriales();
  }
}

const actualizarHistorial = (historial) => {

  const nuevoHistorial = {
    ...historial,
    mascota: nombreMascota.value,
    dueno: nombreDueno.value,
    fecha: fecha.value,
    motivo: motivo.value,
    especificaciones: especificaciones.value,
  };

  const request = getObjectStore('historialMedico', 'readwrite').put(nuevoHistorial);
  request.onsuccess = () => {
    console.log(request);
    console.log('actualizado');
    cargarHistoriales();
  }
}

const mostrarNuevoHistorial = () => {
  form.reset();
  deleteButton.setAttribute('disabled', 'disabled');
  guardarButton.innerHTML = "GUARDAR";
  form.onsubmit = (e) => { e.preventDefault(); crearHistorial(); }
}

const eliminarHistorial = (historial) => {
  const request = getObjectStore('historialMedico', 'readwrite').delete(Number(historial.id_historialMedico));
  console.log(request);
  request.onsuccess = () => {
    mostrarNuevoHistorial();
    cargarHistoriales();
  }
}

const cargarHistoriales = () => {
  const listaHistorial = document.getElementById('lista-historiales');
  listaHistorial.innerHTML = "";
  let historialStore = getObjectStore('historialMedico');
  historialStore.openCursor().onsuccess = (e) => {
    let cursor = e.target.result;

    if (cursor) {
      const historial = cursor.value;
      let historialHTML = document.createElement('li');
      historialHTML.setAttribute('data-historial-id', cursor.value.id_historialMedico);
      historialHTML.classList.add('list-group-item');
      historialHTML.innerHTML = `
      <li class="days-week" id="historial-${cursor.value.id_historialMedico}">
          <div class="day-hour">
              <div>Mascota: ${cursor.value.mascota}</div>
              <div>Dueño: ${cursor.value.dueno}</div>
          </div>
          <div class="pet-name">
              <div>Fecha: ${moment(cursor.value.fecha).format('MM/DD/YYYY')}</div>
          </div>
      </li>
      `;
      historialHTML.onclick = (e) => {
        e.preventDefault();
        cargarDatosHistorial(historial);
      }
      listaHistorial.appendChild(historialHTML);

      cursor.continue();
    } else {
      if (!listaHistorial.firstElementChild) {
        const historialLimpio = document.createElement('p');
        historialLimpio.classList.add('text-center');
        historialLimpio.textContent = "No hay registros";
        listaHistorial.appendChild(historialLimpio);
      }
    }
  };
}
