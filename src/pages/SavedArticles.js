import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack, Text, useToast, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import ArticleGrid from '../components/ArticleGrid';
import { getSavedArticles } from '../utils/api';

function SavedArticles() {
    const [savedArticles, setSavedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const loadSavedArticles = async () => {
            try {
                setLoading(true);
                setError(null);
                const articles = await getSavedArticles();
                setSavedArticles(articles || []);
            } catch (error) {
                console.error('Error fetching saved articles:', error);
                setError('Failed to fetch saved articles. Please try again later.');
                toast({
                    title: "Error fetching saved articles",
                    description: error.response?.data?.message || "An unexpected error occurred",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        loadSavedArticles();
    }, [toast]);

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
                <Text mt={4}>Loading saved articles...</Text>
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
                <Heading textAlign="center">Saved Articles</Heading>
                {savedArticles.length > 0 ? (
                    <ArticleGrid articles={savedArticles} />
                ) : (
                    <Text textAlign="center">You haven't saved any articles yet.</Text>
                )}
            </VStack>
        </Box>
    );
}

export default SavedArticles;