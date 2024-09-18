import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, VStack, Heading, Text, useToast, Spinner, Alert, AlertIcon,
    Container, useColorModeValue, Fade, Input, InputGroup, InputLeftElement,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
    AlertDialogContent, AlertDialogOverlay, Button, Modal, ModalOverlay,
    ModalContent, ModalCloseButton, ModalBody
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import { fetchSavedArticles, unsaveArticleAction, searchSavedArticlesAction, setSelectedArticle } from '../redux/actions/articleActions';
import useDebounce from '../hooks/useDebounce';

function SavedArticles() {
    const dispatch = useDispatch();
    const { savedArticles, loading, error, selectedArticle } = useSelector(state => state.articles);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [articleToUnsave, setArticleToUnsave] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toast = useToast();
    const cancelRef = useRef();

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const headingColor = useColorModeValue('blue.600', 'blue.300');
    const inputBgColor = useColorModeValue('white', 'gray.700');

    const loadSavedArticles = useCallback(() => {
        dispatch(fetchSavedArticles());
    }, [dispatch]);

    useEffect(() => {
        loadSavedArticles();
    }, [loadSavedArticles]);

    const handleSearch = useCallback((query) => {
        if (!query.trim()) {
            loadSavedArticles();
            return;
        }
        dispatch(searchSavedArticlesAction(query));
    }, [dispatch, loadSavedArticles]);

    useEffect(() => {
        if (debouncedSearchQuery) {
            handleSearch(debouncedSearchQuery);
        } else if (debouncedSearchQuery === '') {
            loadSavedArticles();
        }
    }, [debouncedSearchQuery, handleSearch, loadSavedArticles]);

    const handleUnsave = useCallback((articleId) => {
        setArticleToUnsave(articleId);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleUnsaveConfirm = async () => {
        if (articleToUnsave) {
            try {
                await dispatch(unsaveArticleAction(articleToUnsave));
                toast({
                    title: "Article unsaved",
                    description: "Article successfully removed from your saved list",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                loadSavedArticles();
            } catch (error) {
                console.error('Error unsaving article:', error);
                if (error.response && error.response.status === 404) {
                    toast({
                        title: "Article not found",
                        description: "This article may have already been unsaved. Refreshing your saved articles.",
                        status: "info",
                        duration: 5000,
                        isClosable: true,
                    });
                    loadSavedArticles();
                } else {
                    toast({
                        title: "Error unsaving article",
                        description: error.response?.data?.message || error.message || "An unexpected error occurred. Please try again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            }
        }
        setIsDeleteDialogOpen(false);
        setArticleToUnsave(null);
    };

    const handleUnsaveCancel = () => {
        setIsDeleteDialogOpen(false);
        setArticleToUnsave(null);
    };

    const handleReadArticle = useCallback((article) => {
        dispatch(setSelectedArticle(article));
        setIsModalOpen(true);
    }, [dispatch]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        dispatch(setSelectedArticle(null));
    }, [dispatch]);

    const handleClearSearch = () => {
        setSearchQuery('');
        loadSavedArticles();
    };

    if (loading && savedArticles.length === 0) {
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
        <Box bg={bgColor} minHeight="100vh">
            <Container maxW="container.xl">
                <VStack spacing={8} align="stretch" py={8}>
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
                                onUnsave={handleUnsave}
                                onRead={handleReadArticle}
                                showUnsaveButton={true}
                            />
                        ) : (
                            <Text textAlign="center" fontSize="xl" color={textColor}>
                                {searchQuery ? "No articles match your search." : "You haven't saved any articles yet."}
                            </Text>
                        )}
                    </Fade>
                </VStack>
            </Container>

            <AlertDialog
                isOpen={isDeleteDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={handleUnsaveCancel}
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
                            <Button ref={cancelRef} onClick={handleUnsaveCancel}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleUnsaveConfirm} ml={3}>
                                Unsave
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <Modal isOpen={isModalOpen && selectedArticle} onClose={handleCloseModal} size="xl">
                <ModalOverlay />
                <ModalContent maxW="800px">
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