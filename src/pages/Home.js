import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box, VStack, Heading, Spinner, useToast, Container, Text, Button,
    SimpleGrid, Center, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton
} from "@chakra-ui/react";
import Search from '../components/Search';
import ArticleCard from '../components/ArticleCard';
import ArticleDetail from '../components/ArticleDetail';
import { getRecommendedArticles, saveArticle, searchArticles, getArticleById } from '../utils/api';

function Home() {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const toast = useToast();
    const initialLoadComplete = useRef(false);
    const renderCount = useRef(0);

    const loadArticles = useCallback(async (isInitialLoad = false) => {
        if (loading || (!hasMore && !isInitialLoad)) return;
        setLoading(true);
        try {
            console.log(`Fetching articles, page: ${page}, isInitialLoad: ${isInitialLoad}`);
            const response = await getRecommendedArticles(page);
            console.log('Received articles:', response);
            const newArticles = response.articles;

            if (newArticles && newArticles.length > 0) {
                setArticles(prevArticles => isInitialLoad ? newArticles : [...prevArticles, ...newArticles]);
                setHasMore(page < response.totalPages);
            } else {
                setHasMore(false);
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setError('Failed to load articles. Please try again later.');
            toast({
                title: "Error fetching articles",
                description: error.message || "An unexpected error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [page, toast]);

    useEffect(() => {
        console.log(`Component re-rendered. Render count: ${++renderCount.current}`);
    });

    useEffect(() => {
        if (!initialLoadComplete.current) {
            console.log('Initial load effect triggered');
            loadArticles(true);
            initialLoadComplete.current = true;
        }
    }, [loadArticles]);

    useEffect(() => {
        console.log(`Page changed to ${page}`);
        if (page > 1 && !isSearching) {
            loadArticles();
        }
    }, [page, loadArticles, isSearching]);

    const handleLoadMore = useCallback(() => {
        if (!loading && hasMore) {
            console.log('Load more triggered');
            setPage(prevPage => prevPage + 1);
        }
    }, [loading, hasMore]);

    const handleSearch = useCallback(async (query) => {
        console.log(`Search triggered with query: ${query}`);
        if (!query.trim()) {
            setIsSearching(false);
            setArticles([]);
            setPage(1);
            setHasMore(true);
            initialLoadComplete.current = false;
            loadArticles(true);
            return;
        }
        setIsSearching(true);
        setLoading(true);
        try {
            const searchResults = await searchArticles(query);
            setArticles(searchResults.articles);
            setHasMore(false);
            setError(null);
        } catch (error) {
            console.error('Error searching articles:', error);
            setError('Failed to search articles. Please try again.');
            toast({
                title: "Error searching articles",
                description: error.message || "An unexpected error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [loadArticles, toast]);

    const handleSaveArticle = useCallback(async (article) => {
        try {
            await saveArticle(article);
            toast({
                title: "Article saved successfully",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            setArticles(prevArticles =>
                prevArticles.map(a =>
                    a._id === article._id ? { ...a, isSaved: true } : a
                )
            );
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
    }, [toast]);

    const handleReadArticle = async (article) => {
        try {
            setLoading(true);
            const fullArticle = await getArticleById(article._id);
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

    return (
        <Box bg="gray.50" minHeight="100vh">
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    <Heading textAlign="center" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} color="blue.600">
                        Discover Today's Top Stories
                    </Heading>
                    <Text textAlign="center" fontSize={{ base: "md", md: "lg" }} color="gray.600">
                        Stay informed with the latest news and articles from around the world.
                    </Text>
                    <Search onSearch={handleSearch} />
                    {error && (
                        <Text color="red.500" textAlign="center">{error}</Text>
                    )}
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {articles.map(article => (
                            <ArticleCard
                                key={article._id}
                                article={article}
                                onSave={handleSaveArticle}
                                onRead={() => handleReadArticle(article)}
                            />
                        ))}
                    </SimpleGrid>
                    {loading && (
                        <Center py={8}>
                            <Spinner size="xl" color="blue.500" />
                        </Center>
                    )}
                    {!isSearching && hasMore && (
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

            <Modal isOpen={isReadModalOpen} onClose={() => setIsReadModalOpen(false)} size="xl" scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent maxH="90vh">
                    <ModalCloseButton />
                    <ModalBody p={0}>
                        {selectedArticle && <ArticleDetail article={selectedArticle} />}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Home;