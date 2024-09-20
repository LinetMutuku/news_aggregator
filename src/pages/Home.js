import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, VStack, Heading, Spinner, useToast, Container, Text, Button,
    Center, Alert, AlertIcon, AlertTitle, AlertDescription, Modal, ModalOverlay,
    ModalContent, ModalCloseButton, ModalBody
} from "@chakra-ui/react";
import { fetchArticles, searchArticlesAction, saveArticleAction, setSelectedArticle } from '../redux/actions/articleActions';
import Search from '../components/Search';
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import ErrorBoundary from '../components/ErrorBoundary';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { articles, error, hasMore, page, selectedArticle, loading } = useSelector(state => state.articles);
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadArticles = useCallback((isInitial = false) => {
        if (!loading && (hasMore || isInitial)) {
            dispatch(fetchArticles(isInitial ? 1 : page));
        }
    }, [dispatch, hasMore, loading, page]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            loadArticles(true);
        }
    }, [loadArticles, navigate]);

    const handleSearch = useCallback(async (query) => {
        if (!query.trim()) {
            loadArticles(true);
            return;
        }
        dispatch(searchArticlesAction(query));
    }, [loadArticles, dispatch]);

    const handleSaveArticle = useCallback(async (article) => {
        try {
            await dispatch(saveArticleAction(article));
            toast({
                title: "Article saved successfully",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error saving article:', error);
            toast({
                title: "Error saving article",
                description: error.response?.data?.message || error.message || "An unexpected error occurred. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [dispatch, toast]);

    const handleReadArticle = useCallback((article) => {
        dispatch(setSelectedArticle(article._id));
        setIsModalOpen(true);
    }, [dispatch]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        dispatch(setSelectedArticle(null));
    }, [dispatch]);

    const handleLoadMore = useCallback(() => {
        loadArticles();
    }, [loadArticles]);

    const articleGridProps = useMemo(() => ({
        articles,
        onSave: handleSaveArticle,
        onRead: handleReadArticle,
        loading,
    }), [articles, handleSaveArticle, handleReadArticle, loading]);

    return (
        <ErrorBoundary>
            <Box minHeight="100vh" bg="gray.50">
                <Container maxW="container.xl" py={8}>
                    <VStack spacing={8} align="stretch">
                        <Heading textAlign="center" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} color="blue.600">
                            Discover Today's Top Stories
                        </Heading>
                        <Text textAlign="center" fontSize={{ base: "md", md: "lg" }} color="gray.600">
                            Stay informed with the latest news and articles from around the world
                        </Text>

                        <Search onSearch={handleSearch} />

                        {error && (
                            <Alert status="error">
                                <AlertIcon />
                                <AlertTitle mr={2}>Error!</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                                <Button ml={4} onClick={() => loadArticles(true)}>Retry</Button>
                            </Alert>
                        )}

                        {loading && articles.length === 0 ? (
                            <Center height="50vh">
                                <Spinner size="xl" />
                            </Center>
                        ) : (
                            <>
                                <ArticleGrid {...articleGridProps} />

                                {hasMore && (
                                    <Center>
                                        <Button
                                            colorScheme="blue"
                                            onClick={handleLoadMore}
                                            isLoading={loading}
                                            loadingText="Loading"
                                        >
                                            Load More
                                        </Button>
                                    </Center>
                                )}
                            </>
                        )}
                    </VStack>
                </Container>

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
        </ErrorBoundary>
    );
}

export default Home;