require('dotenv').config();
const axios = require('axios');

const igdbService = {}; //contenedor

const obtenerToken = async () => {
    try {
        const params = new URLSearchParams();
        params.append('client_id', process.env.IGDB_CLIENT_ID);
        params.append('client_secret', process.env.IGDB_CLIENT_SECRET);
        params.append('grant_type', 'client_credentials');

        const response = await axios.post('https://id.twitch.tv/oauth2/token', params);
        return response.data.access_token;
    } catch (error) {
        console.error('DETALLE DEL ERROR TWITCH:', error.response?.data);
        throw new Error('No se pudo autenticar con IGDB');
    }
};

igdbService.buscarJuegos = async (nombreJuego) => {
    try {
        const token = await obtenerToken();
        const query = `search "${nombreJuego}"; fields name, summary, cover.url; limit 5;`;

        const response = await axios.post('https://api.igdb.com/v4/games', query, {
            headers: {
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'text/plain'
            }
        });

        return response.data.map(juego => ({
            id: juego.id, 
            titulo: juego.name,
            descripcion: juego.summary || 'Sin descripción',
            imagen_portada: juego.cover ? `https:${juego.cover.url.replace('t_thumb', 't_cover_big')}` : null
        }));
    } catch (error) {
        console.error('Error en IGDB Service:', error.message);
        throw error;
    }
};

igdbService.obtenerMasJugados = async () => {
    try {
        const token = await obtenerToken();
        // Filtramos juegos con muchas valoraciones y alta popularidad
        // lenguaje propio de igdb
        const query = `
            fields name, cover.url, total_rating_count; 
            where total_rating_count > 1000; 
            sort total_rating_count desc; 
            limit 10;
        `;

        const response = await axios.post('https://api.igdb.com/v4/games', query, {
            headers: {
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'text/plain'
            }
        });

        return response.data.map(juego => ({
            id: juego.id,
            titulo: juego.name,
            imagen_portada: juego.cover ? `https:${juego.cover.url.replace('t_thumb', 't_cover_big')}` : null
        }));
    } catch (error) {
        console.error('Error en servicio de populares:', error.message);
        throw error;
    }
};

module.exports = igdbService;

