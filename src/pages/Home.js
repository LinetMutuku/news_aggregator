import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    VStack,
    Heading,
    Spinner,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Container,
    Text,
    Fade,
    useColorModeValue,
    Input,
    InputGroup,
    InputLeftElement,
    Button
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import { getRecommendedArticles, saveArticle, getArticleById, searchArticles } from '../utils/api';
import { useInView } from 'react-intersection-observer';

function Home() {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const toast = useToast();

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const headingColor = useColorModeValue('blue.600', 'blue.300');
    const inputBgColor = useColorModeValue('white', 'gray.700');

    const loadArticles = useCallback(async () => {
        if (loading || !hasMore || isSearching) return;
        setLoading(true);
        try {
            const newArticles = await getRecommendedArticles(page);
            if (Array.isArray(newArticles) && newArticles.length > 0) {
                setArticles(prevArticles => [...prevArticles, ...newArticles]);
                setPage(prevPage => prevPage + 1);
                setHasMore(newArticles.length === 20); // Assuming 20 is the limit
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
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
    }, [page, loading, hasMore, toast, isSearching]);

    useEffect(() => {
        if (inView && !isSearching) {
            loadArticles();
        }
    }, [inView, loadArticles, isSearching]);

    const handleSaveArticle = async (article) => {
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
                description: error.response?.data?.error || error.message || "An unexpected error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleReadArticle = async (article) => {
        try {
            setLoading(true);
            if (!article._id) {
                throw new Error('Invalid article ID');
            }
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

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        setLoading(true);
        try {
            const searchResults = await searchArticles(searchQuery);
            setArticles(searchResults.articles);
            setHasMore(searchResults.currentPage < searchResults.totalPages);
            setPage(searchResults.currentPage + 1);
        } catch (error) {
            console.error('Error searching articles:', error);
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
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        setArticles([]);
        setPage(1);
        setHasMore(true);
        loadArticles();
    };

    return (
        <Box w="full" bg={bgColor} minH="100vh" py={8}>
            <Container maxW="container.xl">
                <VStack spacing={8} align="stretch">
                    <Heading textAlign="center" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} color={headingColor} fontWeight="bold">
                        Discover Today's Top Stories
                    </Heading>
                    <Text textAlign="center" fontSize={{ base: "md", md: "lg" }} color={textColor}>
                        Stay informed with the latest news and articles from around the world.
                    </Text>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search articles"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            bg={inputBgColor}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button ml={2} onClick={handleSearch} isLoading={loading}>
                            Search
                        </Button>
                        {isSearching && (
                            <Button ml={2} onClick={handleClearSearch}>
                                Clear
                            </Button>
                        )}
                    </InputGroup>
                    <Fade in={true}>
                        <ArticleGrid
                            articles={articles}
                            onSave={handleSaveArticle}
                            onRead={handleReadArticle}
                            showDeleteButton={false}
                            saveButtonColor="blue.400"
                        />
                    </Fade>
                    {loading && (
                        <Box textAlign="center" py={8}>
                            <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
                            <Text mt={4} color={textColor}>Loading more stories...</Text>
                        </Box>
                    )}
                    {!isSearching && <Box ref={ref} h="20px" />}
                </VStack>
            </Container>

            <Modal isOpen={isReadModalOpen} onClose={() => setIsReadModalOpen(false)} size="xl" scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent maxH="90vh" bg={bgColor}>
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