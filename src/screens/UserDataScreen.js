import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { getUserProfile } from "../api/apiService";
import { auth } from "../Firebase/firebaseConfig";

const UserDataScreen = ({ setScreen }) => {
const { user, logout, userToken } = useContext(AuthContext);
const [foto, setFoto] = useState(null);
const [rol, setRol] = useState(null);
const [loadingImg, setLoadingImg] = useState(false);

const pickImageAndUpload = async () => {
    try {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Se necesitan permisos para acceder a la galería");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (result.canceled) return;

        setLoadingImg(true);

        const imageUri = result.assets[0].uri;

        const formData = new FormData();
        formData.append("imagen", {
            uri: imageUri,
            name: "avatar.jpg",
            type: "image/jpeg"
        });

        const response = await fetch("http://192.168.137.31:8000/api/perfil/foto/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${userToken}`
            },
            body: formData
        });

        const text = await response.text();
        console.log("🔥 RESPUESTA SUBIDA COMPLETA:", text);

        try {
            const data = JSON.parse(text);

            if (!response.ok) {
                throw new Error(data.error || "Error al subir imagen");
            }

            setFoto(data.foto_url);
            alert("Foto actualizada correctamente ✅");

        } catch (err) {
            console.log("❌ NO ES JSON:", text);
            alert("El servidor devolvió un error (revisa consola)");
        }

    } catch (error) {
        console.log("ERROR SUBIENDO FOTO:", error);
        alert("Error al subir la foto ❌");
    } finally {
        setLoadingImg(false);
    }
};

useEffect(() => {
    const loadProfile = async () => {
        try {
            const data = await getUserProfile(userToken);

            console.log("🔥 PERFIL API:", data);

            setFoto(data.foto_url);
            setRol(data.rol);

        } catch (error) {
            console.log("ERROR CARGANDO PERFIL:", error);
        }
    };

    if (userToken) {
        loadProfile();
    }
}, [userToken]);

const handleLogout = async () => {
    try {
        await signOut(auth);
        logout();
    } catch (error) {
        console.log("ERROR LOGOUT:", error);
    }
};

return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.logoTitle}>ECO TECH</Text>
            <Text style={styles.logoSubtitle}>PERFIL</Text>
        </View>

        <View style={styles.formCard}>
            <View style={styles.avatarContainer}>
                {loadingImg ? (
                    <ActivityIndicator size="large" color="#0056b3" />
                ) : foto ? (
                    <Image source={{ uri: foto }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.placeholderAvatar]}>
                        <Text style={{ color: '#557ca3' }}>Sin foto</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.cameraBadge} onPress={pickImageAndUpload}>
                    <Text style={{ fontSize: 16 }}>📸</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Correo Electrónico</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>

                <Text style={styles.label}>Rol de Usuario</Text>
                <Text style={[styles.infoValue, styles.rolBadge]}>
                    {rol || 'Cargando...'}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.mainButton}
                onPress={() => setScreen("products")}
            >
                <Text style={styles.buttonText}>Volver al Inventario</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.mainButton, styles.logoutButton]}
                onPress={handleLogout}
            >
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
        
    </View>
    );
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: "#f0f5ff",
paddingHorizontal: 30,
justifyContent: "center",
},
headerContainer: {
alignItems: "center",
marginBottom: 20,
},
logoTitle: {
fontSize: 32,
fontWeight: "900",
color: "#0056b3",
letterSpacing: 1.5,
},
logoSubtitle: {
fontSize: 22,
fontWeight: "800",
color: "#003366",
letterSpacing: 5,
marginTop: -5,
},
formCard: {
backgroundColor: "#ffffff",
borderRadius: 30,
padding: 25,
alignItems: "center",
shadowColor: "#004aad",
shadowOffset: { width: 0, height: 10 },
shadowOpacity: 0.1,
shadowRadius: 15,
elevation: 8,
},
avatarContainer: {
position: "relative",
marginBottom: 20,
},
avatar: {
width: 120,
height: 120,
borderRadius: 60,
borderWidth: 3,
borderColor: "#f0f5ff",
backgroundColor: "#f8faff",
},
placeholderAvatar: {
justifyContent: "center",
alignItems: "center",
},
cameraBadge: {
position: "absolute",
bottom: 5,
right: 5,
backgroundColor: "#ffffff",
width: 36,
height: 36,
borderRadius: 18,
justifyContent: "center",
alignItems: "center",
elevation: 5,
},
infoContainer: {
width: "100%",
marginBottom: 20,
},
label: {
fontSize: 11,
color: "#a0aec0",
fontWeight: "bold",
textTransform: "uppercase",
marginBottom: 4,
marginLeft: 5,
},
infoValue: {
fontSize: 15,
color: "#003366",
backgroundColor: "#f8faff",
padding: 12,
borderRadius: 15,
marginBottom: 12,
fontWeight: "500",
},
rolBadge: {
color: "#0056b3",
fontWeight: "bold",
textAlign: "center",
backgroundColor: "#e1ecff",
},
mainButton: {
width: "100%",
height: 50,
borderRadius: 20,
backgroundColor: "#0056b3",
justifyContent: "center",
alignItems: "center",
marginBottom: 12,
elevation: 3,
},
logoutButton: {
backgroundColor: "#c62828",
},
buttonText: {
color: "#ffffff",
fontSize: 16,
fontWeight: "bold",
}
});

export default UserDataScreen;
