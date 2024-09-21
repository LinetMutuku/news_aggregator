import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, VStack, Heading, Container, Text, Button, Center, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { fetchArticles, searchArticlesAction, saveArticleAction, setSelectedArticle } from '../redux/actions/articleActions';
import Search from '../components/Search';
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import ErrorBoundary from '../components/ErrorBoundary';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { articles, error, hasMore, page, selectedArticle, loading } = useSelector(state => state.articles);
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
        dispatch(searchArticlesAction(query));
    }, [dispatch]);

    const handleSaveArticle = useCallback((article) => {
        dispatch(saveArticleAction(article));
    }, [dispatch]);

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
                            </Alert>
                        )}

                        <ArticleGrid {...articleGridProps} />

                        {hasMore && (
                            <Center>
                                <Button
                                    colorScheme="blue"
                                    onClick={handleLoadMore}
                                    isLoading={loading}
                                    loadingText="Loading More"
                                >
                                    Load More
                                </Button>
                            </Center>
                        )}
                    </VStack>
                </Container>

                {isModalOpen && selectedArticle && (
                    <ArticleDetail
                        article={selectedArticle}
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                    />
                )}
            </Box>
        </ErrorBoundary>
    );
}

export default Home;