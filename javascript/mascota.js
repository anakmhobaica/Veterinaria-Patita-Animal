let db;

const form = document.querySelector('form'),
      nombreMascota = document.querySelector('#mascota'),
      nombreCLiente = document.querySelector('#cliente'),
      edadMascota =document.querySelector('#edad'),
      pesoMascota = document.querySelector('#peso'),
      descripcionMascota = document.querySelector('#descripcion');

const openDB = () => {
  console.log('Abriendo DB');
  let crearDB = indexedDB.open('veterinaria', 1);

  crearDB.onerror = function(event) { 
      console.log('error', event)
  }

  crearDB.onsuccess = function() {
      db = crearDB.result;
      urlParams = new URLSearchParams(window.location.search),
      id_mascota = Number(urlParams.get('id_mascota'));
      if (id_mascota) {
        cargarDatosMascota(id_mascota)
      } 
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

  urlParams = new URLSearchParams(window.location.search),
  id_mascota = urlParams.get('id_mascota');
  const boton = document.getElementById('registrar');
  if (id_mascota) {
    boton.addEventListener('click', (e) => { e.preventDefault(); actualizarMascota(Number(id_mascota)); });
  } else {
    boton.addEventListener('click', registrarMascota)
  }

  let botonVolver = document.getElementById('btn_pagar');

  botonVolver.onclick = (e) => {
      history.back();
  }
});

const registrarMascota = (e) => {
  e.preventDefault()
  let usuarioLoggeado = JSON.parse(sessionStorage.getItem('usuario'));

  if (!usuarioLoggeado) {
      return
  }

  const nuevaMascota = {
      mascota : nombreMascota.value,
      cliente : nombreCLiente.value,
      edad : edadMascota.value,
      peso : pesoMascota.value,
      descripcion : descripcionMascota.value,
      id_cliente : usuarioLoggeado.id_dueno,
  }

  let objectStore = getObjectStore('mascota', 'readwrite');
  objectStore.add(nuevaMascota).onsuccess = () =>{
      form.reset();
      window.location.href = '/lista-mascotas.html';
  }
}

const actualizarMascota = (id_mascota) => {
  let objectStore = getObjectStore('mascota', 'readwrite');
  let request = objectStore.get(id_mascota);
  request.onsuccess = () => {
    const mascotaActualizar = request.result;
    const nuevaMascota = {
      ...mascotaActualizar,
      mascota : nombreMascota.value,
      cliente : nombreCLiente.value,
      edad : edadMascota.value,
      peso : pesoMascota.value,
      descripcion : descripcionMascota.value,
    }

    objectStore.put(nuevaMascota).onsuccess = () => {
      form.reset();
      window.location.href = '/lista-mascotas.html';
    }
  }
}

const cargarDatosMascota = (id_mascota) => {
  let objectStore = getObjectStore('mascota', 'readwrite');

  objectStore.openCursor(IDBKeyRange.only(Number(id_mascota))).onsuccess = function (e) {
    let cursor = e.target.result;

    if (cursor) {
      nombreMascota.value = cursor.value.mascota,
      nombreCLiente.value = cursor.value.cliente,
      edadMascota.value = cursor.value.edad,
      pesoMascota.value = cursor.value.peso,
      descripcionMascota.value = cursor.value.descripcion;
    }
  }
}