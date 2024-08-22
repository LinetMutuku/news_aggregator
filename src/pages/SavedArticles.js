import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Heading, VStack, Text, useToast, Spinner, Alert, AlertIcon,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
    AlertDialogContent, AlertDialogOverlay, Button
} from "@chakra-ui/react";
import ArticleGrid from '../components/ArticleGrid';
import { getSavedArticles, unsaveArticle } from '../utils/api';

function SavedArticles() {
    const [savedArticles, setSavedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const toast = useToast();
    const cancelRef = React.useRef();

    const loadSavedArticles = useCallback(async () => {
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
    }, [toast]);

    useEffect(() => {
        loadSavedArticles();
    }, [loadSavedArticles]);

    const handleDeleteClick = (article) => {
        setArticleToDelete(article);
        setIsOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (articleToDelete) {
            try {
                await unsaveArticle(articleToDelete.id);
                setSavedArticles(prevArticles =>
                    prevArticles.filter(article => article.id !== articleToDelete.id)
                );
                toast({
                    title: "Article deleted",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error deleting article:', error);
                toast({
                    title: "Error deleting article",
                    description: error.response?.data?.message || "An unexpected error occurred",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        setIsOpen(false);
    };

    const handleDeleteCancel = () => {
        setIsOpen(false);
    };

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
                    <ArticleGrid
                        articles={savedArticles}
                        onDelete={handleDeleteClick}
                    />
                ) : (
                    <Text textAlign="center">You haven't saved any articles yet.</Text>
                )}
            </VStack>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={handleDeleteCancel}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Article
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this article? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={handleDeleteCancel}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}

export default SavedArticles;