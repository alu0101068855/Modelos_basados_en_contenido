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

Para visualizar la información por consola, ejecutamos el comando una vez estemos situados en la ruta **/src**:

```
/src$ node index.js -d documento.txt -p stop-words.txt -l lematizacion.txt
```

Donde **-d** puede sustituirse por **--documento**, **-p** por **--palabra** y **-l** por **--lematizacion**, siguiendo el estilo [POSIX](https://nullprogram.com/blog/2020/08/01/)

A continuación podemos observar una imagen de ejemplo de uso:

![imagenEjemploUso](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/img/ejemploUso.png)

En caso de querer volcar la información en un fichero, escribimos `> nombreFichero.txt` al final del comando. Como por ejemplo:

```
/src$ node index.js -d documento.txt -p stop-words.txt -l lematizacion.txt > ficheroSalida.txt
```

Para comprobar el correcto funcionamiento de la práctica, se han empleado los ficheros proporcionados:
| Fichero de entrada | Fichero de salida |
| ----------- | ----------- |
| [documents-01.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/documents-01.txt) | [Salida_Documento1.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/Salida_Documento1.txt) | 
| [documents-02.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/documents-02.txt) | [Salida_Documento2.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/Salida_Documento2.txt) | 
| [documents-03.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/documents-03.txt) | [Salida_Documento3.txt](https://github.com/alu0101068855/Modelos_basados_en_contenido/blob/main/src/Salida_Documento3.txt) | 

### Descripción
