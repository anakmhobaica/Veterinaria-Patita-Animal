let db;

const openDB = () => {
  console.log('Abriendo DB');
  let crearDB = indexedDB.open('veterinaria', 1);

  crearDB.onerror = function(event) {
      console.log('error', event)
  }

  crearDB.onsuccess = function() {
        db = crearDB.result;
        mostrarCliente();    
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

function mostrarCliente(){
    let clienteStore = getObjectStore('usuario', 'readwrite');

    clienteStore.openCursor().onsuccess = function(e) {
        let cursor = e.target.result;
        let clientesRegistrados = document.getElementById('registrados');
        
        if(cursor){ 
            if(cursor.value.id_usuario != 1){
                let clienteHTML = document.createElement('li');
                const cliente = cursor.value;
                clienteHTML.setAttribute('clientes', cursor.value.id_usuario);
                clienteHTML.id = `cliente-${cursor.value.id_usuario}`
                clienteHTML.classList.add('clientes');
                clienteHTML.innerHTML = `
                    <div class="data-cliente">
                        <div>Nombre: ${cursor.value.nombre} ${cursor.value.apellido}</div>
                        <div>Correo: ${cursor.value.correo}</div>
                        <div>Teléfono: ${cursor.value.telefono}</div>
                        <br>
                        <div class="div-disable"></div>
                    </div>   
                `;
                //botón deshabilitar
                const botonDeshabilitar = document.createElement('button');
                const nodoDeshabilitar = clienteHTML.getElementsByClassName('div-disable')[0];
                botonDeshabilitar.classList.add('button-disable', 'btn', 'btn-danger');
                botonDeshabilitar.innerHTML = 'Deshabilitar';
                botonDeshabilitar.onclick = (e) => {
                    console.log('también');
                    e.preventDefault();
                    botonDeshabilitar.setAttribute('disabled', 'disabled');
                    deshabilitarCliente(cliente);
                };
                if(cursor.value.deshabilitado){
                    botonDeshabilitar.setAttribute('disabled', 'disabled');
                }
                nodoDeshabilitar.appendChild(botonDeshabilitar);
                clientesRegistrados.appendChild(clienteHTML);
                
            }
            cursor.continue();
        }else {
            if(!clientesRegistrados.firstElementChild){
                let listado = document.createElement('p');
                listado.classList.add('text-center');
                listado.textContent = "No hay clientes registrados";
                clientesRegistrados.appendChild(listado);
            }   
        }  
    }
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

    let botonVolver = document.getElementById('btn_pagar');

    botonVolver.onclick = (e) => {
      history.back();
  }
 
});

const deshabilitarCliente = (usuario) => {
    const itemCliente = document.getElementById(`cliente-${usuario.id_usuario}`);
    let clienteStore = getObjectStore('usuario', 'readwrite');
    let request = clienteStore.get(Number(usuario.id_usuario));
    request.onsuccess = () => {
        const clienteDeshabilitado = request.result;
        clienteDeshabilitado.deshabilitado = true;
        clienteStore.put(clienteDeshabilitado).onsuccess = () => {
            itemCliente.classList.add('disable');
        };
    };
}