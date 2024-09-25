import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, VStack, Heading, Container, Text,
    Alert, AlertIcon, AlertTitle, AlertDescription,
    Flex, Button, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
    useColorModeValue
} from "@chakra-ui/react";
import { fetchArticles, searchArticlesAction, saveArticleAction, unsaveArticleAction } from '../redux/actions/articleActions';
import Search from '../components/Search';
import ArticleGrid from '../components/ArticleGrid';
import ErrorBoundary from '../components/ErrorBoundary';

function Home() {
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const textColor = useColorModeValue("gray.800", "gray.100");
    const headingColor = useColorModeValue("blue.600", "blue.300");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();
    const { articles, error, totalPages, loading, currentPage } = useSelector(state => state.articles);
    const [isUnsaveDialogOpen, setIsUnsaveDialogOpen] = useState(false);
    const [articleToUnsave, setArticleToUnsave] = useState(null);
    const cancelRef = useRef();

    const loadArticles = useCallback((page) => {
        dispatch(fetchArticles(page));
    }, [dispatch]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else if (articles.length === 0) {
            loadArticles(1);
        }
    }, [loadArticles, navigate, articles.length]);

    const handleSearch = useCallback((query) => {
        dispatch(searchArticlesAction(query));
    }, [dispatch]);

    const handleSaveArticle = useCallback((article) => {
        dispatch(saveArticleAction(article)).then(() => {
            toast({
                title: "Article saved",
                description: "The article has been saved successfully.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        }).catch((error) => {
            toast({
                title: "Error saving article",
                description: error.message || "An unexpected error occurred.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        });
    }, [dispatch, toast]);

    const handleUnsaveArticle = useCallback((article) => {
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
                        duration: 2000,
                        isClosable: true,
                    });
                }
            }).catch((error) => {
                toast({
                    title: "Error unsaving article",
                    description: error.message || "An unexpected error occurred.",
                    status: "error",
                    duration: 3000,
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

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            loadArticles(newPage);
        }
    };

    return (
        <ErrorBoundary>
            <Box minHeight="100vh" bg={bgColor} color={textColor}>
                <Container maxW="container.xl" py={8}>
                    <VStack spacing={8} align="stretch">
                        <Heading textAlign="center" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} color={headingColor}>
                            Discover Today's Top Stories
                        </Heading>
                        <Text textAlign="center" fontSize={{ base: "md", md: "lg" }}>
                            Stay informed with the latest news and articles from around the world
                        </Text>

                        <Search onSearch={handleSearch} />

                        {error && (
                            <Alert status="error">
                                <AlertIcon />
                                <AlertTitle mr={2}>Error!</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <ArticleGrid
                            articles={articles}
                            onSave={handleSaveArticle}
                            onUnsave={handleUnsaveArticle}
                            loading={loading}
                            isSavedPage={false}
                        />

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
        </ErrorBoundary>
    );
}

export default Home;