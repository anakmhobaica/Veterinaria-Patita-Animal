<script setup>
  //import "../CSS/styles.css";
//   import "../JavaScript/cita.js";
</script>

<template>
<!-- <div class="container mt-5 p-5">
        <div class="row">
            <div class="col-md-6 agregar-cita">
                    <h2 class="text-center my-4">Agenda de Citas</h2>
                    <form>
                            <div class="form-group row">
                                <label class="col-sm-4 col-lg-4 col-form-label">Nombre Mascota:</label>
                                <div class="col-sm-8 col-lg-8">
                                    <input type="text" id="mascota" class="form-control" placeholder="Nombre Mascota" required>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-4 col-lg-4 col-form-label">Nombre Dueño:</label>
                                <div class="col-sm-8 col-lg-8">
                                    <input type="text" id="cliente"  class="form-control"  placeholder="Nombre Dueño de la Mascota" required>
                                </div>
                            </div>
                            <div class="form-group row">
                                    <label class="col-sm-4 col-lg-4 col-form-label">Teléfono:</label>
                                    <div class="col-sm-8 col-lg-8">
                                        <input type="tel" id="telefono" class="form-control"  placeholder="Número de Teléfono" required>
                                    </div>
                                </div>
                            <div class="form-group row">
                                <label class="col-sm-4 col-lg-4 col-form-label">Fecha:</label>
                                <div class="col-sm-8 col-lg-8">
                                    <input type="date" id="fecha" class="form-control" required>
                                </div>
                            </div>

                             <div class="form-group row">
                                <label class="col-sm-4 col-lg-4 col-form-label">Hora:</label>
                                <div class="col-sm-8 col-lg-8">
                                    <input type="time" id="hora" class="form-control" required>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-sm-4 col-lg-4 col-form-label">Sintomas:</label>
                                <div class="col-sm-8 col-lg-8">
                                    <textarea id="sintomas" class="form-control" required></textarea>
                                </div>
                            </div>
                            <div class="form-group row justify-content-end">
                                <div class="col-sm-3">
                                    <button type="submit" class="btn btn-success w-100">Agregar</button>
                                </div>
                            </div>
                        </form>
            </div>

            <div class="col-md-6">
                
                    <h2 id="administra" class="text-center my-4"></h2>
                    <ul id="citas" class="list-group">
                      
                    </ul>
            </div>
        </div>


    </div> -->

    <a class="btn_pagar"><input type="button" value="Volver"></a>
    <a class="btn_pagar2"><input type="button" value="Pagar"></a>

    <div class="container mt-5 p-5">
        <div class="row">
            <div class="col-md-6 agregar-cita">
                    <h2 class="text-center my-4">Agenda de Citas</h2>
                    <form>
                            <div class="form-group row">
                                <label class="col-sm-4 col-lg-4 col-form-label">Nombre Mascota:</label>
                                <div class="col-sm-8 col-lg-8">
                                    <input type="text" id="mascota" class="form-control" placeholder="Nombre Mascota" required>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-4 col-lg-4 col-form-label">Nombre Dueño:</label>
                                <div class="col-sm-8 col-lg-8">
                                    <input type="text" id="cliente"  class="form-control"  placeholder="Nombre Dueño de la Mascota" required>
                                </div>
                            </div>
                            <div class="form-group row">
                                    <label class="col-sm-4 col-lg-4 col-form-label">Teléfono:</label>
                                    <div class="col-sm-8 col-lg-8">
                                        <input type="tel" id="telefono" class="form-control"  placeholder="Número de Teléfono" required>
                                    </div>
                                </div>
                            <div class="form-group row">
                                <label class="col-sm-4 col-lg-4 col-form-label">Fecha:</label>
                                <div class="col-sm-8 col-lg-8">
                                    <input type="date" id="fecha" class="form-control" required>
                                </div>
                            </div>

                             <div class="form-group row">
                                <label class="col-sm-4 col-lg-4 col-form-label">Hora:</label>
                                <div class="col-sm-8 col-lg-8">
                                    <input type="time" id="hora" class="form-control" required>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-sm-4 col-lg-4 col-form-label">Sintomas:</label>
                                <div class="col-sm-8 col-lg-8">
                                    <textarea id="sintomas" class="form-control" required></textarea>
                                </div>
                            </div>
                            <div class="form-group row justify-content-end">
                                <div class="col-sm-3">
                                    <button type="submit" class="btn btn-success w-100">Agregar</button>
                                </div>
                            </div>
                        </form>
            </div>

            <div class="col-md-6">
                    <h2 id="administra" class="text-center my-4"></h2>
                    <ul id="citas" class="list-group">
                      
                    </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { openDB, getObjectStore } from '../JavaScript/database.js';
