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


        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, 'secreto');

        res.status(201).json({ token });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ userId: user._id }, 'secreto');

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

module.exports = router;
