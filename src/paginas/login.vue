<template>
  <div>
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

            <form class="form_inicio">
            
                <div class="form_inicio--Parte1">
                    
                    <h3 class="form_inicio--titulo1">Inicie Sesion</h3>

                    <p class="form_inicio--requisito">

                        <span>*</span> <b>Ingrese su correo:</b>

                    </p>

                    <input type="email" id="correo" name="correo" class="form_inicio--correo" style="outline: none;" placeholder="Escriba el Correo aqui">

                    <p class="form_inicio--requisito2">

                        <span>*</span> <b>Ingrese su Contraseña:</b>

                    </p>

                    <input type="password" id="pass" name="contraseña" class="form_inicio--correo" style="outline: none;" placeholder="Escriba Su Contraseña aqui">
<!-- 
                    <p class="form_inicio--requisito2">

                        <span>*</span> <b>Seleccione Tipo de Usuario:</b>

                    </p>
                    <div class="Contenedor_selector">

                        <input type="radio" name="usuario_tipo" class="form_inicio--selector"> <label for="radio" class="selector">Veterinario</label>
                    
                    </div><div class="Contenedor_selector2">

                        <input type="radio" name="usuario_tipo" checked class="form_inicio--selector"> <label for="radio" class="selector">cliente</label>
                    
                    </div> -->
                   
                    <!-- Aqui esta el elemento vacio -->
                    <div class="error" id="error-login"></div>

                    <input type="button" name="iniciar" id="form_inicio--iniciar" class="form_inicio--iniciar">



                </div><div class="form_inicio--Parte2">
                    
                    <h3 class="form_inicio--titulo2">¿No tienes Cuenta?</h3>

                    <p class="form_inicio--requisito3"> No te preocupes! Ingresa tus datos para crear una nueva cuenta en Patita Animal!!</p>

                    <form>

                        <router-link to="/registro">
                          <input type="button" name="Registrate" value="Registrate" id="form_inicio--iniciar2" class="form_inicio--iniciar2">
                        </router-link>

                    </form>

                </div>

            </form>

        <!--</center>-->

    </div>
  </div>
</template>

<script>
    import { openDB, getObjectStore } from '../JavaScript/database.js';
    export default {
        mounted() {
            const router = this.$router;
            // const usuarioLoggeado = sessionStorage.get('usuario');
            // if (usuarioLoggeado && usuarioLoggeado.tipo_usuario != 'veterinario') {
            //     router.replace({ path: '/' });
            // }
            openDB();

            const form = document.querySelector('form'),
                correoUsuario = document.querySelector('#correo'),
                passUsuario = document.querySelector('#pass'),
                // Este es el elemento vacio para el mensaje de error
                error = document.querySelector('#error-login');

            
            const boton = document.getElementById('form_inicio--iniciar');
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
                        console.log('El usuario no está registrado.');
                    } else {
                        if (request.result.tipo_usuario === 'veterinario'){
                            if (request.result.primerLogin){
                                const data = request.result;
                                data.primerLogin = false;
                                data.contrasena = usuarioRegistrado.contrasena;
                                // Esto actualiza la DB
                                const updateVet = objectStore.put(data);
                                router.push({ path: '/veterinario' });
                            } else if (request.result.contrasena === usuarioRegistrado.contrasena) {
                                router.push({ path: '/veterinario' });
                            } else {
                                // Esto es para el mensaje de Error
                                error.innerHTML = 'Credenciales invalidas';
                            }
                        } else {
                            if (request.result.contrasena === usuarioRegistrado.contrasena) {
                                // Para mantener los datos en memoria
                                sessionStorage.setItem('usuario', request.result);
                                router.push({ path: '/agendar-cita' });
                            } else {
                                console.log('Credenciales invalidas');
                            }
                        }
                    }
                }
                request.onerror = (event) => {
                console.log('Ocurrio un error');
                } 
            }
            console.log('Cargado!');
        }
    };
</script>

<style scoped src="../CSS/formulario.css">

</style>