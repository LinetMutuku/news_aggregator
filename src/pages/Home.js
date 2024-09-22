import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, VStack, Heading, Container, Text,
    Alert, AlertIcon, AlertTitle, AlertDescription,
    Flex, Button, useToast, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody
} from "@chakra-ui/react";
import { fetchArticles, searchArticlesAction, saveArticleAction, setSelectedArticle } from '../redux/actions/articleActions';
import Search from '../components/Search';
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import ErrorBoundary from '../components/ErrorBoundary';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();
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


    const handleReadArticle = useCallback((article) => {
        dispatch(setSelectedArticle(article._id));
        setIsModalOpen(true);
    }, [dispatch]);


    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        dispatch(setSelectedArticle(null));
    }, [dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            loadArticles(newPage);
        }
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
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
                    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
                    <ModalContent maxW="800px" w="95%" mx="auto" my="4" borderRadius="lg" overflow="hidden">
                        <ModalCloseButton zIndex="1" />
                        <ModalBody p={0}>
                            <ArticleDetail />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </ErrorBoundary>
    );
}

export default Home;