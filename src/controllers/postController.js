exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username');
        res.json(posts);
    } catch (error) {
        console.error('Error al obtener publicaciones:', error);
        res.status(500).json({ message: 'Error al obtener publicaciones' });
    }
};