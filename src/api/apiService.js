import AsyncStorage from "@react-native-async-storage/async-storage";

// AQUI SE COLOCA EL IP IPv4 QUE SE OBTIENE AL INGRESAR EL COMANDO ipconfig en CMD
const BASE_URL = "http://192.168.101.8:8000/api/";

// ========================
//  LOGIN 
// ========================
export const loginService = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error al iniciar sesión");
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// =========
//  OBTENER
// =========
export const getProducts = async (token, tipo = null) => {
    try {
        let url = `${BASE_URL}productos/`;

        // 🔥 agregar query param si existe
        if (tipo) {
            url += `?tipo=${tipo}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const text = await response.text();
        console.log("RESPUESTA CRUDA:", text);

        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.error || "Error al obtener datos");
        }

        return data;

    } catch (error) {
        console.log("ERROR EN API:", error);
        throw error;
    }
};

// ========================
//  CRUD DE productos
// ========================
export const productService = {
    getAll: (token) =>
        fetch(`${BASE_URL}productos/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json()),

    create: (token, data) =>
        fetch(`${BASE_URL}productos/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => res.json()),

    update: (token, id, data) =>
        fetch(`${BASE_URL}productos/${id}/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => res.json()),

    delete: (token, id) =>
        fetch(`${BASE_URL}productos/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
};

export const createProduct = async (data, token) => {
    try {
        console.log("📤 DATA ENVIADA:", data);

        const response = await fetch(`${BASE_URL}productos/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const text = await response.text(); // 🔥 VER RESPUESTA REAL
        console.log("📥 RESPUESTA CRUDA CREATE:", text);

        const result = JSON.parse(text);

        if (!response.ok) {
            throw new Error(
                result.error ||
                result.detail ||
                result.mensaje ||
                JSON.stringify(result)
            );
        }

        return result;

    } catch (error) {
        console.log("❌ ERROR CREATE:", error);
        throw error;
    }
};

export const deleteProduct = async (productId, token) => {
    try {
        const response = await fetch(
            `${BASE_URL}productos/${productId}/`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al eliminar");
        }

        return true;
    } catch (error) {
        console.log("ERROR DELETE:", error);
        throw error;
    }
};

export const updateProduct = async (productId, data, token) => {
    try {
        const response = await fetch(
            `${BASE_URL}productos/${productId}/`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Error al actualizar");
        }

        return result;
    } catch (error) {
        console.log("ERROR UPDATE:", error);
        throw error;
    }
};

export const getUserProfile = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}perfil/foto/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const text = await response.text(); // 👈 CAMBIO CLAVE
        console.log("RESPUESTA PERFIL CRUDA:", text);

        const data = JSON.parse(text); // 👈 puede fallar

        if (!response.ok) {
            throw new Error(data.error || "Error al obtener perfil");
        }

        return data;

    } catch (error) {
        console.log("ERROR PERFIL:", error);
        throw error;
    }
};

// ========================
//  SUBIR FOTO PERFIL
// ========================
export const uploadProfilePhoto = async (imageUri, token) => {
    try {
        const formData = new FormData();

        formData.append("imagen", {
            uri: imageUri,
            name: "avatar.jpg",
            type: "image/jpeg",
        });

        const response = await fetch(`${BASE_URL}perfil/foto/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                // ⚠️ NO pongas Content-Type manualmente
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error al subir imagen");
        }

        return data;

    } catch (error) {
        console.log("ERROR UPLOAD:", error);
        throw error;
    }
};

export const getChatHistoryService = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}chat/historial/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`}
        });
        if (!response.ok) throw new Error("Error cargando historial del chat");
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// ========================
//  SERVICIOS DE CHAT
// ========================

export const getMiPerfilService = async (token) => {
    console.log("TOKEN ENVIADO:", token); // Si sale undefined, el problema es el AuthContext
    try {
        const response = await fetch(`${BASE_URL}perfil/foto/`, { 
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Verifica que no falte la palabra 'Bearer'
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener perfil para el chat");
        }

        return await response.json();
    } catch (error) {
        console.log("ERROR GET_MI_PERFIL:", error);
        throw error;
    }
};