let db;

const form = document.querySelector('form'),
      nombreUsuario = document.querySelector('#nombre'),
      apellidoUsuario = document.querySelector('#apellido'),
      telefonoUsuario =document.querySelector('#telefono'),
      correoUsuario = document.querySelector('#correo'),
      contrasenaUsuario = document.querySelector('#pass'),
      confirmarContrasena = document.querySelector('#confirmar');

const openDB = () => {
  console.log('Abriendo DB');
  let crearDB = indexedDB.open('veterinaria', 1);

  crearDB.onerror = function(event) {
      console.log('error', event)
  }

  crearDB.onsuccess = function() {
      db = crearDB.result;
      mostrarBarra();  
      cargarDatos();   
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

  const boton = document.getElementById('actualizar');

  boton.addEventListener('click', actualizarUsuario);

});
let usuarioLoggeado = JSON.parse(sessionStorage.getItem('usuario'));

const actualizarUsuario = () => {
  let objectStore = getObjectStore('usuario', 'readwrite');
  let request = objectStore.get(usuarioLoggeado.id_usuario);
  request.onsuccess = () => {
    const usuarioActualizar = request.result;
    const nuevoUsuario = {
      ...usuarioActualizar,
      nombre : nombreUsuario.value,
      apellido : apellidoUsuario.value,
      telefono : telefonoUsuario.value,
      correo : correoUsuario.value,
      contrasena : contrasenaUsuario.value,
    }

    objectStore.put(nuevoUsuario).onsuccess = () => {
      form.reset();
      console.log('Usuario actualizado');
      window.location.href = '/modificar-usuario.html';
    }
  }
}

const mostrarBarra = () => {
  let navBar = document.getElementById('barra');

  if(usuarioLoggeado.id_usuario != 1){
    navBar.innerHTML = `
    <nav>
        <div class="navbar">
            <ul class="options">
                <li><a href="index.html"><input type="button" Value="Inicio" class="Boton--cabecera"></a></li>
                <li><a href="agendar-cliente.html"><input type="button" Value="Agendar una cita" class="Boton--cabecera"></a></li>
                <li><a href="lista-mascotas.html"><input type="button" Value="Tus mascotas" class="Boton--cabecera"></a></li>
                <li id="estado-sesion"></li>
            </ul>
        </div>
    </nav>
    `;
  }else{
    navBar.innerHTML = `
    <nav>
      <div class="navbar">
        <ul class="options">
            <li><a href="index.html"><input type="button" Value="Inicio" class="Boton--cabecera"></a></li>
            <li><a href="agenda-citas.html"><input type="button" Value="Agenda" class="Boton--cabecera"></a></li>
            <li><a href="lista-clientes.html"><input type="button" Value="Lista de clientes" class="Boton--cabecera"></a></li>
            <li><a href="historial-medico.html"><input type="button" Value="Historial de mascotas" class="Boton--cabecera"></a></li>
            <li id="estado-sesion"></li>
        </ul>
      </div>
    </nav>
    `;
  }

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
}

const cargarDatos = () => {
  let objectStore = getObjectStore('usuario', 'readwrite');

  objectStore.openCursor(IDBKeyRange.only(Number(usuarioLoggeado.id_usuario))).onsuccess = function (e) {
    let cursor = e.target.result;

    if (cursor) {
      nombreUsuario.value = cursor.value.nombre,
      apellidoUsuario.value = cursor.value.apellido,
      telefonoUsuario.value = cursor.value.telefono,
      correoUsuario.value = cursor.value.correo,
      contrasenaUsuario.value = cursor.value.contrasena,
      confirmarContrasena.value = cursor.value.contrasena;

    }
  }
}