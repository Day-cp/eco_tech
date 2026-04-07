import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView
} from 'react-native';
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "../Firebase/firebaseConfig"; 

const HomeScreen = ({ setScreen }) => {
    const { user } = useContext(AuthContext);
    
    const [userData, setUserData] = useState({
        foto: null,
        rol: "Cargando..."
    });

    useEffect(() => {
        const fetchExtraData = async () => {
            try {
                if (user?.uid) {
                    const userRef = doc(db, "perfiles", user.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        setUserData({
                            foto: data.foto_url?.replace(".webp", ".jpg"),
                            rol: data.rol || "Sin Rol"
                        });
                    }
                }
            } catch (error) {
                console.log("Error trayendo datos en Home:", error);
            }
        };

        fetchExtraData();
    }, [user]);

    return (
        <SafeAreaView style={styles.container}>

            {/* 🔹 HEADER COMO CAJÓN CENTRADO */}
            <View style={styles.header}>
                <Image
                    source={{ 
                        uri: userData.foto  
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user?.email || "Usuario"}</Text>
                <Text style={styles.welcome}>ADSO - {userData.rol.toUpperCase()}</Text>
            </View>

            {/* 🔹 ACCIONES EN GRID */}
            <View style={styles.grid}>
                <TouchableOpacity style={styles.card} onPress={() => setScreen('user')}>
                    <Text style={styles.icon}>👤</Text>
                    <Text style={styles.cardText}>Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => setScreen('Products')}>
                    <Text style={styles.icon}>📦</Text>
                    <Text style={styles.cardText}>Productos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => setScreen('solicitudes')}>
                    <Text style={styles.icon}>📄</Text>
                    <Text style={styles.cardText}>Solicitudes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => setScreen('Chat')}>
                    <Text style={styles.icon}>💬</Text>
                    <Text style={styles.cardText}>Chat</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    /* 🔹 HEADER AJUSTADO */
    header: {
        alignItems: 'center',
        paddingVertical: 25,
        backgroundColor: '#316488',
        marginTop: 40, // Lo baja de la parte superior
        marginHorizontal: 20, // Lo centra a lo ancho dejando espacio a los lados
        borderRadius: 25, // Bordes redondeados en todas las esquinas para efecto "cajón"
        
        // Sombra para que flote
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: '#fff',
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    welcome: {
        fontSize: 12,
        color: '#E2E8F0',
        fontWeight: '700',
        marginTop: 4,
    },

    /* 🔹 GRID */
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 20,
        marginTop: 10, // Espacio entre el header y los botones
    },

    card: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    icon: {
        fontSize: 28,
        marginBottom: 8,
    },

    cardText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
});