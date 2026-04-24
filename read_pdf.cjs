const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('WAUPpresentacion.pdf');

pdf(dataBuffer).then(function(data) {
    console.log("=== INICIO DEL PDF ===");
    console.log(data.text);
    console.log("=== FIN DEL PDF ===");
}).catch(function(error) {
    console.error("Error al leer el PDF:", error);
});
