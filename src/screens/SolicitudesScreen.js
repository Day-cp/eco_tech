import React, { useEffect, useState, useContext } from "react";
import {
    View, Text, FlatList, ActivityIndicator,
    StyleSheet, TouchableOpacity, SafeAreaView, StatusBar
} from "react-native";

import { AuthContext } from "../context/AuthContext";
import { getProducts } from "../api/apiService";
import { db } from "../Firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const SolicitudesScreen = ({ setScreen }) => {

    const { userToken, user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rol, setRol] = useState(null);

    const loadProducts = async () => {
        try {
            const data = await getProducts(userToken, "solicitudes");
            setProducts(data.datos || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return; 

            const userRef = doc(db, "perfiles", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setRol(userSnap.data().rol);
            }
        };

        if (userToken) {
            loadProducts();
            loadProfile();
        }
    }, [userToken]);

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#316488" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setScreen("home")}
                >
                    <Text style={styles.backText}>← Volver al Inicio</Text>
                </TouchableOpacity>

                <Text style={styles.header}>
                    {rol === "administrador" ? "Solicitudes" : "Mis Solicitudes"}
                </Text>
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.empty}>No hay solicitudes registradas</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {/* Se eliminó el statusBadge para mostrar solo datos reales */}
                        <Text style={styles.title}>{item.titulo}</Text>
                        <Text style={styles.description}>{item.descripcion}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#F8FAFC",
        paddingTop: 50, 
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    backButton: {
        backgroundColor: "#FFF",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    backText: {
        color: "#316488",
        fontSize: 14,
        fontWeight: "bold",
    },
    header: { 
        fontSize: 24, 
        fontWeight: "bold",
        color: "#1E293B",
        marginBottom: 10,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: { 
        backgroundColor: "#FFF", 
        padding: 20, 
        marginBottom: 16, 
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 15,
        elevation: 2,
    },
    title: { 
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 6,
    },
    description: { 
        fontSize: 14,
        color: "#64748B",
        lineHeight: 20,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    empty: { 
        textAlign: "center", 
        color: "#94A3B8",
        fontSize: 16,
    },
    loading: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#F8FAFC"
    }
});

export default SolicitudesScreen;