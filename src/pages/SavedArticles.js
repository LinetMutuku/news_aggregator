import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, VStack, Heading, Text, useToast, Spinner,
    Container, useColorModeValue, Fade, Input, InputGroup, InputLeftElement,
    Button, Alert, AlertIcon, Flex, AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';
import ArticleGrid from '../components/ArticleGrid';
import { fetchSavedArticles, unsaveArticleAction, searchSavedArticlesAction } from '../redux/actions/articleActions';
import useDebounce from '../hooks/useDebounce';

function SavedArticles() {
    const dispatch = useDispatch();
    const { savedArticles, loading, error } = useSelector(state => state.articles);
    const [searchQuery, setSearchQuery] = useState('');
    const toast = useToast();
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [isUnsaveDialogOpen, setIsUnsaveDialogOpen] = useState(false);
    const [articleToUnsave, setArticleToUnsave] = useState(null);
    const cancelRef = useRef();

    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 20;

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
        setArticleToUnsave(article);
        setIsUnsaveDialogOpen(true);
    }, []);

    const confirmUnsave = () => {
        if (articleToUnsave) {
            dispatch(unsaveArticleAction(articleToUnsave)).then((result) => {
                if (result.success) {
                    toast({
                        title: "Article unsaved",
                        description: result.message,
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                    loadSavedArticles();
                }
            }).catch((error) => {
                toast({
                    title: "Error unsaving article",
                    description: error.message || "An unexpected error occurred. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });
        }
        setIsUnsaveDialogOpen(false);
        setArticleToUnsave(null);
    };

    const cancelUnsave = () => {
        setIsUnsaveDialogOpen(false);
        setArticleToUnsave(null);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        loadSavedArticles();
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = savedArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(savedArticles.length / articlesPerPage);

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
                            articles={currentArticles}
                            onUnsave={handleUnsave}
                            loading={loading}
                            isSavedPage={true}
                        />
                    </Fade>
                    {savedArticles.length > articlesPerPage && (
                        <Flex justifyContent="center" mt={4}>
                            <Button
                                onClick={() => handlePageChange(currentPage - 1)}
                                isDisabled={currentPage === 1}
                                mr={2}
                            >
                                Previous
                            </Button>
                            <Text alignSelf="center" mx={2}>
                                Page {currentPage} of {totalPages}
                            </Text>
                            <Button
                                onClick={() => handlePageChange(currentPage + 1)}
                                isDisabled={currentPage === totalPages}
                                ml={2}
                            >
                                Next
                            </Button>
                        </Flex>
                    )}
                </VStack>
            </Container>

            <AlertDialog
                isOpen={isUnsaveDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={cancelUnsave}
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
                            <Button ref={cancelRef} onClick={cancelUnsave}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={confirmUnsave} ml={3}>
                                Unsave
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}

export default SavedArticles;