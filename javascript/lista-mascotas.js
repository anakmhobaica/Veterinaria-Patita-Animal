let db;

const openDB = () => {
  console.log('Abriendo DB');
  let crearDB = indexedDB.open('veterinaria', 1);

  crearDB.onerror = function(event) {
      console.log('error', event)
  }

  crearDB.onsuccess = function() {
        db = crearDB.result;
    //   let usuarioLoggeado = JSON.parse(sessionStorage.getItem('usuario'));
    //   nombreCLiente.value = usuarioLoggeado.nombre + " " + usuarioLoggeado.apellido;
        mostrarMascota();       
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

function mostrarMascota(){
    let mascotaStore = getObjectStore('mascota', 'readwrite');

    mascotaStore.openCursor().onsuccess = function(e) {
        let cursor = e.target.result;
        let mascotasRegistradas = document.getElementById('registrados');
        
        if(cursor){ 
            // if(cursor.value.id_cliente === usuarioLoggeado.id_dueno){
                let mascotaHTML = document.createElement('li');
                mascotaHTML.setAttribute('mascotas', cursor.value.id_mascota);
                mascotaHTML.classList.add('mascotas');
                mascotaHTML.innerHTML = `
                    <div class="data-mascota">
                        <div>Nombre: ${cursor.value.mascota}</div>
                        <div>Dueño: ${cursor.value.cliente}</div>
                        <div>Edad: ${cursor.value.edad}</div>
                        <br>
                        <div class="buttons">
                            <div class="div-edit"></div> 
                            <div class="div-delete"></div>
                        </div> 
                    </div>   
                `;

                //botón eliminar
                const botonEliminar = document.createElement('button');
                const nodoEliminar = mascotaHTML.getElementsByClassName('div-delete')[0];
                const botonEditar = document.createElement('button');
                const nodoEditar = mascotaHTML.getElementsByClassName('div-edit')[0];
                botonEliminar.classList.add('button-delete', 'btn', 'btn-danger');
                botonEliminar.innerHTML = 'Eliminar';
                botonEditar.classList.add('button-edit', 'btn', 'btn-danger');
                botonEditar.innerHTML = 'Editar'; 
                botonEliminar.onclick = (e) => {
                    e.preventDefault();
                    eliminarMascota(mascotaHTML);
                };
                botonEditar.onclick = (e) => {
                    e.preventDefault();
                    let mascotaID = Number(mascotaHTML.getAttribute('mascotas'));
                    window.location.href = `/mascota.html?id_mascota=${mascotaID}`
                };
                nodoEliminar.appendChild(botonEliminar);
                nodoEditar.appendChild(botonEditar);

                mascotasRegistradas.appendChild(mascotaHTML);

                cursor.continue();
            
        }else {
            if(!mascotasRegistradas.firstElementChild){
                let listado = document.createElement('p');
                listado.classList.add('text-center');
                listado.textContent = "No hay mascotas registradas";
                mascotasRegistradas.appendChild(listado);
            }   
        }  
    }
}

function eliminarMascota(nodo) {
    let mascotasRegistradas = document.getElementById('registrados');
    let mascotaID = Number(nodo.getAttribute('mascotas'));
    let objectStore = getObjectStore('mascota', 'readwrite');

    let peticion = objectStore.delete(mascotaID);

    peticion.onsuccess = () => {
        mascotasRegistradas.removeChild(nodo);
        console.log(`Se elimino la mascota con el Id: ${mascotaID} `);

        if(!mascotasRegistradas.firstElementChild){
            let listado = document.createElement('p');
            listado.classList.add('text-center');
            listado.textContent = "No hay mascotas registradas";
            mascotasRegistradas.appendChild(listado);
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