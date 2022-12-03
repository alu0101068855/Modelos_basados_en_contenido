# Sistemas de recomendación: Modelos basados en contenido

### Grupo:
- Marcos Jesús Santana Ramos (alu0101033471)
- Carlos Pío Reyes (alu0101132945)
- Héctor Abreu Acosta (alu0101068855)
---
### Objetivo de la práctica

El objetivo de la práctica es implementar un sistema de recomendación siguiendo el modelo basado en el contenido.


---

### Archivos necesarios
Para esta práctica contamos con 3 ficheros aparte del programa principal:
- Fichero de texto plano. Cada documento viene representado en una línea del fichero.
- Fichero de palabras de parada o stop-words, a descartar en el proceso de recomendación.
- Fichero de lematización de términos.

#### Ejemplo de fichero
```
Aromas include tropical fruit, broom, brimstone and dried herb. The palate isn't overly expressive, offering unripened apple, citrus and dried sage alongside brisk acidity.
This is ripe and fruity, a wine that is smooth while still structured. Firm tannins are filled out with juicy red berry fruits and freshened with acidity. It's already drinkable, although it will certainly be better from 2016.
Tart and snappy, the flavors of lime flesh and rind dominate. Some green pineapple pokes through, with crisp acidity underscoring the flavors. The wine was all stainless-steel fermented.
Pineapple rind, lemon pith and orange blossom start off the aromas. The palate is a bit more opulent, with notes of honey-drizzled guava and mango giving way to a slightly astringent, semidry finish.
Much like the regular bottling from 2012, this comes across as rather rough and tannic, with rustic, earthy, herbal characteristics. Nonetheless, if you think of it as a pleasantly unfussy country wine, it's a good companion to a hearty winter stew.
Blackberry and raspberry aromas show a typical Navarran whiff of green herbs and, in this case, horseradish. In the mouth, this is fairly full bodied, with tomatoey acidity. Spicy, herbal flavors complement dark plum fruit, while the finish is fresh but grabby.
Here's a bright, informal red that opens with aromas of candied berry, white pepper and savory herb that carry over to the palate. It's balanced with fresh acidity and soft tannins.
This dry and restrained wine offers spice in profusion. Balanced with acidity and a firm texture, it's very much for food.
Savory dried thyme notes accent sunnier flavors of preserved peach in this brisk, off-dry wine. It's fruity and fresh, with an elegant, sprightly footprint.
This has great depth of flavor with its fresh apple and pear fruits and touch of spice. It's off dry while balanced with acidity and a crisp texture. Drink now.
```

#### Fragmento de ejemplo de fichero stop words
```
a
able
about
above
abroad
according
accordingly
across
actually
adj
after
afterwards
again
against
...
```

#### Fragmento de fichero lematizacion
```
{"is":"be","was":"be","does":"do","doing":"do","did":"do","done":"do","will":"will","willing":"will","would":"will","can":"can","could":"can","couth":"can","knows":"know","knowing":"know","knew":"know","known":"know","sees":"see","seeing":"see","saw":"see","seen":"see","may":"may","might":"may","gets":"get","getting":"get","got":"get","thinks":"think", ...
```
---
### Ejecución del programa

Para visualizar la información por consola, ejecutamos el comando:

```
$ node index.js -d ./doc_entrada/documents-01.txt -l ./lemat/corpus-en.txt -p ./stop-words/stop-words-en.txt 
```

