import React, { useState, useEffect, useContext, useRef } from "react";
import { 
    View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, 
    KeyboardAvoidingView, Platform, ActivityIndicator, SafeAreaView, StatusBar 
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getChatHistoryService, getMiPerfilService } from "../api/apiService";

const ChatScreen = ({ setScreen }) => { 
    const { userToken } = useContext(AuthContext);
    const [mensaje, setMensaje] = useState('');
    const [mensajes, setMensajes] = useState([]);
    const [miPerfil, setMiPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);
    const ws = useRef(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        const iniciarChat = async () => {
            try {
                try {
                    const perfil = await getMiPerfilService(userToken);
                    setMiPerfil(perfil);
                } catch (perfilError) {
                    setMiPerfil({ email: "usuario@correo.com", uid: "temp_123" });
                }
                
                try {
                    const historial = await getChatHistoryService(userToken);
                    setMensajes(historial);
                } catch (historialError) {
                    setMensajes([]); 
                }

                ws.current = new WebSocket("ws://192.168.101.8:8000/ws/chat/");
                ws.current.onmessage = (e) => {
                    const dataRecibida = JSON.parse(e.data);
                    const nuevoMensaje = {
                        id: Date.now().toString(),
                        mensaje: dataRecibida.mensaje,
                        usuario: dataRecibida.uid_usuario || dataRecibida.usuario 
                    };
                    setMensajes((prev) => [...prev, nuevoMensaje]);
                };
                setCargando(false);
            } catch (error) {
                setCargando(false);
            }
        };
        iniciarChat();
        return () => { if (ws.current) ws.current.close(); };
    }, [userToken]);

    const enviarMensaje = () => {
        if (mensaje.trim() && ws.current && miPerfil) {
            const identificador = miPerfil.email || "usuario@correo.com";
            const dataEnviar = { 'mensaje': mensaje, 'uid_usuario': identificador };
            ws.current.send(JSON.stringify(dataEnviar));
            setMensaje('');
        }
    };

    if (cargando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#316488" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Cabecera unificada */}
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setScreen("home")}
                >
                    <Text style={styles.backText}>← Volver al Inicio</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chat Global</Text>
            </View>

            <KeyboardAvoidingView 
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={mensajes}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => {
                        const miIdentificador = miPerfil?.email || miPerfil?.uid;
                        const esMio = item.usuario === miIdentificador;

                        return (
                            <View style={[
                                styles.burbuja, 
                                esMio ? styles.burbujaMia : styles.burbujaOtro
                            ]}>
                                {!esMio && <Text style={styles.nombreUsuario}>{item.usuario}</Text>}
                                <Text style={esMio ? styles.textoMio : styles.textoOtro}>
                                    {item.mensaje}
                                </Text>
                            </View>
                        );
                    }}
                />
                
                {/* Input estilizado */}
                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Escribe un mensaje..."
                            value={mensaje}
                            onChangeText={setMensaje}
                            placeholderTextColor="#94A3B8"
                        />
                        <TouchableOpacity style={styles.botonEnviar} onPress={enviarMensaje}>
                            <Text style={styles.textoBoton}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#F8FAFC",
        paddingTop: 50, // Alineación con las demás pantallas
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
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1E293B",
        marginBottom: 10,
    },
    listContent: { 
        paddingHorizontal: 20,
        paddingBottom: 20 
    },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: "#F8FAFC"
    },
    burbuja: {
        maxWidth: "80%",
        padding: 15,
        borderRadius: 22,
        marginVertical: 5,
    },
    burbujaMia: {
        backgroundColor: "#316488",
        alignSelf: "flex-end",
        borderBottomRightRadius: 4,
    },
    burbujaOtro: {
        backgroundColor: "#FFF",
        alignSelf: "flex-start",
        borderBottomLeftRadius: 4,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    nombreUsuario: {
        fontSize: 10,
        color: "#94A3B8",
        marginBottom: 4,
        fontWeight: '700',
        textTransform: 'uppercase'
    },
    textoMio: {
        color: "#FFF",
        fontSize: 15,
        lineHeight: 20,
    },
    textoOtro: {
        color: "#1E293B",
        fontSize: 15,
        lineHeight: 20,
    },
    inputWrapper: {
        padding: 20,
        backgroundColor: 'transparent',
    },
    inputContainer: {
        flexDirection: "row",
        padding: 8,
        backgroundColor: '#FFF',
        borderRadius: 30,
        alignItems: 'center',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    input: {
        flex: 1,
        height: 45,
        paddingHorizontal: 20,
        fontSize: 15,
        color: "#1E293B",
    },
    botonEnviar: {
        backgroundColor: "#316488",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        marginLeft: 5,
    },
    textoBoton: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default ChatScreen;