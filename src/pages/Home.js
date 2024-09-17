import React, { useEffect, useCallback, useState, useMemo } from 'react';
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
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const debouncedFetchArticles = useCallback(
        debounce((isInitial) => {
            dispatch(fetchArticles(isInitial ? 1 : page))
                .catch(error => {
                    console.error('Error loading articles:', error);
                    toast({
                        title: "Error loading articles",
                        description: error.message || "An unexpected error occurred. Please try again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                });
        }, 300),
        [dispatch, page, toast]
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else if (isInitialLoad) {
            debouncedFetchArticles(true);
            setIsInitialLoad(false);
        }
    }, [debouncedFetchArticles, navigate, isInitialLoad]);

    const handleSearch = useCallback(async (query) => {
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
                description: error.message || "An unexpected error occurred. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [debouncedFetchArticles, dispatch, toast]);

    const handleSaveArticle = useCallback(async (article) => {
        try {
            if (!article || !article._id || !article.title) {
                throw new Error('Invalid article: Missing _id or title');
            }
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
    }, [dispatch]);


    const handleLoadMore = useCallback(() => {
        debouncedFetchArticles(false);
    }, [debouncedFetchArticles]);


    const articleGridProps = useMemo(() => ({
        articles,
        onSave: handleSaveArticle,
        onRead: handleReadArticle,
        loading,
    }), [articles, handleSaveArticle, handleReadArticle, loading]);


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
                                <Button ml={4} onClick={() => debouncedFetchArticles(true)}>Retry</Button>
                            </Alert>
                        )}

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