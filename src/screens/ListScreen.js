import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, TextInput } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getProducts, deleteProduct, updateProduct, createProduct } from "../api/apiService";

const ListScreen = ({ setScreen }) => {
    const { userToken } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProductTitle, setNewProductTitle] = useState("");
    const [newProductDescription, setNewProductDescription] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
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

    const handleDelete = (productId) => {
        Alert.alert(
            "Eliminar producto",
            "¿Seguro que quieres eliminar este producto?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteProduct(productId, userToken);
                            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
                        } catch (error) {
                            console.log("ERROR:", error);
                        }
                    },
                },
            ]
        );
    };

    const startEditing = (product) => {
        setEditingProduct(product.id);
        setNewTitle(product.titulo);
        setNewDescription(product.descripcion);
    };

    const handleUpdate = async () => {
        try {
            const updatedData = { titulo: newTitle, descripcion: newDescription };
            await updateProduct(editingProduct, updatedData, userToken);
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === editingProduct ? { ...product, ...updatedData } : product
                )
            );
            setEditingProduct(null);
        } catch (error) {
            console.log("ERROR UPDATE:", error);
        }
    };

    useEffect(() => {
        if (userToken) loadProducts();
    }, [userToken]);

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0056b3" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>INVENTARY</Text>

            <View style={styles.topButtons}>
                <TouchableOpacity style={[styles.mainButton, {backgroundColor: '#0056b3'}]} onPress={() => setScreen("user")}>
                    <Text style={styles.buttonText}>Ver Datos del Usuario</Text>
                </TouchableOpacity>
            </View>

            {showForm && (
                /* FORM CARD ESTILO LOGIN */
                <View style={styles.formCardLoginStyle}>
                    <Text style={styles.formTitle}>Nuevo Producto</Text>
                    <TextInput style={styles.input} value={newProductTitle} onChangeText={setNewProductTitle} placeholder="Título" placeholderTextColor="#a0aec0"/>
                    <TextInput style={[styles.input, {height: 80}]} multiline value={newProductDescription} onChangeText={setNewProductDescription} placeholder="Descripción" placeholderTextColor="#a0aec0"/>
                    <View style={styles.row}>
                        {/* BOTÓN CREAR AZUL CORPORATIVO */}
                        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#0056b3'}]} onPress={handleCreate}>
                            <Text style={styles.buttonText}>Crear</Text>
                        </TouchableOpacity>
                        {/* BOTÓN ROJO OSCURO */}
                        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#c62828'}]} onPress={() => setShowForm(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <FlatList 
                data={products} 
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{paddingBottom: 80}}
                ListEmptyComponent={<Text style={styles.empty}>No hay productos todavía</Text>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {editingProduct === item.id ? (
                            <>
                                <TextInput style={styles.input} value={newTitle} onChangeText={setNewTitle} />
                                <TextInput style={styles.input} onChangeText={setNewDescription} value={newDescription} />
                                <View style={styles.row}>
                                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#0056b3'}]} onPress={handleUpdate}>
                                        <Text style={styles.buttonText}>Guardar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#6c757d'}]} onPress={() => setEditingProduct(null)}>
                                        <Text style={styles.buttonText}>Volver</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.title}>{item.titulo}</Text>
                                <Text style={styles.description}>{item.descripcion}</Text>
                                <View style={styles.row}>
                                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#0056b3'}]} onPress={() => startEditing(item)}>
                                        <Text style={styles.buttonText}>Editar</Text>
                                    </TouchableOpacity>
                                    {/* BOTÓN ROJO OSCURO */}
                                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#c62828'}]} onPress={() => handleDelete(item.id)}>
                                        <Text style={styles.buttonText}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                )}
            />

            {!showForm && (
                <TouchableOpacity 
                    style={styles.fab} 
                    onPress={() => setShowForm(true)}
                >
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f5ff',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        fontSize: 30,
        fontWeight: '700',
        color: '#003366',
        textAlign: 'center',
        marginBottom: 20,
    },
    topButtons: {
        marginBottom: 10,
    },
    mainButton: {
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 10,
        elevation: 3,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 25,
        backgroundColor: '#00bcd4',
        width: 55,
        height: 55,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    fabText: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: '300',
        marginTop: -3,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 15,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 25,
        padding: 20,
        marginBottom: 15,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#e1e9f5',
    },
    formCardLoginStyle: {
        backgroundColor: "#ffffff", // Fondo blanco como el login
        borderRadius: 30, // Mismo redondeado
        padding: 25,
        marginBottom: 20,
        // Sombras exactas del login
        shadowColor: "#004aad",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#003366',
        textAlign: 'center',
        marginBottom: 15,
        fontFamily: 'sans-serif-medium',
    },
    input: {
        backgroundColor: "#f8faff", // Fondo ultra-suave como el login
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 16,
        color: '#003366',
        borderWidth: 1,
        borderColor: '#e1e9f5',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#003366",
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: "#557ca3",
        marginBottom: 15,
        lineHeight: 22,
    },
    empty: {
        fontSize: 16,
        color: "#557ca3",
        textAlign: "center",
        marginTop: 50,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f5ff",
    },
});

export default ListScreen;