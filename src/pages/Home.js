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
        } else if (articles.length === 0) {
            loadArticles(true);
        }
    }, [loadArticles, navigate, articles.length]);

    const handleSearch = useCallback((query) => {
        if (!query.trim()) {
            loadArticles(true);
        } else {
            dispatch(searchArticlesAction(query));
        }
    }, [loadArticles, dispatch]);

    const handleSaveArticle = useCallback((article) => {
        dispatch(saveArticleAction(article))
            .then(() => {
                toast({
                    title: "Article saved successfully",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            })
            .catch((error) => {
                console.error('Error saving article:', error);
                toast({
                    title: "Error saving article",
                    description: error.response?.data?.message || error.message || "An unexpected error occurred. Please try again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            });
    }, [dispatch, toast]);

    const handleReadArticle = useCallback((article) => {
        dispatch(setSelectedArticle(article._id));
        setIsModalOpen(true);
    }, [dispatch]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        dispatch(setSelectedArticle(null));
    }, [dispatch]);

    const articleGridProps = useMemo(() => ({
        articles,
        onSave: handleSaveArticle,
        onRead: handleReadArticle,
        loading,
    }), [articles, handleSaveArticle, handleReadArticle, loading]);

    const renderContent = () => {
        if (loading && articles.length === 0) {
            return (
                <Center height="50vh">
                    <Spinner size="xl" />
                </Center>
            );
        }

        return (
            <>
                <ArticleGrid {...articleGridProps} />
                {hasMore && (
                    <Center>
                        <Button
                            colorScheme="blue"
                            onClick={() => loadArticles()}
                            isLoading={loading}
                            loadingText="Loading"
                        >
                            Load More
                        </Button>
                    </Center>
                )}
            </>
        );
    };

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

                        {renderContent()}
                    </VStack>
                </Container>

                <Modal isOpen={isModalOpen && !!selectedArticle} onClose={handleCloseModal} size="xl">
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