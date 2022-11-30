"use strict";
exports.__esModule = true;
var gestor_ficheros_1 = require("./gestor_ficheros");
var matrizz_1 = require("./matrizz");
var stopWords_1 = require("./stopWords");
function help() {
    console.log("Modo de empleo: node index.js [-d][--documento] fichero.txt [-p][--palabra] stopWords.txt [-l][--lematizacion] ficheroLematizacion.txt");
    console.log("Pruebe 'node index.js --help' para más información");
}
function mensaje_ayuda() {
    console.log("Practica : Sistemas de recomendacion. Modelos basados en contenidos");
    console.log("Utilidad que recibe un fichero con una serie de documentos y");
    console.log("genera valores de pesos (frecuencias) y similitudes de sus términos");
}
if (process.argv.length == 2 || process.argv.length != 8) {
    help();
}
if (process.argv.length == 8) {
    if (process.argv[2] == "-h" || process.argv[2] == "--help") {
        mensaje_ayuda();
    }
    else {
        var archivoDocumento = void 0, archivoLematizacion = void 0, archivoPalabras = void 0;
        for (var i = 1; i != process.argv.length; i++) {
            if (process.argv[i] == '-d' || process.argv[i] == '--documento') {
                archivoDocumento = process.argv[i + 1];
            }
            if (process.argv[i] == '-p' || process.argv[i] == '--palabra') {
                archivoPalabras = process.argv[i + 1];
            }
            if (process.argv[i] == '-l' || process.argv[i] == '--lematizacion') {
                archivoLematizacion = process.argv[i + 1];
            }
        }
        if (archivoDocumento == undefined || archivoPalabras == undefined || archivoLematizacion == undefined) {
            help();
        }
        else {
            var gestorejemplo = new gestor_ficheros_1.Gestor(archivoDocumento);
            var gestorcambio = new gestor_ficheros_1.Gestor(archivoLematizacion);
            var gestorStop = new gestor_ficheros_1.Gestor(archivoPalabras);
            var matrizejemplo = new matrizz_1.Matriz(gestorejemplo);
            var stopWords = new stopWords_1.StopWords(gestorStop);
            var contenidoCambio = gestorcambio.getContent();
            matrizejemplo.deleteStopWords(stopWords, contenidoCambio);
            matrizejemplo.sinRepetir();
            matrizejemplo.calculoTF();
            matrizejemplo.calculoIDF();
            matrizejemplo.calculoTFIDF();
            matrizejemplo.showMatrixSimilitud();
            matrizejemplo.similitudDocumentos();
            matrizejemplo.MatrixCoseno();
            matrizejemplo.showMatrixCoseno();
        }
    }
}
