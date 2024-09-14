import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, VStack, Heading, Spinner, useToast, Container, Text, Button,
    Center, Alert, AlertIcon, AlertTitle, AlertDescription
} from "@chakra-ui/react";
import { fetchArticles, searchArticlesAction, saveArticleAction, setSelectedArticle } from '../redux/actions/articleActions';
import Search from '../components/Search';
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import ErrorBoundary from '../components/ErrorBoundary';
import { debounce } from 'lodash';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { articles, loading, error, hasMore, page, selectedArticle } = useSelector(state => state.articles);
    const toast = useToast();
    const [retryCount, setRetryCount] = useState(0);

    const debouncedFetchArticles = useCallback(
        debounce((isInitialLoad) => {
            dispatch(fetchArticles(isInitialLoad ? 1 : page))
                .catch(error => {
                    console.error('Error loading articles:', error);
                    if (error.response && error.response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/login');
                        toast({
                            title: "Authentication Error",
                            description: "Please log in again.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    } else {
                        toast({
                            title: "Error loading articles",
                            description: error.message,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                });
        }, 300),
        [dispatch, page, navigate, toast]
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            debouncedFetchArticles(true);
        }
    }, [debouncedFetchArticles, navigate]);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            debouncedFetchArticles(true);
            return;
        }
        try {
            await dispatch(searchArticlesAction(query));
        } catch (error) {
            console.error('Error in handleSearch:', error);
            toast({
                title: "Error searching articles",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleSaveArticle = async (article) => {
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
                description: error.message || "An unexpected error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleReadArticle = (article) => {
        dispatch(setSelectedArticle(article._id));
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        debouncedFetchArticles(true);
    };

    if (loading && articles.length === 0) {
        return (
            <Center height="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

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
                                <Button ml={4} onClick={handleRetry}>Retry</Button>
                            </Alert>
                        )}

                        <ArticleGrid
                            articles={articles}
                            onSave={handleSaveArticle}
                            onRead={handleReadArticle}
                        />

                        {hasMore && (
                            <Center>
                                <Button
                                    colorScheme="blue"
                                    onClick={() => debouncedFetchArticles(false)}
                                    isLoading={loading}
                                    loadingText="Loading"
                                >
                                    Load More
                                </Button>
                            </Center>
                        )}
                    </VStack>
                </Container>

                {selectedArticle && (
                    <ArticleDetail article={selectedArticle} onClose={() => dispatch(setSelectedArticle(null))} />
                )}
            </Box>
        </ErrorBoundary>
    );
}

export default Home;