Donde **-d** puede sustituirse por **--documento**, **-p** por **--palabra** y **-l** por **--lematizacion**, siguiendo el estilo [POSIX](https://nullprogram.com/blog/2020/08/01/)

A continuación podemos observar una imagen de ejemplo de uso:

![imagenEjemploUso](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/img/ejemploUso.png)

En caso de querer volcar la información en un fichero, escribimos `> nombreFichero.txt` al final del comando. Como por ejemplo:

```
$ node index.js -d ./doc_entrada/documents-01.txt -l ./lemat/corpus-en.txt -p ./stop-words/stop-words-en.txt > ficheroSalida.txt
```

Para comprobar el correcto funcionamiento de la práctica, se han empleado los ficheros proporcionados y se han almacenado los resultados en los ficheros de **Salida**.
| Fichero de entrada | Fichero de salida |
| ----------- | ----------- |
| [documents-01.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/documents-01.txt) | [Salida_Documento1.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/Salida_Documento1.txt) | 
| [documents-02.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/documents-02.txt) | [Salida_Documento2.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/Salida_Documento2.txt) | 
| [documents-03.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/documents-03.txt) | [Salida_Documento3.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/Salida_Documento3.txt) | 

---

### Descripción

### Lectura del fichero y eliminación de palabras (stopwords)

Mediante el uso de una clase **Gestor** se copian los valores de los ficheros y 
con la clase **StopWords** se almacenan las palabras que no se pretenden analizar como los artículos, conectores, preposiciones, etc.

En la clase **Matriz** se formatea el contenido del fichero a analizar.

```Javascript
for (var i = 1; i <= contenido.getNumbOfLines(); i++) {
  var filas = contenido.getLine(i);
  this.words = filas.split(' ');
  for (var i_1 = 0; i_1 != this.words.length; i_1++) {
    // Eliminar puntos, comas, etc
    this.words[i_1] = this.words[i_1].replace(this.regex, '');
    // Poner palabras en minuscula
    this.words[i_1] = this.words[i_1].toLowerCase();
  }
  // Elimina "palabras" vacías
  var index = this.words.indexOf('', 0);
  if (index > -1) {
    this.words.splice(index, 1);
  }
  this.matrixInicial[i - 1] = this.words;
}
```

Para eliminar las palabras de StopWords se realiza la función **DeleteStopWords** que analiza si la matriz de uso (matrixInicial) contiene palabras del vector de StopWords las sustituye por el valor **-** y se genera una nueva matriz ya sin las palabras a eliminar (**matrixSinStop**).

```Javascript
Matriz.prototype.deleteStopWords = function (stopW, file) {
  var vectorStop = stopW.getStopWords();
  // Mapeamos los valores y los cambiamos 
  var map = new Map(Object.entries(JSON.parse(file)));
  for (var i = 0; i < this.matrixInicial.length; i++) {
    for (var j = 0; j < this.matrixInicial[i].length; j++) {
      if (map.has(this.matrixInicial[i][j])) {
        this.matrixInicial[i][j] = String(map.get(this.matrixInicial[i][j]));
      }
    }
  }
  for (var i = 0; i < this.matrixInicial.length; i++) {
    var fila = [];
    for (var j = 0; j < this.matrixInicial[i].length; j++) {
      for (var k = 0; k < stopW.getStopWordsLength(); k++) {
        if (this.matrixInicial[i][j] === vectorStop[k]) {
          this.matrixInicial[i][j] = '-';
        }
      }
      if (this.matrixInicial[i][j] != '-') {
        fila.push(this.matrixInicial[i][j]);
      }
    }
    this.matrixSinStop.push(fila);
  }
};
```

Para almacenar un vector de las palabras únicas del documento, se utiliza la función **sinRepetir()** que almacena en **unicos** dichos valores. Este vector se utiliza en el calcuo de lso valores TF, IDF y TF-IDF.

```javascript
Matriz.prototype.sinRepetir = function () {
  this.unicos.push(this.matrixSinStop[0][0]);
  var repetido = 0;
  for (var i = 0; i < this.matrixSinStop.length; i++) {
    for (var j = 0; j < this.matrixSinStop[i].length; j++) {
      for (var k = 0; k < this.unicos.length; k++) {
        if (this.matrixSinStop[i][j] == this.unicos[k]) {
          repetido++;
        }
      }
      if (repetido == 0) {
        this.unicos.push(this.matrixSinStop[i][j]);
      }
      repetido = 0;
    }
  }
  };
```

### Método para almacenar TF

El valor TF ("Term Frecuency") se calcula en base a la cantidad de veces que aparece una palabra en la matriz **matrixSinStop**. Para ello se crea la variable **auxWord** que almacena dicha palabra y el numero de veces que se encuentra en un documento. Los valores son almacenados en la variable **vectorTF**.

```Javascript
Matriz.prototype.calculoTF = function () {
  var _loop_1 = function (i) {
    var repetidos = {};
    var filaVectorTF = [];
    this_1.matrixSinStop[i].forEach(function (numero) {
      repetidos[numero] = (repetidos[numero] || 0) + 1;
      var auxWord = {
        word: numero,
        rep: repetidos[numero]
      };
      if (repetidos[numero] > 1) {
        for (var i_2 = 0; i_2 < filaVectorTF.length; i_2++) {
          if (numero == filaVectorTF[i_2].word && repetidos[numero] - 1 == filaVectorTF[i_2].rep) {
            filaVectorTF.splice(i_2, 1);
          }
        }
      }
      filaVectorTF.push(auxWord);
    });
    this_1.vectorTF.push(filaVectorTF);
  };
  var this_1 = this;
  for (var i = 0; i < this.matrixSinStop.length; i++) {
    _loop_1(i);
  }
};
```


### Método para almacenar IDF 

IDF ("Inverse Document Frequency") es la frecuencia con la que aparece el término en la colección de documentos.Los valores son almacenados en la variable **IDF**

```javascript
Matriz.prototype.calculoIDF = function () {
  var _this = this;
  var N = this.matrixSinStop.length;
  var dfX = [];
  var _loop_2 = function (i) {
  var contadorPalabraFila = [];
  var _loop_3 = function (j) {
  var contPalabra = 0;
  for (var k = 0; k < this_2.vectorTF.length; k++) {
    var palabraVecesFila = this_2.vectorTF[k].filter(function (palabra) { return palabra.word == _this.vectorTF[i][j].word; });
    if (palabraVecesFila.length > 0) {
      contPalabra++;
    }
  }
  contadorPalabraFila.push(contPalabra);
  };
  for (var j = 0; j < this_2.vectorTF[i].length; j++) {
    _loop_3(j);
  }
  dfX.push(contadorPalabraFila);
  };
  var this_2 = this;
  for (var i = 0; i < this.vectorTF.length; i++) {
    _loop_2(i);
  }
  for (var i = 0; i < dfX.length; i++) {
    var idfFila = [];
    for (var j = 0; j < dfX[i].length; j++) {
      idfFila.push(Number(Math.log10(N / dfX[i][j]).toFixed(3)));
    }
    this.IDF.push(idfFila);
  }
};
```
### Método para almacenar TF-IDF

El valor TF-IDF se calcula como el producto entre los valores TF e IDF y se almacena en **vectorTFIDF**

```javascript
Matriz.prototype.calculoTFIDF = function () {
  for (var i = 0; i < this.IDF.length; i++) {
    var filaTFIDF = [];
    for (var j = 0; j < this.IDF[i].length; j++) {
      filaTFIDF.push(this.vectorTF[i][j].rep * this.IDF[i][j]);
    }
    this.vectorTFIDF.push(filaTFIDF);
  }
};
```

### Cálculo de la Similitud

Finalmente para calcular la similitud entre documentos se ha generado visualmente una matriz con los documentos (valores en i y j) y sus similitudes almacenando su valores en la variable **matrixCoseno**.

```javascript 
Matriz.prototype.calculoSimilitudCoseno = function (doc1, doc2) {
  var numerador = 0;
  var denominadorIzq = 0;
  var denominadorDrch = 0;
  for (var i = 0; i < this.unicos.length; i++) {
    numerador += (this.matrizsimilitudDocumentos[doc1][i] * this.matrizsimilitudDocumentos[doc2][i]);
    denominadorIzq += Math.pow(this.matrizsimilitudDocumentos[doc1][i], 2);
    denominadorDrch += Math.pow(this.matrizsimilitudDocumentos[doc2][i], 2);
  }
  var denominador = Math.sqrt(denominadorDrch) * Math.sqrt(denominadorIzq);
  return Number((numerador / denominador).toFixed(3));
};

Matriz.prototype.MatrixCoseno = function () {
  for (var i = 0; i < this.matrixSinStop.length; i++) {
    var vectorAux = [];
    for (var j = 0; j < this.matrixSinStop.length; j++) {
      vectorAux.push(0);
    }
    this.matrixCoseno.push(vectorAux);
  }
  for (var i = 0; i < this.matrixCoseno.length; i++) {
    for (var j = 0; j < this.matrixCoseno[i].length; j++) {
      this.matrixCoseno[i][j] = this.calculoSimilitudCoseno(i, j);
    }
  }
};
```
