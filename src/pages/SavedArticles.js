import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, VStack, Heading, Text, useToast, Spinner,
    Container, useColorModeValue, Fade, Input, InputGroup, InputLeftElement,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
    AlertDialogContent, AlertDialogOverlay, Button, Modal, ModalOverlay,
    ModalContent, ModalCloseButton, ModalBody, Alert, AlertIcon, Flex
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import { fetchSavedArticles, unsaveArticleAction, searchSavedArticlesAction, setSelectedArticle } from '../redux/actions/articleActions';
import useDebounce from '../hooks/useDebounce';

function SavedArticles() {
    const dispatch = useDispatch();
    const { savedArticles, loading, selectedArticle, error } = useSelector(state => state.articles);
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

    const handleUnsave = useCallback((article) => {
        if (article && article._id) {
            setArticleToUnsave(article);
            setIsDeleteDialogOpen(true);
        } else {
            console.error('Attempted to unsave an article with missing ID:', article);
            toast({
                title: "Error",
                description: "Unable to unsave this article due to a missing ID.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [toast]);

    const handleUnsaveConfirm = async () => {
        if (articleToUnsave && articleToUnsave._id) {
            try {
                const result = await dispatch(unsaveArticleAction(articleToUnsave));
                if (result.success) {
                    toast({
                        title: "Article unsaved",
                        description: result.message,
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                console.error('Error unsaving article:', error);
                toast({
                    title: "Error unsaving article",
                    description: error.message || "An unexpected error occurred. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } else {
            console.error('No article to unsave or article ID is undefined');
        }
        setIsDeleteDialogOpen(false);
        setArticleToUnsave(null);
    };

    const handleUnsaveCancel = () => {
        setIsDeleteDialogOpen(false);
        setArticleToUnsave(null);
    };

    const handleReadArticle = useCallback((article) => {
        dispatch(setSelectedArticle(article._id));
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

    if (loading && (!savedArticles || savedArticles.length === 0)) {
        return (
            <Box textAlign="center" py={10} bg={bgColor} minH="100vh">
                <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
                <Text mt={4} color={textColor}>Loading saved articles...</Text>
            </Box>
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
                    <Flex>
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
                        </InputGroup>
                        {searchQuery && (
                            <Button ml={2} onClick={handleClearSearch} colorScheme="blue">
                                Clear
                            </Button>
                        )}
                    </Flex>
                    {error && (
                        <Alert status="error">
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}
                    <Fade in={true}>
                        <ArticleGrid
                            articles={savedArticles}
                            onUnsave={handleUnsave}
                            onRead={handleReadArticle}
                            showUnsaveButton={true}
                            loading={loading}
                        />
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

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
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