export default {
    data() {
        return {
            citaActiva: null,
        }
    },
    mounted() {
        openDB();
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        if (!usuario || usuario.tipo_usuario != 'cliente') {
            this.$router.replace({ path: '/' });
        } else {
            const request = getObjectStore('citas').index('id_usuario').get(usuario.id_usuario);
            const form = document.querySelector('form'),
                nombreMascota = document.querySelector('#mascota'),
                nombreCLiente = document.querySelector('#cliente'),
                telefono =document.querySelector('#telefono'),
                fecha = document.querySelector('#fecha'),
                hora = document.querySelector('#hora'),
                sintomas = document.querySelector('#sintomas'),
                citas = document.querySelector('#citas'),
                headingAdministra = document.querySelector('#administra');
            form.addEventListener('submit', agregarDatos);
            function agregarDatos(e) {
                e.preventDefault();
                
                const nuevaCita = {
                    mascota : nombreMascota.value,
                    cliente : nombreCLiente.value,
                    telefono : telefono.value,
                    fecha : fecha.value,
                    hora : hora.value,
                    sintomas : sintomas.value
                }

                const request = getObjectStore('cita', 'readwrite').add(nuevaCita);
                request.onsuccess = (event) => {
                    //router.push({ path: '/agendar-cita '});
                    console.log('Cita agendada exitosamente.')
                }
                request.onerror = (event) => {
                    console.log('Ha ocurrido un Error');
                }

                //console.log(nuevaCita);

                // Insertar la informacion de nuevaCita en la base de datos
                //en IndexedDB se utilizan las transacciones
                let objectStore = getObjectStore('citas', 'readwrite');
            // console.log(objectStore);
                let peticion = objectStore.add(nuevaCita);
                console.log(peticion);

                // metodos para verificar lo que sucede con la base de datos.
                peticion.onsuccess = () => {
                    form.reset();
                }
                transaction.oncomplete = () => {
                    console.log('cita agregada');
                    mostrarCitas();
                }
                transaction.onerror = () => {
                    console.log('Hubo un error');
                    
                }

            }

            function mostrarCitas() {
                //limpiar las citas anteriores
            citas.textContent = '';

            //creamos ObjectStore
            let objectStore = DB.transaction('citas').objectStore('citas');

            //esto retorna una peticion que se abre con: openCursor
            //openCursor: abre el cursor para comezar a recorrer los registros
            objectStore.openCursor().onsuccess = function(e) {
                //Cursor se va a ubicar en el registro indicado para acceder a los datos 
                    let cursor = e.target.result;
                // console.log(cursor);

                if(cursor) {
                    let citaHTML = document.createElement('li');
                    // le damos un Id personalizado de esos que comienzan con data. y este va a ser el key (que es el que se estara incrementando por cada registro linea 45)
                    citaHTML.setAttribute('data-cita-id', cursor.value.key);
                    citaHTML.classList.add('list-group-item');

                    citaHTML.innerHTML = `
                        <p class="font-weight-bold">Mascota: <span class="font-weight-normal">${cursor.value.mascota}</span></p>
                        <p class="font-weight-bold">Cliente: <span class="font-weight-normal">${cursor.value.cliente}</span></p>
                        <p class="font-weight-bold">Teléfono: <span class="font-weight-normal">${cursor.value.telefono}</span></p>
                        <p class="font-weight-bold">Fecha: <span class="font-weight-normal">${cursor.value.fecha}</span></p>
                        <p class="font-weight-bold">Hora: <span class="font-weight-normal">${cursor.value.hora}</span></p>
                        <p class="font-weight-bold">Síntomas: <span class="font-weight-normal">${cursor.value.sintomas}</span></p>
                        
                    `;

                    //Boton de borrar
                    const botonBorrar = document.createElement('button');
                    botonBorrar.classList.add('borrar', 'btn', 'btn-danger');
                    botonBorrar.innerHTML = '<span aria-hidden="true">X</span> Borrar';
                    botonBorrar.onclick = borrarCita;
                    citaHTML.appendChild(botonBorrar);

                    // append en el padre.
                    citas.appendChild(citaHTML);

                    //una vez que terminamos tenemos que decirle al cursor que continue en caso de que tengamos mas regitros los siga contando. 
                    //Consultar los proximos registros
                    cursor.continue();

                }else {
                    if(!citas.firstChild){
                        //cuando no hay registros
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

            function borrarCita(e) {
                let citaID = Number(e.target.parentElement.getAttribute('data-cita-id'));

                //Para eliminarlo del IndexedDB
                //en IndexedDB se utilizan las transacciones
                let transaction = DB.transaction(['citas'], 'readwrite');
                let objectStore = transaction.objectStore('citas');
        
                let peticion = objectStore.delete(citaID);

                //para eliminar del DOM
                transaction.oncomplete = () => {
                    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
                    console.log(`Se elimino la cita con el Id: ${citaID} `);

                    if(!citas.firstChild){
                        //cuando no hay registros
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
}
</script>

<style scoped src="../CSS/styles.css"></style> 