from flask import Flask, jsonify
from flask_cors import CORS
from abc import ABC, abstractmethod 

app = Flask(__name__)
CORS(app)
class Bebida(ABC):
    @abstractmethod
    def preparar(self):
        pass

class doubleShot(Bebida):
    def preparar(self):
        return "Preparando DoubleShot: Granos de la casa y agua caliente."

class flatWhite(Bebida): 
    def preparar(self):
        return "Preparando un FlatWhite: Te negro con especias y leche."

class matchaLatte(Bebida):
    def preparar(self):
        return "Preparando Matcha Latte: Espresso con leche vaporizada cremosa."

class Barista(ABC):
    @abstractmethod
    def crear_bebida(self):
        pass

class BaristaDoubleShot(Barista):
    def crear_bebida(self):
        return doubleShot()

class BaristaFlatWhite(Barista):
    def crear_bebida(self):
        return flatWhite()

class BaristaMatchaLatte(Barista):
    def crear_bebida(self):
        return matchaLatte()

@app.route('/pedir/<tipo>')
def realizar_pedido(tipo):
    fabricas = {
        "double-shot": BaristaDoubleShot(), 
        "flat-white": BaristaFlatWhite(),      
        "matcha-latte": BaristaMatchaLatte()
    }
    
    barista = fabricas.get(tipo.lower())
    if barista:
        bebida = barista.crear_bebida()
        return jsonify({
            "status": "success",
            "mensaje": bebida.preparar(),
        })
    return jsonify({"error": "Bebida no disponible"}), 404
    
    barista = fabricas.get(tipo.lower())
    
    if barista:
        bebida = barista.crear_bebida()
        return jsonify({
            "status": "success",
            "mensaje": bebida.preparar(),
        })
    
    return jsonify({"error": "Bebida no disponible en el menu"}), 404

def test_laboratorio():
    """Prueba que el Barista cree el producto correcto según el patrón fábrica."""
    fabrica = BaristaDoubleShot() 
    producto = fabrica.crear_bebida()
        
    assert isinstance(producto, doubleShot)
    print("\n" + "="*35)
    print(" PRUEBA DE LABORATORIO EXITOSA")
    print(f" Creador: BaristaDoubleShot")
    print(f" Producto: {type(producto).__name__}")
    print(f" Resultado: {producto.preparar()}")
    print("="*35 + "\n")


if __name__ == "__main__":
    #test_laboratorio()
    app.run(debug=True, port=5000)