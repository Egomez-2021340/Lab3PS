const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('./register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Este correo ya se está utilizando' });
        }


        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Nombre de usuario Ocupado' });
        }

        // Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const newUser = new User({
            email,
            username,
            password: hashedPassword
        });

        // Guardar el usuario en la base de datos
        await newUser.save();

        // Generar token JWT
        const token = jwt.sign({ userId: newUser._id }, 'secreto');

        // Enviar la respuesta con el token
        res.status(201).json({ token });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

module.exports = router;
