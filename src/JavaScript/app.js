let DB;

document.addEventListener('DOMContentLoaded', () => {
    let crearDB = window.indexedDB.open('veterinaria', 1);

    crearDB.onerror = function() {
        console.log('error')
    }

    crearDB.onsuccess = function() {
        DB = crearDB.result;        
    }

    crearDB.onupgradeneeded = function(e) {
        let db = e.target.result;
       
        let usuario = db.createObjectStore('usuario', {keyPath: 'id_usuario', autoIncrement: true } );
     
        usuario.createIndex('correo', 'correo', {unique : true } );
        usuario.createIndex('contrasena', 'contrasena', {unique : false } );
        usuario.createIndex('nombre', 'nombre', {unique : false } );
        usuario.createIndex('apellido', 'apellido', {unique : false } );
        usuario.createIndex('direccion', 'direccion', {unique : false } );
        usuario.createIndex('telefono', 'telefono', {unique : false } );
        usuario.createIndex('tipo_usuario', 'tipo_usuario', {unique : false } );

        let cita = db.createObjectStore('cita', {keyPath: 'id_cita', autoIncrement: true } );
     
        cita.createIndex('id_mascota', 'id_mascota', {unique : false } );
        cita.createIndex('fecha', 'fecha', {unique : true } );
        cita.createIndex('id_veterinario', 'id_veterinario', {unique : false } );
        cita.createIndex('id_historialMedico', 'id_historialMedico', {unique : false } );

        let mascota = db.createObjectStore('mascota', {keyPath: 'id_mascota', autoIncrement: true } );
     
        mascota.createIndex('nombre', 'nombre', {unique : false } );
        mascota.createIndex('tipo', 'tipo', {unique : false } );
        mascota.createIndex('raza', 'raza', {unique : false } );
        mascota.createIndex('edad', 'edad', {unique : false } );    
        mascota.createIndex('id_dueno', 'id_dueno', {unique : false } );          

        let historialMedico = db.createObjectStore('historialMedico', {keyPath: 'id_historialMedico', autoIncrement: true } );
     
        historialMedico.createIndex('id_mascota', 'id_mascota', {unique : false } );
        historialMedico.createIndex('examenes', 'examenes', {unique : false } );
        historialMedico.createIndex('diagnostico', 'diagnostico', {unique : false } );    
        
        let factura = db.createObjectStore('factura', {keyPath: 'id_factura', autoIncrement: true } );
     
        factura.createIndex('id_historialMedico', 'id_historialMedico', {unique : false } );
        factura.createIndex('costo_total', 'costo_total', {unique : false } );

        console.log('base de datos creada y lista');
        
     }
 

})
