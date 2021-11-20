import { createApp } from 'vue'
import * as Router from 'vue-router'
import App from './App.vue'
import Home from './paginas/home.vue';
import Login from './paginas/login.vue';
import Registro from './paginas/registro.vue';
import Usuario from './paginas/usuario.vue';
import Veterinario from './paginas/veterinario.vue';
import AgendarCita from './paginas/agendarCita.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/inicio-sesion', component: Login },
  { path: '/registro', component: Registro },
  { path: '/veterinario', component: Veterinario },
  { path: '/usuario', component: Usuario },
  { path: '/agendar-cita', component: AgendarCita },
  { path: '/pago', component: App },
];

const router = Router.createRouter({
  history: Router.createWebHashHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
