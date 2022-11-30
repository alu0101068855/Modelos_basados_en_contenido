import { Gestor } from './gestor_ficheros'
import { MatrizC } from './matrizc';
import { Matriz }  from './matrizz'
import { StopWords }  from './stopWords'

function help() {
  console.log("Modo de empleo: node index.js [-d][--documento] fichero.txt [-p][--palabra] stopWords.txt [-l][--lematizacion] ficheroLematizacion.txt");
  console.log("Pruebe 'node index.js --help' para más información");
}

function mensaje_ayuda () {
  console.log("Practica : Sistemas de recomendacion. Modelos basados en contenidos");
  console.log("Utilidad que recibe un fichero con una serie de documentos y");
  console.log("genera valores de pesos (frecuencias) y similitudes de sus términos");
}

if (process.argv.length == 3 && (process.argv[2] == "-h" || process.argv[2] == "--help") ){
  mensaje_ayuda();
} else {
  if (process.argv.length == 2 || process.argv.length != 8){
    help();
  } 
}

if (process.argv.length == 8){
  let archivoDocumento: string, archivoLematizacion: string, archivoPalabras: string;

  for(let i = 2; i != process.argv.length; i++){
    if(process.argv[i] == '-d' || process.argv[i] == '--documento'){
      archivoDocumento = process.argv[i+1];
    }
    if(process.argv[i] == '-p' || process.argv[i] == '--palabra'){
      archivoPalabras = process.argv[i+1];
    }
    if(process.argv[i] == '-l' || process.argv[i] == '--lematizacion'){
      archivoLematizacion = process.argv[i+1];
    }
  }
  if (archivoDocumento == undefined || archivoPalabras == undefined || archivoLematizacion == undefined){
    help();
  } else {
    let gestorejemplo = new Gestor(archivoDocumento);
    let gestorcambio = new Gestor(archivoLematizacion);
    let gestorStop = new Gestor(archivoPalabras);

    let matrizejemplo = new Matriz(gestorejemplo);
    let stopWords = new StopWords(gestorStop);
    
    let contenidoCambio = gestorcambio.getContent();
    
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