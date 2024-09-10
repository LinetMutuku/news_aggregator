import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, VStack, Heading, Spinner, useToast, Container, Text, Button,
    Center, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton
} from "@chakra-ui/react";
import Search from '../components/Search';
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import BackgroundCarousel from '../components/BackgroundCarousel';
import ErrorBoundary from '../components/ErrorBoundary';
import { fetchArticles, searchArticlesAction, saveArticleAction, setSelectedArticle } from '../redux/actions/articleActions';

import backgroundImage1 from '../images/bg1.jpg';
import backgroundImage2 from '../images/bg2.jpg';
import backgroundImage3 from '../images/bg3.jpg';

const backgroundImages = [backgroundImage1, backgroundImage2, backgroundImage3];

function Home() {
    const dispatch = useDispatch();
    const { articles, loading, error, hasMore, page, selectedArticle } = useSelector(state => state.articles);
    const toast = useToast();

    const loadArticles = useCallback((isInitialLoad = false) => {
        dispatch(fetchArticles(isInitialLoad ? 1 : page));
    }, [dispatch, page]);

    useEffect(() => {
        loadArticles(true);
    }, [loadArticles]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadArticles();
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) {
            loadArticles(true);
            return;
        }
        dispatch(searchArticlesAction(query));
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

    const handleReadArticle = async (article) => {
        dispatch(setSelectedArticle(article._id));
    };

    return (
        <Box position="relative" minHeight="100vh">
            <BackgroundCarousel images={backgroundImages} />
            <Box bg="rgba(255, 255, 255, 0.8)" minHeight="100vh">
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
                        <ErrorBoundary>
                            <ArticleGrid
                                articles={articles}
                                onSave={handleSaveArticle}
                                onRead={handleReadArticle}
                            />
                        </ErrorBoundary>
                        {loading && (
                            <Center py={8}>
                                <Spinner size="xl" color="blue.500" />
                            </Center>
                        )}
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

                <Modal isOpen={!!selectedArticle} onClose={() => dispatch(setSelectedArticle(null))} size="xl" scrollBehavior="inside">
                    <ModalOverlay />
                    <ModalContent maxH="90vh">
                        <ModalCloseButton />
                        <ModalBody p={0}>
                            {selectedArticle && <ArticleDetail article={selectedArticle} />}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </Box>
    );
}

export default Home;