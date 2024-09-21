import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, VStack, Heading, Container, Text,
    Alert, AlertIcon, AlertTitle, AlertDescription,
    Flex, Button
} from "@chakra-ui/react";
import { fetchArticles, searchArticlesAction, saveArticleAction, setSelectedArticle } from '../redux/actions/articleActions';
import Search from '../components/Search';
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import ErrorBoundary from '../components/ErrorBoundary';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { articles, error, totalPages, loading } = useSelector(state => state.articles);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        loadArticles(page);
    };

    const pageArticles = articles.slice((currentPage - 1) * 20, currentPage * 20);

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

                        <ArticleGrid
                            articles={pageArticles}
                            onSave={handleSaveArticle}
                            onRead={handleReadArticle}
                            loading={loading}
                        />

                        <Flex justifyContent="center" mt={4}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    mx={1}
                                    onClick={() => handlePageChange(page)}
                                    colorScheme={currentPage === page ? "blue" : "gray"}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Flex>
                    </VStack>
                </Container>

                {isModalOpen && (
                    <ArticleDetail
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                    />
                )}
            </Box>
        </ErrorBoundary>
    );
}

export default Home;