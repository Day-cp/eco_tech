import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";

// Firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../Firebase/firebaseConfig";

const auth = getAuth(app);

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert("Error", "Por favor ingrese email y contraseña");
        }
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            login(token);
        } catch (error) {
            // Un mensaje más genérico para seguridad
            Alert.alert("Error de login", "Credenciales incorrectas o problema de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Nuevo encabezado de marca */}
            <View style={styles.headerContainer}>
                <Text style={styles.logoTitle}>ECO TECH</Text>
                <Text style={styles.logoSubtitle}>INVENTARY</Text>
            </View>

            {/* Tarjeta de Formulario Redondeada */}
            <View style={styles.formCard}>
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#a0aec0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#a0aec0"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#0056b3" style={{ marginTop: 10 }} />
                ) : (
                    <TouchableOpacity style={styles.mainButton} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                )}
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#f0f5ff", // Fondo azul claro consistente
        paddingHorizontal: 30,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    logoTitle: {
        fontSize: 36, // Tamaño grande para ECO TECH
        fontWeight: "900", // Peso máximo para impacto visual
        color: "#0056b3", // Azul vibrante corporativo
        letterSpacing: 1.5,
        lineHeight: 38,
    },
    logoSubtitle: {
        fontSize: 32, // Un poco más pequeño pero aún grande
        fontWeight: "800", // Un poco menos de peso para contraste
        color: "#003366", // Azul oscuro profundo
        letterSpacing: 4, // Espaciado amplio para INVENTARY
        lineHeight: 34,
        marginTop: -2,
    },
    formCard: {
        backgroundColor: "#ffffff",
        borderRadius: 30, // Redondeado ADSO/EcoTech
        padding: 25,
        shadowColor: "#004aad",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
    },
    input: {
        width: "100%",
        height: 55,
        borderRadius: 15,
        backgroundColor: "#f8faff",
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#e1e9f5",
        color: "#003366",
    },
    mainButton: {
        width: "100%",
        height: 55,
        borderRadius: 20,
        backgroundColor: "#0056b3", // Azul vibrante
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        elevation: 4,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
    },
    footerText: {
        textAlign: "center",
        color: "#a0aec0",
        marginTop: 30,
        fontSize: 12,
        letterSpacing: 1,
    }
});

export default LoginScreen;