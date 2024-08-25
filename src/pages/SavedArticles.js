import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    useToast,
    Spinner,
    Alert,
    AlertIcon,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Container,
    useColorModeValue,
    Fade
} from "@chakra-ui/react";
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import { getSavedArticles, unsaveArticle, getArticleById } from '../utils/api';

function SavedArticles() {
    const [savedArticles, setSavedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const toast = useToast();
    const cancelRef = React.useRef();

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const headingColor = useColorModeValue('blue.600', 'blue.300');

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
                await unsaveArticle(articleToDelete.articleId);
                setSavedArticles(prevArticles =>
                    prevArticles.filter(article => article.articleId !== articleToDelete.articleId)
                );
                toast({
                    title: "Article unsaved",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error unsaving article:', error);
                if (error.response && error.response.status === 404) {
                    toast({
                        title: "Article already unsaved",
                        description: "This article has already been removed from your saved list.",
                        status: "info",
                        duration: 5000,
                        isClosable: true,
                    });
                    setSavedArticles(prevArticles =>
                        prevArticles.filter(article => article.articleId !== articleToDelete.articleId)
                    );
                } else {
                    toast({
                        title: "Error unsaving article",
                        description: "An unexpected error occurred. Please try again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            }
        }
        setIsOpen(false);
    };

    const handleDeleteCancel = () => {
        setIsOpen(false);
    };

    const handleReadArticle = async (article) => {
        try {
            setLoading(true);
            const fullArticle = await getArticleById(article.articleId);
            setSelectedArticle(fullArticle);
            setIsReadModalOpen(true);
        } catch (error) {
            console.error('Error fetching full article:', error);
            toast({
                title: "Error fetching article",
                description: "Unable to load the full article. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box textAlign="center" py={10} bg={bgColor} minH="100vh">
                <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
                <Text mt={4} color={textColor}>Loading saved articles...</Text>
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
        <Box w="full" bg={bgColor} minH="100vh" py={8}>
            <Container maxW="container.xl">
                <VStack spacing={8} align="stretch">
                    <Heading textAlign="center" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} color={headingColor} fontWeight="bold">
                        Your Saved Articles
                    </Heading>
                    <Text textAlign="center" fontSize={{ base: "md", md: "lg" }} color={textColor}>
                        Revisit and manage your curated collection of saved stories.
                    </Text>
                    <Fade in={true}>
                        {savedArticles.length > 0 ? (
                            <ArticleGrid
                                articles={savedArticles}
                                onDelete={handleDeleteClick}
                                onRead={handleReadArticle}
                                showDeleteButton={true}
                                deleteButtonColor="red.400"
                            />
                        ) : (
                            <Text textAlign="center" fontSize="xl" color={textColor}>You haven't saved any articles yet.</Text>
                        )}
                    </Fade>
                </VStack>
            </Container>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={handleDeleteCancel}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Unsave Article
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to unsave this article? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={handleDeleteCancel}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                                Unsave
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <Modal isOpen={isReadModalOpen} onClose={() => setIsReadModalOpen(false)} size="xl" scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent maxH="90vh" bg={bgColor}>
                    <ModalCloseButton />
                    <ModalBody p={0}>
                        {selectedArticle && <ArticleDetail article={selectedArticle} />}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default SavedArticles;