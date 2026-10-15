import React, { useState} from "react";
import {
  StyleSheet,
  Text,
  View,
  Flatlist,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from "react-native";

//Importamos datos de productos

import productosData from "./src/data/productos.json";

//Mapa de imágenes locales
const imagenesLocales: Record<string, any> ={
  'cascos.jpg': require('./assets/imgProductos/cascos.jpg'),
  'FIFA18.jpg': require('./assets/imgProductos/FIFA18.jpg'),
  'fortnite.jpg': require('./assets/imgProductos/fortnite.jpg'),
  'GTA6.webp': require('./assets/imgProductos/GTA6.webp'),
  'Helldivers2.jpg': require('./assets/imgProductos/Helldivers2.jpg'),
  'monitorSamSung.jpg': require('./assets/imgProductos/monitorSamSung.jpg'),
  'PS5 mando.webp': require('./assets/imgProductos/PS5 mando.webp'),
  'PS5.jpg': require('./assets/imgProductos/PS5.jpg'),
  'raton g prox2.png': require('./assets/imgProductos/raton g prox2.png'),
  'switch.jpg': require('./assets/imgProductos/switch.jpg'),
  'tarjetaSteam50.png': require('./assets/imgProductos/tarjetaSteam50.png'),
  'tecladoApex.webp': require('./assets/imgProductos/tecladoApex.webp'),
};

//Interfaces typescript
interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  seccion: string;
  categoria: string;
  plataforma: string;
  stock: number;
  imagen: string;
}

interface ItemCarrito extends Producto {
  cantidad: number;
}

//App
export default function App(){
  //Estados
  const [pantallaActual, setPantallaActual] = useState<"principal" | "detalle" | "carrito">("principal");
  const [busqueda, setBusqueda] = useState<string>("");
  const [productos, setProductos] = useState<Producto[]>(productosData);
  const[productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  //Helper cargar imagen fallback
  const obtenerImagen = (nombreImagen: string) => {
    return imagenesLocales[nombreImagen] || require("./assets/icon.png");
  };
  //Lógica de búsqueda

  const ejecutarBusqueda = () => {
    const texto = busqueda.toLowerCase().trim();
    if(texto === ""){
      setProductos(productosData);
    } else {
      const filtrados = productosData.filter(
        (p) =>
          p.nombre.toLowerCase().includes(texto) ||
          p.descripcion.toLowerCase().includes(texto) ||
          p.plataforma.toLowerCase().includes(texto) ||
          p.seccion.toLowerCase().includes(texto) ||
          p.categoria.toLowerCase().includes(texto) 
      );
      setProductos(filtrados);
    }
  };

  //Lógica carrito
  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    Alert.alert('¡Añadido!', `${producto.nombre} se ha añadido al carrito.`);
};

const cambiarCantidad = (id: string, cambio: number) => {
  setCarrito((prev)=>
  prev.map((item) => {
    if(item.id === id) {
      const nuevaCantidad = item.cantidad + cambio;
      return nuevaCantidad > 0 ? {...item, cantidad: nuevaCantidad } : item;
    }
    return item;
  })
);
};

const eliminarDelCarrito = (id: string) => {
    Alert.alert('Confirmar eliminación', '¿Seguro que deseas eliminar este producto del carrito?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => setCarrito((prev) => prev.filter((item) => item.id !== id)),
      },
    ]);
  };

  const vaciarCarrito = () => {
    if(carrito.length === 0) return;
    Alert.alert("Confirmar vaciado","Seguro que deseas vaciar todo el carrito?", [
      { text: "Cancelar", style: "cancel"},
      {
        text: "Vaciar",
        style: "destructive",
        onPress: () => setCarrito([]),
      },
    ]);
  };