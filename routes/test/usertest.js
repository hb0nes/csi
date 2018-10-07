module.exports = [
    // Alleen ingelogde gebruikers mogen deze pagina opvragen
    {
        method: 'GET',
        path: '/api/v1/usertest',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'user'
            }
        },
        handler: (req, h) => {
            return 'You used a token!';
        }
    }
]