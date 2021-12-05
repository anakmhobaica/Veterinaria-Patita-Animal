let db;

const form = document.getElementById('pay-form');

const openDB = () => {
  console.log('Abriendo DB');
  let crearDB = indexedDB.open('veterinaria', 1);

  crearDB.onerror = function(event) {
      console.log('error', event)
  }

  crearDB.onsuccess = function() {
      db = crearDB.result;        
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
  form.addEventListener('submit', efectuarPago);
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

  let botonPagar = document.getElementById('pay-btn');

  botonPagar.onclick = (e) => {
    let anuncioHTML = document.getElementById('exito');
    anuncioHTML.innerHTML = 'Operación realizada con éxito!'
  }
});

const efectuarPago = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const id_cita = Number(urlParams.get('id_cita'));
    if (id_cita) {
        const citaStore = getObjectStore('cita', 'readwrite');
        let request = citaStore.get(id_cita)
        request.onsuccess = (e) => {
            const citaAPagar = request.result;
            citaAPagar.pagado = true;
            const actualizacion = citaStore.put(citaAPagar);
            actualizacion.onsuccess = () => {
              form.reset();
              let anuncioHTML = document.getElementById('exito');
              anuncioHTML.innerHTML = 'Operación realizada con éxito!'
                // window.location.href = '/agendar-cliente.html';
            }
        }
    } else {
        console.log('no hay cita cono');
    }
}