let db;

// Selectores de la interfaz

const form = document.querySelector('form'),
      nombreMascota = document.querySelector('#mascota'),
      nombreCLiente = document.querySelector('#cliente'),
      telefono =document.querySelector('#telefono'),
      fecha = document.querySelector('#fecha'),
      hora = document.querySelector('#hora'),
      sintomas = document.querySelector('#sintomas'),
      citas = document.querySelector('#citas'),
      headingAdministra = document.querySelector('#administra'); 

document.addEventListener('DOMContentLoaded', () => {
    console.log('Abriendo db');
    let crearDB = indexedDB.open('veterinaria', 1);

    crearDB.onerror = function(event) {
        console.log('error', event)
    } 
    crearDB.onsuccess = function() {
        db = crearDB.result;
        let usuarioLoggeado = JSON.parse(sessionStorage.getItem('usuario'));
        nombreCLiente.value = usuarioLoggeado.nombre + " " + usuarioLoggeado.apellido;
        mostrarCitas();
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

    const getObjectStore = (store_name, mode) => {
        let transaccion = db.transaction(store_name, mode);
        transaccion.onerror = (event) => {
            console.log('Ha ocurrido un error:', event);
        }
        return transaccion.objectStore(store_name);
    }

    form.addEventListener('submit', agregarDatos);
    function agregarDatos(e) {
        e.preventDefault();
        
        let usuarioLoggeado = JSON.parse(sessionStorage.getItem('usuario'));

        if (!usuarioLoggeado) {
            return
        }

        const nuevaCita = {
            mascota : nombreMascota.value,
            cliente : nombreCLiente.value,
            telefono : telefono.value,
            fecha : fecha.value,
            hora : hora.value,
            sintomas : sintomas.value,
            id_cliente: usuarioLoggeado.id_usuario,
        }


        let objectStore = getObjectStore('cita', 'readwrite');
        let peticion = objectStore.add(nuevaCita);
        console.log(peticion);

        peticion.onsuccess = () => {
            form.reset();
            console.log('cita agregada');
            mostrarCitas();
        }
    }

    function mostrarCitas() {
       citas.textContent = '';
       let usuarioLoggeado = JSON.parse(sessionStorage.getItem('usuario'));

       let usuarioStore = getObjectStore('usuario', 'readwrite');
       
       let request = usuarioStore.get(usuarioLoggeado.id_usuario);
       
       request.onsuccess = (event) => {
        let objectStore = getObjectStore('cita', 'readwrite');
        objectStore.openCursor().onsuccess = function(e) {
            let cursor = e.target.result;

            if(cursor) {
                if (cursor.value.id_cliente === request.result.id_usuario) {
                let citaHTML = document.createElement('li');
                citaHTML.setAttribute('data-cita-id', cursor.value.id_cita);
                citaHTML.classList.add('list-group-item');
                citaHTML.innerHTML = `
                    <p class="font-weight-bold">Mascota: <span class="font-weight-normal">${cursor.value.mascota}</span></p>
                    <p class="font-weight-bold">Cliente: <span class="font-weight-normal">${cursor.value.cliente}</span></p>
                    <p class="font-weight-bold">Teléfono: <span class="font-weight-normal">${cursor.value.telefono}</span></p>
                    <p class="font-weight-bold">Fecha: <span class="font-weight-normal">${cursor.value.fecha}</span></p>
                    <p class="font-weight-bold">Hora: <span class="font-weight-normal">${cursor.value.hora}</span></p>
                    <p class="font-weight-bold">Síntomas: <span class="font-weight-normal">${cursor.value.sintomas}</span></p>
                    <p class="font-weight-bold">Estado: <span class="font-weight-normal">
                        ${(cursor.value.estado) ? (cursor.value.estado === "aceptado") ? "Aceptado" : "Rechazado" : "En Espera"}
                    </span></p>
                `;

                const botonBorrar = document.createElement('button');
                const botonPagar = document.createElement('button');
                botonBorrar.classList.add('borrar', 'btn', 'btn-danger');
                botonPagar.classList.add('pagar', 'btn', 'btn-pay');
                botonBorrar.innerHTML = '<span aria-hidden="true">X</span> Borrar';
                if (cursor.value.pagado) {
                    botonPagar.setAttribute('disabled', 'disabled');
                    botonPagar.innerHTML = 'Pagado';
                } else {
                    botonPagar.innerHTML = "Pagar"
                }
                botonBorrar.onclick = borrarCita;
                botonPagar.onclick = pagarCita;
                citaHTML.appendChild(botonBorrar);
                citaHTML.appendChild(botonPagar);

                citas.appendChild(citaHTML);

                }
                
                cursor.continue();

            } else {
                if(!citas.firstChild){
                headingAdministra.textContent = 'Agrega citas para comenzar';
                let listado = document.createElement('p');
                listado.classList.add('text-center');
                listado.textContent = "No hay registros";
                citas.appendChild(listado);
                }else {
                    headingAdministra.textContent = 'Administra tus citas'
                }
            }
        }
       }
    }
    function pagarCita(e) {
        let citaID = Number(e.target.parentElement.getAttribute('data-cita-id'));
        window.location.href = `/pago.html?id_cita=${citaID}`;
    }

    function borrarCita(e) {
        let citaID = Number(e.target.parentElement.getAttribute('data-cita-id'));

        let objectStore = getObjectStore('cita', 'readwrite');

        let peticion = objectStore.delete(citaID);

        peticion.onsuccess = () => {
            e.target.parentElement.parentElement.removeChild(e.target.parentElement);
            console.log(`Se elimino la cita con el Id: ${citaID} `);

            if(!citas.firstChild){
                headingAdministra.textContent = 'Agrega citas para comenzar';
                let listado = document.createElement('p');
                listado.classList.add('text-center');
                listado.textContent = "No hay registros";
                citas.appendChild(listado);
            }else {
                headingAdministra.textContent = 'Administra tus citas'
            }

        }
        
    }

})