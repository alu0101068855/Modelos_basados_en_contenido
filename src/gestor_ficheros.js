"use strict";
exports.__esModule = true;
exports.Gestor = void 0;
var fs = require("fs");
var Gestor = /** @class */ (function () {
    function Gestor(fichero) {
        this.file = fichero;
        this.checkFile();
    }
    ;
    Gestor.prototype.checkFile = function () {
        if (fs.existsSync(this.file)) {
            this.fileContent = fs.readFileSync(this.file, 'utf8');
            this.textByLine = this.fileContent.split("\n");
            return true;
        }
        else {
            console.error("El archivo no existe");
            return false;
        }
    };
    Gestor.prototype.getContent = function () {
        return this.fileContent;
    };
    Gestor.prototype.getNumbOfLines = function () {
        return this.textByLine.length;
    };
    Gestor.prototype.printContent = function () {
        console.log(this.fileContent);
    };
    Gestor.prototype.readLine = function () {
        var i = 1;
        this.textByLine.forEach(function (element) {
            console.log("[".concat(i, "] ").concat(element));
            i++;
        });
    };
    Gestor.prototype.getLine = function (i) {
        if (i < 1 || i > this.textByLine.length) {
            return "Número de línea inválido";
        }
        else {
            i -= 1;
            return this.textByLine[i];
        }
    };
    return Gestor;
}());
exports.Gestor = Gestor;
