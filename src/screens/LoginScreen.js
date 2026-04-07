import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, TouchableOpacity, StatusBar } from "react-native";
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
            login(token, userCredential.user);
        } catch (error) {
            Alert.alert("Error de login", "Revisa tus datos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#e3e4e3" />
            
            <View style={styles.headerContainer}>
                <Text style={styles.mainTitle}>ECO TECH</Text>
                <Text style={styles.subTitle}>INVENTARY</Text>
                
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Correo Electrónico</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ejemplo@correo.com"
                    placeholderTextColor="#9ea6a8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9ea6a8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={styles.buttonWrapper}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#316488" />
                    ) : (
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.7}>
                            <Text style={styles.buttonText}>ENTRAR</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e3e4e3", // Fondo gris perla
        justifyContent: "center",
        paddingHorizontal: 40,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 50,
    },
    mainTitle: {
        fontSize: 48,
        fontWeight: "900",
        color: "#000000",
        letterSpacing: -1.5,
        lineHeight: 50,
    },
    subTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#116a8a",
        marginTop: -2,
        letterSpacing: 6,
    },
    description: {
        fontSize: 11,
        color: "#5e6363",
        textAlign: "center",
        fontWeight: "700",
        marginTop: 25,
        lineHeight: 16,
        paddingHorizontal: 10,
    },
    formGroup: {
        marginTop: 10,
    },
    label: {
        color: "#116a8a",
        marginBottom: 10,
        fontSize: 14,
        fontWeight: "800",
        marginLeft: 15,
    },
    input: {
        width: "100%",
        height: 55,
        borderRadius: 30, // Más redondeado todavía
        backgroundColor: "#ffffffb9",
        paddingHorizontal: 25,
        marginBottom: 25,
        fontSize: 16,
        color: "#4a688f",
        // Eliminé shadow y elevation que causaban el borde raro
    },
    buttonWrapper: {
        alignItems: "center",
        marginTop: 20,
    },
    loginButton: {
        width: "60%", // Tamaño ideal para el botón
        height: 52,
        borderRadius: 30,
        backgroundColor: "#316488",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "900",
        letterSpacing: 1.5,
    },
});

export default LoginScreen;