import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    Fade,
    Input,
    InputGroup,
    InputLeftElement
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import BackgroundCarousel from '../components/BackgroundCarousel';
import { getSavedArticles, unsaveArticle, getArticleById, searchSavedArticles } from '../utils/api';
import useDebounce from '../hooks/useDebounce';

import backgroundImage1 from '../images/bg1.jpg';
import backgroundImage2 from '../images/bg2.jpg';
import backgroundImage3 from '../images/bg2.jpg';

const backgroundImages = [
    backgroundImage1,
    backgroundImage2,
    backgroundImage3,
]

function SavedArticles() {
    const [savedArticles, setSavedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const toast = useToast();
    const cancelRef = useRef();

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const headingColor = useColorModeValue('blue.600', 'blue.300');
    const inputBgColor = useColorModeValue('white', 'gray.700');

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

    const handleSearch = useCallback(async (query) => {
        if (!query.trim()) {
            loadSavedArticles();
            return;
        }
        setIsSearching(true);
        setLoading(true);
        try {
            const searchResults = await searchSavedArticles(query);
            setSavedArticles(searchResults || []);
        } catch (error) {
            console.error('Error searching saved articles:', error);
            toast({
                title: "Error searching saved articles",
                description: error.message || "An unexpected error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    }, [loadSavedArticles, toast]);

    useEffect(() => {
        if (debouncedSearchQuery) {
            handleSearch(debouncedSearchQuery);
        } else if (debouncedSearchQuery === '') {
            loadSavedArticles();
        }
    }, [debouncedSearchQuery, handleSearch, loadSavedArticles]);

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
            if (!article.articleId) {
                throw new Error('Invalid article ID');
            }
            const fullArticle = await getArticleById(article.articleId);
            setSelectedArticle(fullArticle);
            setIsReadModalOpen(true);
        } catch (error) {
            console.error('Error fetching full article:', error);
            toast({
                title: "Error fetching article",
                description: error.message || "Unable to load the full article. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        loadSavedArticles();
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
        <Box position="relative" minHeight="100vh">
            <BackgroundCarousel images={backgroundImages} />
            <Box bg="rgba(255, 255, 255, 0.8)" minHeight="100vh">
                <Container maxW="container.xl">
                    <VStack spacing={8} align="stretch">
                        <Heading textAlign="center" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} color={headingColor} fontWeight="bold">
                            Your Saved Articles
                        </Heading>
                        <Text textAlign="center" fontSize={{ base: "md", md: "lg" }} color={textColor}>
                            Revisit and manage your curated collection of saved stories.
                        </Text>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.300" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search saved articles"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                bg={inputBgColor}
                            />
                            {searchQuery && (
                                <Button ml={2} onClick={handleClearSearch}>
                                    Clear
                                </Button>
                            )}
                        </InputGroup>
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
                                <Text textAlign="center" fontSize="xl" color={textColor}>
                                    {isSearching ? "No articles match your search." : "You haven't saved any articles yet."}
                                </Text>
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
        </Box>
    );
}

export default SavedArticles;