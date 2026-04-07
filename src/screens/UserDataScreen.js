import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, SafeAreaView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { uploadProfilePhoto } from "../api/apiService";

const UserDataScreen = ({ setScreen }) => {
    const { user, logout, userToken } = useContext(AuthContext);
    const [foto, setFoto] = useState(null);
    const [rol, setRol] = useState(null);

    const pickImageAndUpload = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                alert("Se necesitan permisos para acceder a la galería");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (result.canceled) return;

            const imageUri = result.assets[0].uri;
            const response = await uploadProfilePhoto(imageUri, userToken);

            setFoto(response.url);
            alert("Foto actualizada correctamente");

        } catch (error) {
            console.log("ERROR SUBIENDO FOTO:", error);
            alert("Error al subir la foto");
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            try {
                if (!user?.uid) return;
                const userRef = doc(db, "perfiles", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setFoto(data.foto_url?.replace(".webp", ".jpg"));
                    setRol(data.rol);
                }
            } catch (error) {
                console.log("ERROR FIREBASE:", error);
            }
        };
        loadProfile();
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            logout();
        } catch (error) {
            console.log("ERROR LOGOUT:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity 
                style={styles.backHeader} 
                onPress={() => setScreen("home")} 
            >
                <Text style={styles.backText}>← Volver al Inicio</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Mi Perfil</Text>

            {foto ? (
                <Image source={{ uri: foto }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.loadingAvatar]}>
                    <ActivityIndicator color="#316488" />
                </View>
            )}

            <View style={styles.infoCard}>
                <Text style={styles.label}>Correo Electrónico</Text>
                <Text style={styles.infoText}>{user?.email}</Text>
                
                <Text style={styles.label}>Rol en Eco-Tech</Text>
                <Text style={styles.infoText}>{rol || "Cargando..."}</Text>
                
                <Text style={styles.uidText}>ID: {user?.uid}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.actionButton, {backgroundColor: '#316488'}]} 
                    onPress={pickImageAndUpload}
                >
                    <Text style={styles.buttonText}>Cambiar Foto</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.actionButton, {backgroundColor: '#d9534f'}]} 
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F5F9",
        padding: 20,
        alignItems: "center",
        paddingTop: 50,
    },
    backHeader: {
        alignSelf: 'flex-start',
        marginBottom: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
    },
    backText: {
        color: '#316488',
        fontSize: 14,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#334155",
        marginBottom: 25,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 65,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: "#fff",
        elevation: 5,
    },
    loadingAvatar: {
        justifyContent: 'center',
        backgroundColor: '#e1e1e1',
    },
    infoCard: {
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        borderRadius: 15,
        marginBottom: 25,
        elevation: 2,
    },
    label: {
        fontSize: 10,
        color: '#64748B',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    infoText: {
        fontSize: 15,
        color: '#1E293B',
        marginBottom: 12,
        fontWeight: '600',
    },
    uidText: {
        fontSize: 9,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 5,
    },
    buttonContainer: {
        width: "70%", // Más angosto para botones pequeños
        gap: 10,
    },
    actionButton: {
        width: '100%',
        height: 42, // Altura reducida
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    }
});

export default UserDataScreen;