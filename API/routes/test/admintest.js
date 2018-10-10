module.exports = [
    // Alleen ingelogde admin gebruikers mogen deze pagina opvragen
    {
        method: 'GET',
        path: '/api/v1/admintest',
        config: {
            auth: {
                strategy: 'jwt',
                scope: 'admin'
            }
        },
        handler: (req, h) => {
            return 'You accessed an admin route!';
        }
    }
]
