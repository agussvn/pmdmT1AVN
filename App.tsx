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

// Importamos datos de productos
import productosData from "./src/data/productos.json";

// Mapa de imágenes locales
const imagenesLocales: Record<string, any> = {
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

// Interfaces TypeScript
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

// App
export default function App() {
  // Estados
  const [pantallaActual, setPantallaActual] = useState<"principal" | "detalle" | "carrito">("principal");
  const [busqueda, setBusqueda] = useState<string>("");
  const [productos, setProductos] = useState<Producto[]>(productosData);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  
  // Estado para resaltar la categoría seleccionada 
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("TODOS");

  // === AÑADIDO: ESTADO Y LÓGICA DE FAVORITOS ===
  const [favoritos, setFavoritos] = useState<string[]>([]);

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Helper cargar imagen fallback
  const obtenerImagen = (nombreImagen: string) => {
    return imagenesLocales[nombreImagen] || require("./assets/favicon.png");
  };

  // Lógica de búsqueda
  const ejecutarBusqueda = () => {
    const texto = busqueda.toLowerCase().trim();
    setCategoriaSeleccionada("TODOS");
    if (texto === "") {
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

  // Lógica carrito
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
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + cambio;
          return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
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
    if (carrito.length === 0) return;
    Alert.alert("Confirmar vaciado", "Seguro que deseas vaciar todo el carrito?", [
      { text: "Cancelar", style: "cancel" },
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
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setPantallaActual('principal')}>
          <Image 
            source={require('./assets/favicon.png')} 
            style={{ width: 28, height: 28, marginRight: 8, borderRadius: 6 }} 
          />
          <Text style={styles.navBtn}>Neon Gaming Store</Text>
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

          {/* FILTROS RÁPIDOS POR CATEGORÍA (CHIPS)*/}
          <View style={{ height: 42, marginBottom: 5 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
              {['TODOS', 'CONSOLAS', 'PERIFERICOS', 'JUEGOS', 'DIGITAL', 'ACCESORIOS'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chipBtn,
                    categoriaSeleccionada === cat && styles.chipBtnActive
                  ]}
                  onPress={() => {
                    setCategoriaSeleccionada(cat);
                    setBusqueda("");
                    if (cat === 'TODOS') {
                      setProductos(productosData);
                    } else {
                      const filtrados = productosData.filter(
                        (p) => p.seccion.toUpperCase() === cat || p.categoria.toUpperCase() === cat
                      );
                      setProductos(filtrados);
                    }
                  }}
                >
                  <Text style={[styles.chipText, categoriaSeleccionada === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
                  {/* === AÑADIDO: TITULO + BOTÓN CORAZÓN (❤️) === */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.cardTitle, { flex: 1 }]}>{item.nombre}</Text>
                    <TouchableOpacity onPress={() => toggleFavorito(item.id)} style={{ paddingLeft: 6 }}>
                      <Text style={{ fontSize: 18 }}>
                        {favoritos.includes(item.id) ? '❤️' : '🤍'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.badgeSeccion}>
                    Sección: {item.seccion.toUpperCase()} • {item.plataforma}
                  </Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.descripcion}
                  </Text>
                  <Text style={styles.cardPrice}>{item.precio.toFixed(2)} €</Text>

                  {item.stock <= 3 && (
                    <Text style={styles.lowStockBadge}>⚠️ ¡Últimas {item.stock} unidades!</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* VISTA DETALLE DEL PRODUCTO */}
      {pantallaActual === 'detalle' && productoSeleccionado && (
        <ScrollView style={styles.detailContainer}>
          {/* BOTÓN VOLVER AL CATÁLOGO */}
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => setPantallaActual('principal')}
          >
            <Text style={styles.backBtnText}>← Volver al catálogo</Text>
          </TouchableOpacity>

          <Image source={obtenerImagen(productoSeleccionado.imagen)} style={styles.detailImage} />

          {/* === AÑADIDO: TITULO DETALLE + BOTÓN CORAZÓN (❤️) === */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.detailTitle, { flex: 1 }]}>{productoSeleccionado.nombre}</Text>
            <TouchableOpacity onPress={() => toggleFavorito(productoSeleccionado.id)}>
              <Text style={{ fontSize: 24 }}>
                {favoritos.includes(productoSeleccionado.id) ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>

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

          {carrito.length > 0 && (
            <View style={styles.cartFooter}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Gastos de envío:</Text>
                <Text style={{ color: precioTotal >= 50 ? '#22c55e' : '#f3e8ff', fontWeight: 'bold' }}>
                  {precioTotal >= 50 ? '¡GRATIS!' : '4.99 €'}
                </Text>
              </View>

              <Text style={styles.totalText}>
                Total a pagar: {(precioTotal + (precioTotal >= 50 ? 0 : 4.99)).toFixed(2)} €
              </Text>

              <TouchableOpacity 
                style={styles.checkoutBtn} 
                onPress={() => Alert.alert('¡Pedido realizado!', 'Gracias por tu compra en Neon Gaming Store.')}
              >
                <Text style={styles.checkoutBtnText}>💳 PROCESAR PAGO</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.clearBtn} onPress={vaciarCarrito}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Vaciar Carrito</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0c1b', paddingTop: 30 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1a1528',
    borderBottomWidth: 1,
    borderBottomColor: '#3b2d54',
  },
  navBtn: { fontSize: 16, fontWeight: 'bold', color: '#c084fc' },
  searchContainer: { flexDirection: 'row', padding: 10 },
  searchInput: {
    flex: 1,
    backgroundColor: '#1a1528',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#3b2d54',
  },
  searchBtn: {
    backgroundColor: '#8b5cf6',
    padding: 10,
    marginLeft: 5,
    borderRadius: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1a1528',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2e2342',
  },
  cardImage: { width: 70, height: 70, marginRight: 10, borderRadius: 5 },
  cardTitle: { fontWeight: 'bold', fontSize: 15, color: '#f3e8ff' },
  badgeSeccion: {
    color: '#c084fc',
    fontWeight: '600',
    fontSize: 11,
    marginVertical: 2,
  },
  cardDesc: { color: '#a799c3', fontSize: 12 },
  cardPrice: { fontWeight: 'bold', color: '#a855f7', marginTop: 4 },
  detailContainer: { padding: 20 },
  detailImage: { width: '100%', height: 180, resizeMode: 'contain' },
  detailTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 10, color: '#f3e8ff' },
  detailPrice: { fontSize: 20, color: '#a855f7', fontWeight: 'bold' },
  detailLabel: { marginTop: 5, color: '#c4b5fd', fontSize: 14 },
  detailDesc: { marginVertical: 15, fontSize: 14, color: '#d8b4fe' },
  addCartBtn: {
    backgroundColor: '#8b5cf6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1528',
    padding: 12,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2e2342',
  },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  qtyBtn: { backgroundColor: '#3b2d54', padding: 5, borderRadius: 5, width: 25, alignItems: 'center' },
  deleteBtn: { backgroundColor: '#dc3545', padding: 8, borderRadius: 5 },
  cartFooter: { padding: 20, backgroundColor: '#1a1528', borderTopWidth: 1, borderColor: '#3b2d54' },
  totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#f3e8ff' },
  clearBtn: { backgroundColor: '#dc3545', padding: 12, borderRadius: 8, alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#a799c3' },

  lowStockBadge: { 
    color: '#ef4444', 
    fontSize: 11, 
    fontWeight: 'bold', 
    marginTop: 4 
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  summaryLabel: { 
    color: '#a799c3', 
    fontSize: 14 
  },
  checkoutBtn: { 
    backgroundColor: '#22c55e', 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 10, 
    marginTop: 8 
  },
  checkoutBtnText: { 
    color: '#000', 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  // === ESTILOS PARA EL BOTÓN VOLVER Y LOS CHIPS ===
  backBtn: { marginBottom: 10, paddingVertical: 6 },
  backBtnText: { color: '#c084fc', fontSize: 14, fontWeight: 'bold' },
  categoriesContainer: { paddingHorizontal: 10, alignItems: 'center' },
  chipBtn: { 
    backgroundColor: '#1a1528', 
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    borderRadius: 20, 
    marginRight: 8, 
    borderWidth: 1, 
    borderColor: '#3b2d54' 
  },
  chipBtnActive: { 
    backgroundColor: '#8b5cf6', 
    borderColor: '#c084fc' 
  },
  chipText: { color: '#a799c3', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
});