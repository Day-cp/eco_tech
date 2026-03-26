import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//  Auth para React Native
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyCIH0V1VNymHwWH0ky-aZAariVgkX5eXng",
    authDomain: "ecotechinventary.firebaseapp.com",
    projectId: "ecotechinventary",
    storageBucket: "ecotechinventary.firebasestorage.app",
    messagingSenderId: "157541879434",
    appId: "1:157541879434:web:e97e5a9ef28f8cca9da773"
};

//  Inicializar app
const app = initializeApp(firebaseConfig);

//  Auth con persistencia (IMPORTANTE)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

//  Exportar
export { app, auth };
export const db = getFirestore(app);