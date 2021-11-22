<script setup>
import { openDB, getObjectStore } from '../JavaScript/database.js';
</script>

<template>
<div class = "fondo_formulario">

    <div class="barra">
        <nav>
            <div class="navbar">
                <ul class="options">

                    <li><a href="../index.html"><input type="button" Value="Inicio" class="Boton--cabecera"></a></li>
                    <li><a href="../index.html #servicios"><input type="button" Value="Servicios" class="Boton--cabecera"></a></li>
                    <li><a href="../index.html #galeria"><input type="button" Value="Galeria" class="Boton--cabecera"></a></li>
                    <li><a href="../index.html #contacto"><input type="button" Value="Contacto" class="Boton--cabecera"></a></li>
                    <li><a href="login.html" class="login">INICIAR SESIÓN</a></li>

                </ul>
            </div>
        </nav>
    </div>

    

        <!--<center>-->

            <form class="form_registro">
            
                <div class="form_registro--Parte1">

                  <h3 class="form_inicio--titulo1">Inicie Sesion</h3>

                  <router-link to="/inicio-sesion"><input type="button" name="iniciar" class="form_registro--iniciar" value="Iniciar"></router-link>
                  
                </div>

                <div class="form_registro--Parte2">
                    
                    <h3 class="form_registro--titulo2">Registra Tus Datos:</h3>

                    <input type="text" name="nombre" id= "nombre" class="form_registro--nombre" style="outline: none;" placeholder="Nombre">

                    <input type="text" name="apellido" id= "apellido" class="form_registro--nombre" style="outline: none;" placeholder="Apellido">

                    <input type="text" name="telefono" id= "telefono" class="form_registro--nombre" style="outline: none;" placeholder="Telefono">

                    <input type="text" name="correo" id= "correo" class="form_registro--nombre" style="outline: none;" placeholder="Correo">

                    <input type="password" name="pass" id= "pass" class="form_registro--nombre" style="outline: none;" placeholder="Contraseña">

                    <input type="password" name="confirmar-contrasena" id= "confirmar-contrasena" class="form_registro--nombre" style="outline: none;" placeholder="Confirme su Contraseña">
                    
                    <!-- <h3 class="Titulo_selector">Tipo De usuario</h3>

                    <div class="Contenedor_selector">

                        <input type="radio" name="usuario_tipo" id= "tipo-usuario" class="form_inicio--selector"> <label for="radio" class="selector">Veterinario</label>
                    
                    </div><div class="Contenedor_selector2">

                        <input type="radio" name="usuario_tipo" checked class="form_inicio--selector"> <label for="radio" class="selector">cliente</label>
                    
                    </div> -->

                    <a id="form_registro--Registrar"><input type="button" name="Registrate" value="Registrate" class="form_registro--Registrar"></a>

                </div>

            </form>

        <!--</center>-->

    </div>
</template>

<script>
    import { openDB, getObjectStore } from '../JavaScript/database.js';
    export default {
        mounted() {
            const router = this.$router;
            openDB();

            const form = document.querySelector('form'),
                nombreUsuario = document.querySelector('#nombre'),
                apellidoUsuario = document.querySelector('#apellido'),
                telefonoUsuario = document.querySelector('#telefono'),
                //direccionUsuario = document.querySelector('#direccion'),
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
                    //direccion : direccionUsuario.value,
                    correo : correoUsuario.value,
                    contrasena : passUsuario.value,
                    tipo_usuario : 'cliente',
                    primerLogin : false,
                }

                const request = getObjectStore('usuario', 'readwrite').add(nuevoUsuario);
                request.onsuccess = (event) => {
                    router.push({ path: '/agendar-cita '});
                }
                request.onerror = (event) => {
                    console.log('Ha ocurrido un Error');
                }
            }
        }
    };
</script>

<style scoped src="../CSS/formulario.css">

</style>