import React, {useContext} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { AuthContext } from "../context/AuthContext";

const homeScreen = ({navegation}) => {
    const {logout} = useContext(AuthContext);

    return (
        /* Agregué el style container aquí para que el fondo funcione en toda la pantalla */
        <View style={styles.container}>
            <View>
                <Text style={styles.welcome}>Hola, desarrollador</Text>
                <Text style={styles.sub}>Bienvenido al panel principal</Text>
            </View>
            
            <View style={styles.menuGrid}>
                <TouchableOpacity style={styles.card} onPress={() => navegation.navigate('Products')}>
                    <Text style={styles.icon}>⚜</Text>
                    <Text style={styles.cardText}>Gestionar Productos</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.card} onPress={logout}>
                    <Text style={styles.icon}>🚪</Text>
                    <Text style={styles.cardText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f5ff', // Fondo azul muy claro
        paddingTop: 40,
    },
    welcome: {
        fontSize: 30,
        fontWeight: '700', // Más grueso para que resalte
        color: '#003366', // Azul oscuro profundo
        marginBottom: 5,
        marginHorizontal: 25,
        fontFamily: 'sans-serif-medium', // Tipo de letra más moderno
    },
    sub: {
        fontSize: 16,
        color: '#557ca3', // Azul grisáceo
        marginHorizontal: 25,
        marginBottom: 30,
        fontFamily: 'sans-serif-light',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        paddingHorizontal: 10,
    },
    card: {
        width: '42%',
        backgroundColor: '#ffffff',
        borderRadius: 25, // Bordes muy redondeados como pediste
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
        // Sombra más suave y azulada
        shadowColor: '#004aad',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#e1e9f5',
    },
    icon: {
        fontSize: 35,
        marginBottom: 10,
    },
    cardText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0056b3', // Azul vibrante para los botones
        textAlign: 'center',
        fontFamily: 'sans-serif-condensed',
    }
})

export default homeScreen;