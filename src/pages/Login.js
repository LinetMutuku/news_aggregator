import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, useToast, Link } from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login } from '../utils/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error);
            toast({
                title: "Login failed",
                description: error.response?.data?.message || "Please check your credentials and try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box maxWidth="400px" margin="auto">
            <Heading as="h2" size="xl" textAlign="center" mb={6}>Login</Heading>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl id="username" isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="teal" width="full">Login</Button>
                </VStack>
            </form>
            <Text mt={4} textAlign="center">
                Don't have an account? <Link as={RouterLink} to="/register" color="teal.500">Register</Link>
            </Text>
        </Box>
    );
}

export default Login;