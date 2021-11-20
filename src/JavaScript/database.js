export let db;

export const openDB = () => {
  let crearDB = indexedDB.open('veterinaria', 2);

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
      usuario.createIndex('direccion', 'direccion', {unique : false } );
      usuario.createIndex('telefono', 'telefono', {unique : false } );
      usuario.createIndex('tipo_usuario', 'tipo_usuario', {unique : false } );

      let cita = database.createObjectStore('cita', {keyPath: 'id_cita', autoIncrement: true } );
   
      cita.createIndex('id_mascota', 'id_mascota', {unique : false } );
      cita.createIndex('fecha', 'fecha', {unique : true } );
      cita.createIndex('id_veterinario', 'id_veterinario', {unique : false } );
      cita.createIndex('id_historialMedico', 'id_historialMedico', {unique : false } );

      let mascota = database.createObjectStore('mascota', {keyPath: 'id_mascota', autoIncrement: true } );
   
      mascota.createIndex('nombre', 'nombre', {unique : false } );
      mascota.createIndex('tipo', 'tipo', {unique : false } );
      mascota.createIndex('raza', 'raza', {unique : false } );
      mascota.createIndex('edad', 'edad', {unique : false } );    
      mascota.createIndex('id_dueno', 'id_dueno', {unique : false } );          

      let historialMedico = database.createObjectStore('historialMedico', {keyPath: 'id_historialMedico', autoIncrement: true } );
   
      historialMedico.createIndex('id_mascota', 'id_mascota', {unique : false } );
      historialMedico.createIndex('examenes', 'examenes', {unique : false } );
      historialMedico.createIndex('diagnostico', 'diagnostico', {unique : false } );    
      
      let factura = database.createObjectStore('factura', {keyPath: 'id_factura', autoIncrement: true } );
   
      factura.createIndex('id_historialMedico', 'id_historialMedico', {unique : false } );
      factura.createIndex('costo_total', 'costo_total', {unique : false } );

      console.log('base de datos creada y lista');
   }
}

export const getObjectStore = (store_name, mode) => {
  let transaccion = db.transaction(store_name, mode);
  transaccion.onerror = (event) => {
    console.log('Ha ocurrido un error:', event);
  }
  return transaccion.objectStore(store_name);
}