let db;

const openDB = () => {
  console.log('Abriendo DB');
  let crearDB = indexedDB.open('veterinaria', 1);

  crearDB.onerror = function(event) {
      console.log('error', event)
  }

  crearDB.onsuccess = function() {
      db = crearDB.result;        
      cargarCitas();
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

const cargarCitas = () => {
    const listaCitas = document.getElementById('lista-citas');
    const botonAceptar = document.getElementById('button-accept');
    const botonRechazar = document.getElementById('button-refuse');
    listaCitas.innerHTML = '';
    let citaStore = getObjectStore('cita', 'readwrite');
    let fecha = moment(new Date);
    citaStore.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor) {
            if (moment(cursor.value.fecha).isAfter(fecha)) {
                const cita = cursor.value;
                let citaHTML = document.createElement('li');
                citaHTML.classList.add('days-week');
                citaHTML.id = `cita-${cursor.value.id_cita}`
                citaHTML.innerHTML = `
                <div class="day-hour">
                    <div>Fecha: ${cursor.value.fecha} ${cursor.value.hora}</div>
                    <div>Mascota: ${cursor.value.mascota}</div>
                </div>`;
                if (cursor.value.estado === "aceptado") {
                    citaHTML.classList.add('aceptado')
                } else if (cita.estado === "rechazado") {
                    citaHTML.classList.add('rechazado')
                }
                citaHTML.onclick = (e) => {
                    e.preventDefault();
                    cargarDatosCita(cita);
                };
                listaCitas.appendChild(citaHTML);
            }
            cursor.continue();
        } else {

        }
    }
}

const cargarDatosCita = (cita) => {
    const infoCita = document.getElementById('info-cita');
    const botonAceptar = document.getElementById('button-accept');
    const botonRechazar = document.getElementById('button-refuse');
    const itemCita = document.getElementById(`cita-${cita.id_cita}`);
    limpiarSeleccion();
    itemCita.classList.add('selected');
    infoCita.innerHTML = `
    <b>Fecha: </b>${cita.fecha} ${cita.hora}<br><br>
    <b>Nombre de la mascota: </b>${cita.mascota}<br><br>
    <b>Nombre del dueño: </b>${cita.cliente}<br><br>
    <b>Sintomas: </b>${cita.sintomas}.  
    `;
    if (cita.estado === "aceptado" || cita.estado === "rechazado") {
        botonAceptar.setAttribute('disabled', 'disabled');
        botonRechazar.setAttribute('disabled', 'disabled');
    } else {
        botonAceptar.removeAttribute('disabled');
        botonRechazar.removeAttribute('disabled');
    }
    botonAceptar.onclick = (e) => {
        e.preventDefault();
        aceptarCita(cita);
    }   
    botonRechazar.onclick = (e) => {
        e.preventDefault();
        rechazarCita(cita);
    }
}

const rechazarCita = (cita) => {
    const itemCita = document.getElementById(`cita-${cita.id_cita}`);
    let citaStore = getObjectStore('cita', 'readwrite');
    let request = citaStore.get(Number(cita.id_cita));
    request.onsuccess = () => {
        const citaRechazada = request.result; 
        citaRechazada.estado = "rechazado";
        citaStore.put(citaRechazada).onsuccess = () => {
            itemCita.classList.add('rechazado');
            const botonAceptar = document.getElementById('button-accept');
            botonAceptar.setAttribute('disabled', 'disabled');
            const botonRechazar = document.getElementById('button-refuse');
            botonRechazar.setAttribute('disabled', 'disabled');
        };
    };
}

const aceptarCita = (cita) => {
    const itemCita = document.getElementById(`cita-${cita.id_cita}`);
    let citaStore = getObjectStore('cita', 'readwrite');
    let request = citaStore.get(Number(cita.id_cita));
    request.onsuccess = () => {
        const citaAceptada = request.result;
        citaAceptada.estado = "aceptado";
        citaStore.put(citaAceptada).onsuccess = () => {
            itemCita.classList.add('aceptado');
            const botonAceptar = document.getElementById('button-accept');
            botonAceptar.setAttribute('disabled', 'disabled');
            const botonRechazar = document.getElementById('button-refuse');
            botonRechazar.setAttribute('disabled', 'disabled');
        };
    };
}

const limpiarSeleccion = () => {
    const listaSeleccionado = document.getElementsByClassName('selected');
    if (listaSeleccionado.length) {
        for (let index = 0; index < listaSeleccionado.length; index++) {
            listaSeleccionado[index].classList.remove('selected');
        }
    }
}