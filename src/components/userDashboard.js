import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, useToast, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { getUserProfile, updateUserProfile, getAllArticles, getArticleById, markArticleAsRead, logout } from '../utils/api';

function UserDashboard() {
    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const loadUserAndArticles = async () => {
            try {
                setLoading(true);
                setError(null);
                const userData = await getUserProfile();
                setUser(userData);
                const articlesData = await getAllArticles();
                setArticles(articlesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch user data and articles. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadUserAndArticles();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const updatedData = { ...user, name: 'Updated Name' }; // Example update
            await updateUserProfile(updatedData);
            setUser(updatedData);
            toast({
                title: "Profile updated",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: "Error updating profile",
                description: error.response?.data?.message || "An unexpected error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleReadArticle = async (articleId) => {
        try {
            const article = await getArticleById(articleId);
            await markArticleAsRead(articleId);
            toast({
                title: "Article marked as read",
                description: `You've read: ${article.title}`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error marking article as read:', error);
            toast({
                title: "Error marking article as read",
                description: error.response?.data?.message || "An unexpected error occurred",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleLogout = () => {
        logout();
        toast({
            title: "Logged out successfully",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
        // Redirect to login page or update app state
    };

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
                <Text mt={4}>Loading dashboard...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    return (
        <Box w="full">
            <VStack spacing={8} align="stretch">
                <Heading textAlign="center">User Dashboard</Heading>
                {user && (
                    <Box>
                        <Text>Welcome, {user.name}</Text>
                        <Button onClick={handleUpdateProfile} mt={2}>Update Profile</Button>
                    </Box>
                )}
                <Box>
                    <Heading size="md">Recent Articles</Heading>
                    {articles.slice(0, 5).map(article => (
                        <Box key={article.id} mt={2}>
                            <Text>{article.title}</Text>
                            <Button onClick={() => handleReadArticle(article.id)} size="sm">Mark as Read</Button>
                        </Box>
                    ))}
                </Box>
                <Button onClick={handleLogout} colorScheme="red">Logout</Button>
            </VStack>
        </Box>
    );
}

export default UserDashboard;