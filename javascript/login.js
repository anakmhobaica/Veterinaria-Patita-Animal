let db;

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
      console.log('funciona')
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
      cita.createIndex('id_veterinario', 'id_veterinario', {unique : false } );
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

            // Selectores de la interfaz
            const form = document.querySelector('form'),
                correoUsuario = document.querySelector('#correo'),
                passUsuario = document.querySelector('#pass'),
                error = document.querySelector('#error-login');

            const boton = document.getElementById('form_inicio--iniciar');
            console.log('Boton', boton);
            boton.addEventListener('click', registrarDatos);
            function registrarDatos(e){
                e.preventDefault();
 
                const usuarioRegistrado = {
                    correo : correoUsuario.value,
                    contrasena : passUsuario.value,
                }

                let objectStore = getObjectStore('usuario', 'readwrite');
                let request = objectStore.index('correo').get(usuarioRegistrado.correo);
                request.onsuccess = (event) => {
                    if (request.result === undefined){
                        error.innerHTML = 'Credenciales inválidas';
                    } else {
                        if (request.result.tipo_usuario === 'veterinario'){
                            if (request.result.primerLogin){
                                const data = request.result;
                                data.primerLogin = false;
                                data.contrasena = usuarioRegistrado.contrasena;
                                // Esto actualiza la DB
                                objectStore.put(data);
                                sessionStorage.setItem('usuario', JSON.stringify(request.result));
                                window.location.href = '/agenda-citas.html';
                            } else if (request.result.contrasena === usuarioRegistrado.contrasena) {
                                sessionStorage.setItem('usuario', JSON.stringify(request.result));
                                window.location.href = '/agenda-citas.html';
                            } else {
                                error.innerHTML = 'Credenciales inválidas';
                            }
                        } else {
                            if (request.result.contrasena === usuarioRegistrado.contrasena) {
                                if(request.result.deshabilitado) {
                                    error.innerHTML = 'Su usuario ha sido deshabilitado';
                                } else {
                                    sessionStorage.setItem('usuario', JSON.stringify(request.result));
                                    window.location.href = '/agendar-cliente.html';
                                }
                            } else {
                                error.innerHTML = 'Credenciales inválidas';
                            }
                        }
                    }
                }
                request.onerror = (event) => {
                    console.log('Ocurrio un error');
                } 
            }
            console.log('Cargado!');
})