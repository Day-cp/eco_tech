import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
    SafeAreaView
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getProducts, deleteProduct, updateProduct, createProduct } from "../api/apiService";
import { db } from "../Firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ListScreen = ({ setScreen }) => {
    const { user, userToken } = useContext(AuthContext);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rol, setRol] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [newProductTitle, setNewProductTitle] = useState("");
    const [newProductDescription, setNewProductDescription] = useState("");

    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const loadProducts = async () => {
        try {
            const data = await getProducts(userToken);
            setProducts(data.datos || []);
        } catch (error) {
            console.log("ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newProductTitle.trim() || !newProductDescription.trim()) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }
        try {
            const data = { titulo: newProductTitle, descripcion: newProductDescription };
            const response = await createProduct(data, userToken);
            setProducts((prev) => [{ id: response.id, ...data }, ...prev]);
            setNewProductTitle("");
            setNewProductDescription("");
            setShowForm(false);
        } catch (error) {
            console.log("ERROR CREATE:", error);
        }
    };

    const handleDelete = (id) => {
        Alert.alert("Eliminar", "¿Seguro que deseas eliminar este producto?", [
            { text: "Cancelar" },
            {
                text: "Eliminar",
                onPress: async () => {
                    try {
                        await deleteProduct(id, userToken);
                        setProducts((prev) => prev.filter((p) => p.id !== id));
                    } catch (error) {
                        console.log("ERROR DELETE:", error);
                    }
                }
            }
        ]);
    };

    const startEditing = (item) => {
        setEditingProduct(item.id);
        setNewTitle(item.titulo);
        setNewDescription(item.descripcion);
    };

    const handleUpdate = async () => {
        try {
            const updated = { titulo: newTitle, descripcion: newDescription };
            await updateProduct(editingProduct, updated, userToken);
            setProducts((prev) =>
                prev.map((p) => (p.id === editingProduct ? { ...p, ...updated } : p))
            );
            setEditingProduct(null);
        } catch (error) {
            console.log("ERROR UPDATE:", error);
        }
    };

    const handleRequest = async (item) => {
        try {
            await createProduct({
                titulo: item.titulo,
                descripcion: item.descripcion,
                producto_id: item.id
            }, userToken);
            Alert.alert("Éxito", "Solicitud enviada correctamente");
        } catch (error) {
            console.log("ERROR SOLICITUD:", error);
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;
            const ref = doc(db, "perfiles", user.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) setRol(snap.data().rol);
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
            <TouchableOpacity 
                style={styles.backHeader} 
                onPress={() => setScreen("home")} 
            >
                <Text style={styles.backText}>← Volver al Inicio</Text>
            </TouchableOpacity>

            <Text style={styles.header}>
                {rol === "administrador" ? "Mis productos" : "Productos"}
            </Text>

            {rol === "administrador" && !showForm && (
                <TouchableOpacity style={styles.createMainBtn} onPress={() => setShowForm(true)}>
                    <Text style={styles.createMainBtnText}>+ Crear nuevo producto</Text>
                </TouchableOpacity>
            )}

            {showForm && (
                <View style={styles.cardForm}>
                    <TextInput
                        style={styles.input}
                        placeholder="Título"
                        value={newProductTitle}
                        onChangeText={setNewProductTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Descripción"
                        value={newProductDescription}
                        onChangeText={setNewProductDescription}
                    />
                    <View style={styles.row}>
                        <TouchableOpacity style={[styles.btnSmall, styles.btnConfirm]} onPress={handleCreate}>
                            <Text style={styles.btnTextWhite}>Guardar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnSmall, styles.btnCancel]} onPress={() => setShowForm(false)}>
                            <Text style={styles.btnTextWhite}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {editingProduct === item.id ? (
                            <>
                                <TextInput style={styles.input} value={newTitle} onChangeText={setNewTitle} />
                                <TextInput style={styles.input} value={newDescription} onChangeText={setNewDescription} />
                                <View style={styles.row}>
                                    <TouchableOpacity style={[styles.btnSmall, styles.btnConfirm]} onPress={handleUpdate}>
                                        <Text style={styles.btnTextWhite}>Actualizar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.btnSmall, styles.btnCancel]} onPress={() => setEditingProduct(null)}>
                                        <Text style={styles.btnTextWhite}>Cerrar</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.title}>{item.titulo}</Text>
                                <Text style={styles.description}>{item.descripcion}</Text>

                                <View style={styles.actionRow}>
                                    {rol === "administrador" ? (
                                        <>
                                            <TouchableOpacity style={styles.btnEdit} onPress={() => startEditing(item)}>
                                                <Text style={styles.btnEditText}>Editar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item.id)}>
                                                <Text style={styles.btnDeleteText}>Eliminar</Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <TouchableOpacity style={styles.btnRequest} onPress={() => handleRequest(item)}>
                                            <Text style={styles.btnTextWhite}>Solicitar</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </>
                        )}
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No hay productos disponibles</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        padding: 20,
        paddingTop: 50,
    },
    backHeader: {
        alignSelf: 'flex-start',
        marginBottom: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backText: {
        color: '#316488',
        fontSize: 14,
        fontWeight: '600',
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1E293B",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 25, // Bordes más redondos estilo perfil
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    cardForm: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 25,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    title: {
        fontWeight: "700",
        fontSize: 18,
        color: '#1E293B',
        marginBottom: 5,
    },
    description: {
        color: "#64748B",
        fontSize: 14,
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        color: '#1E293B',
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    btnSmall: {
        flex: 1,
        height: 45,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnConfirm: {
        backgroundColor: '#316488',
    },
    btnCancel: {
        backgroundColor: '#94A3B8', // Un gris más suave para cancelar
    },
    btnTextWhite: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    createMainBtn: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#316488',
        borderStyle: 'dashed',
    },
    createMainBtnText: {
        color: '#316488',
        fontWeight: '700',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 15,
        borderTopWidth: 1,
        borderTopColor: '#F8FAFC',
        paddingTop: 15,
    },
    btnEdit: {
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    btnEditText: {
        color: '#316488',
        fontWeight: '700',
    },
    btnDelete: {
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    btnDeleteText: {
        color: '#EF4444',
        fontWeight: '600',
    },
    btnRequest: {
        backgroundColor: '#316488',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 15,
    },
    empty: {
        textAlign: "center",
        marginTop: 50,
        color: '#94A3B8'
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#F8FAFC'
    }
});

export default ListScreen;