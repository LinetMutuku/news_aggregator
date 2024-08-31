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
    Alert,
    AlertIcon
} from "@chakra-ui/react";
import { useInView } from 'react-intersection-observer';
import Search from '../components/search'; // Import updated Search component
import ArticleGrid from '../components/ArticleGrid';
import ArticleDetail from '../components/ArticleDetail';
import { getRecommendedArticles, saveArticle, getArticleById, searchArticles } from '../utils/api';

// Import background images
import bg1 from '../images/bg1.jpg';
import bg2 from '../images/bg2.jpg';
import bg3 from '../images/bg3.jpg';

const BackgroundCarousel = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 10000); // Change image every 10 seconds

        return () => clearInterval(interval);
    }, [images]);

    return (
        <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bgImage={`url(${images[currentImageIndex]})`}
            bgPosition="center"
            bgRepeat="no-repeat"
            bgSize="cover"
            transition="background-image 1s ease-in-out"
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(5px)',
            }}
        />
    );
};

function Home() {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const toast = useToast();

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const textColor = useColorModeValue('gray.800', 'gray.100');
    const headingColor = useColorModeValue('blue.600', 'blue.300');
    const inputBgColor = useColorModeValue('white', 'gray.700');

    const backgroundImages = [bg1, bg2, bg3];

    const loadArticles = useCallback(async (isInitialLoad = false) => {
        if (loading || (!hasMore && !isInitialLoad) || isSearching) return;
        setLoading(true);
        try {
            const newArticles = await getRecommendedArticles(page);
            if (Array.isArray(newArticles) && newArticles.length > 0) {
                setArticles(prevArticles => isInitialLoad ? newArticles : [...prevArticles, ...newArticles]);
                setPage(prevPage => prevPage + 1);
                setHasMore(newArticles.length === 20); // Assuming 20 is the limit
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
    }, [page, loading, hasMore, isSearching, toast]);

    useEffect(() => {
        loadArticles(true);
    }, [loadArticles]);

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
            const fullArticle = await getArticleById(article._id);
            setSelectedArticle(fullArticle);
            setIsReadModalOpen(true);
        } catch (error) {
            console.error('Error fetching full article:', error);
            toast({
                title: "Error fetching article",
                description: "Unable to load the full article. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setIsSearching(false);
            setArticles([]);
            setPage(1);
            setHasMore(true);
            loadArticles(true);
            return;
        }
        setIsSearching(true);
        setLoading(true);
        try {
            const searchResults = await searchArticles(query);
            setArticles(Array.isArray(searchResults) ? searchResults : []);
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
            setIsSearching(false);
        }
    }, [loadArticles, toast]);

    return (
        <Box position="relative" minH="100vh">
            <BackgroundCarousel images={backgroundImages} />
            <Container maxW="container.xl" position="relative" zIndex="1" p={4}>
                {error && (
                    <Alert status="error" mb={4}>
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
                <VStack spacing={4} align="start">
                    <Heading as="h1" size="2xl" color={headingColor}>
                        News Aggregator
                    </Heading>
                    <Search onSearch={handleSearch} inputBgColor={inputBgColor} />
                    {loading && <Spinner size="lg" />}
                    <ArticleGrid
                        articles={articles}
                        onSave={handleSaveArticle}
                        onRead={handleReadArticle}
                    />
                </VStack>
                <div ref={ref} />
            </Container>
            <Modal isOpen={isReadModalOpen} onClose={() => setIsReadModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        {loading && <Spinner size="lg" />}
                        {selectedArticle && (
                            <ArticleDetail article={selectedArticle} />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Home;
