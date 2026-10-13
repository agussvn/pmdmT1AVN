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

import productosData from "./src/data/productos.json";

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