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

      const form = document.querySelector('form'),
                nombreUsuario = document.querySelector('#nombre'),
                apellidoUsuario = document.querySelector('#apellido'),
                telefonoUsuario = document.querySelector('#telefono'),
                correoUsuario = document.querySelector('#correo'),
                passUsuario = document.querySelector('#pass');

            const boton = document.getElementById('form_registro--Registrar');
            console.log(boton);
            boton.addEventListener('click', registrarDatos);
            function registrarDatos(e){
                e.preventDefault();

                const nuevoUsuario = {
                    nombre : nombreUsuario.value,
                    apellido : apellidoUsuario.value,
                    telefono : telefonoUsuario.value,
                    correo : correoUsuario.value,
                    contrasena : passUsuario.value,
                    tipo_usuario : 'cliente',
                    primerLogin : false,
                }

                const request = getObjectStore('usuario', 'readwrite').add(nuevoUsuario);
                request.onsuccess = (event) => {
                    sessionStorage.setItem('usuario', JSON.stringify(request.result));
                    window.location.href = '/login.html';
                }
                request.onerror = (event) => {
                    console.log('Ha ocurrido un Error');
                }
            }
          });