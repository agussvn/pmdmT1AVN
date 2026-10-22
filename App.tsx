import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from 'react-native';

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
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  //Helper cargar imagen fallback
  const obtenerImagen = (nombreImagen: string) => {
    return imagenesLocales[nombreImagen] || require("./assets/favicon.png");
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

  const precioTotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* CABECERA Y NAVEGACIÓN SUPERIOR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setPantallaActual('principal')}>
          <Text style={styles.navBtn}>Neon Gaming</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPantallaActual('carrito')}>
          <Text style={styles.navBtn}>
            🛒 Carrito ({carrito.reduce((a, b) => a + b.cantidad, 0)})
          </Text>
        </TouchableOpacity>
      </View>

{/* VISTA PRINCIPAL: CATÁLOGO Y BUSCADOR */}
      {pantallaActual === 'principal' && (
        <View style={{ flex: 1 }}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar (ej. juegos, consolas, PS5...)"
              placeholderTextColor="#888"
              value={busqueda}
              onChangeText={setBusqueda}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={ejecutarBusqueda}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Buscar</Text>
            </TouchableOpacity>
          </View>
       <FlatList
            data={productos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  setProductoSeleccionado(item);
                  setPantallaActual('detalle');
                }}
              >
                <Image source={obtenerImagen(item.imagen)} style={styles.cardImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.nombre}</Text>
                  <Text style={styles.badgeSeccion}>
                    Sección: {item.seccion.toUpperCase()} • {item.plataforma}
                  </Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.descripcion}
                  </Text>
                  <Text style={styles.cardPrice}>{item.precio.toFixed(2)} €</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

{/* VISTA DETALLE DEL PRODUCTO */}
      {pantallaActual === 'detalle' && productoSeleccionado && (
        <ScrollView style={styles.detailContainer}>
          <Image source={obtenerImagen(productoSeleccionado.imagen)} style={styles.detailImage} />
          <Text style={styles.detailTitle}>{productoSeleccionado.nombre}</Text>
          <Text style={styles.detailPrice}>{productoSeleccionado.precio.toFixed(2)} €</Text>
          <Text style={styles.detailLabel}>Sección: {productoSeleccionado.seccion.toUpperCase()}</Text>
          <Text style={styles.detailLabel}>Categoría: {productoSeleccionado.categoria}</Text>
          <Text style={styles.detailLabel}>Plataforma / Tipo: {productoSeleccionado.plataforma}</Text>
          <Text style={styles.detailLabel}>Stock disponible: {productoSeleccionado.stock} unidades</Text>
          <Text style={styles.detailDesc}>{productoSeleccionado.descripcion}</Text>

          <TouchableOpacity
            style={styles.addCartBtn}
            onPress={() => agregarAlCarrito(productoSeleccionado)}
          >
            <Text style={styles.btnText}>Añadir al Carrito</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* VISTA CARRITO */}
      {pantallaActual === 'carrito' && (
        <View style={{ flex: 1 }}>
          <FlatList
            data={carrito}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>El carrito está actualmente vacío.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={obtenerImagen(item.imagen)} style={{ width: 40, height: 40, marginRight: 10, borderRadius: 4 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.nombre}</Text>
                  <Text style={{ color: '#a855f7', fontWeight: 'bold' }}>{(item.precio * item.cantidad).toFixed(2)} €</Text>
                </View>
                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => cambiarCantidad(item.id, -1)}
                  >
                    <Text style={{ color: '#fff' }}>-</Text>
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 8, color: '#fff' }}>{item.cantidad}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => cambiarCantidad(item.id, 1)}
                  >
                    <Text style={{ color: '#fff' }}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => eliminarDelCarrito(item.id)}
                >
                  <Text style={{ color: '#fff' }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />