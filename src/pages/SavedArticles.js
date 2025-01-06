import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, VStack, Heading, Text, useToast, Spinner,
    Container, useColorModeValue, Fade, Input, InputGroup, InputLeftElement,
    Button, Alert, AlertIcon, Flex, AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Link, Image
} from "@chakra-ui/react";
import { SearchIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import ArticleGrid from '../components/ArticleGrid';
import { fetchSavedArticles, unsaveArticleAction } from '../redux/actions/articleActions';
import useDebounce from '../hooks/useDebounce';

const ITEMS_PER_PAGE = 20;

function SavedArticles() {
    const dispatch = useDispatch();
    const { savedArticles, loading, error } = useSelector(state => state.articles);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const toast = useToast();
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [isUnsaveDialogOpen, setIsUnsaveDialogOpen] = useState(false);
    const [articleToUnsave, setArticleToUnsave] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const cancelRef = useRef();

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const headingColor = useColorModeValue('blue.600', 'blue.300');
    const inputBgColor = useColorModeValue('white', 'gray.700');

    // Calculate pagination
    const totalArticles = filteredArticles.length;
    const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentArticles = filteredArticles.slice(startIndex, endIndex);


    useEffect(() => {
        // Only fetch if we don't have articles and aren't currently loading
        if (!savedArticles?.length && !loading) {
            dispatch(fetchSavedArticles());
        }
    }, [dispatch]); // Remove loadSavedArticles from dependencies



    // Filter articles based on search query
    useEffect(() => {
        if (!savedArticles) return;

        const filtered = savedArticles.filter(article => {
            if (!debouncedSearchQuery) return true;

            const searchTerm = debouncedSearchQuery.toLowerCase();
            return (
                article.title?.toLowerCase().includes(searchTerm) ||
                article.description?.toLowerCase().includes(searchTerm)
            );
        });

        setFilteredArticles(filtered);
        setCurrentPage(1); // Reset to first page when search changes
    }, [debouncedSearchQuery, savedArticles]);

    const handleUnsave = useCallback((article) => {
        setArticleToUnsave(article);
        setIsUnsaveDialogOpen(true);
    }, []);

    const confirmUnsave = async () => {
        if (articleToUnsave) {
            try {
                await dispatch(unsaveArticleAction(articleToUnsave));
                toast({
                    title: "Article unsaved",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

            } catch (error) {
                toast({
                    title: "Error unsaving article",
                    description: error.message || "An unexpected error occurred",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        setIsUnsaveDialogOpen(false);
        setArticleToUnsave(null);
    };

    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [totalPages]);

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    const renderPagination = useCallback(() => {
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return (
            <Flex justify="center" align="center" mt={6} mb={8}>
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                    size="sm"
                    mr={2}
                >
                    Previous
                </Button>

                {startPage > 1 && (
                    <>
                        <Button
                            onClick={() => handlePageChange(1)}
                            size="sm"
                            mx={1}
                            colorScheme={currentPage === 1 ? "blue" : "gray"}
                        >
                            1
                        </Button>
                        {startPage > 2 && <Text mx={2}>...</Text>}
                    </>
                )}

                {Array.from({ length: endPage - startPage + 1 }).map((_, idx) => {
                    const pageNum = startPage + idx;
                    return (
                        <Button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            colorScheme={currentPage === pageNum ? "blue" : "gray"}
                            size="sm"
                            mx={1}
                        >
                            {pageNum}
                        </Button>
                    );
                })}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <Text mx={2}>...</Text>}
                        <Button
                            onClick={() => handlePageChange(totalPages)}
                            size="sm"
                            mx={1}
                            colorScheme={currentPage === totalPages ? "blue" : "gray"}
                        >
                            {totalPages}
                        </Button>
                    </>
                )}

                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                    size="sm"
                    ml={2}
                >
                    Next
                </Button>
            </Flex>
        );
    }, [currentPage, totalPages, handlePageChange]);

    if (loading && (!savedArticles || savedArticles.length === 0)) {
        return (
            <Box textAlign="center" py={10} bg={bgColor} minH="100vh">
                <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
                <Text mt={4} color={textColor}>Loading saved articles...</Text>
            </Box>
        );
    }

    return (
        <Box bg={bgColor} minHeight="100vh">
            <Container maxW="container.xl">
                <VStack spacing={8} align="stretch" py={8}>
                    <Heading textAlign="center" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} color={headingColor} fontWeight="bold">
                        Your Saved Articles
                    </Heading>

                    <Text textAlign="center" fontSize={{ base: "md", md: "lg" }} color={textColor}>
                        {totalArticles} {totalArticles === 1 ? 'Article' : 'Articles'} Saved
                    </Text>

                    <Flex>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.300" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search saved articles"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                bg={inputBgColor}
                            />
                        </InputGroup>
                        {searchQuery && (
                            <Button ml={2} onClick={handleClearSearch} colorScheme="blue">
                                Clear
                            </Button>
                        )}
                    </Flex>

                    {error && (
                        <Alert status="error">
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    <Fade in={true}>
                        <ArticleGrid
                            articles={currentArticles}
                            onSave={null}
                            onUnsave={handleUnsave}
                            onDelete={null}
                            onRead={setSelectedArticle}
                            isSavedPage={true}
                        />
                        {totalPages > 1 && renderPagination()}
                    </Fade>
                </VStack>
            </Container>

            <AlertDialog
                isOpen={isUnsaveDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsUnsaveDialogOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Unsave Article
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to unsave this article? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsUnsaveDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={confirmUnsave} ml={3}>
                                Unsave
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <Modal isOpen={!!selectedArticle} onClose={() => setSelectedArticle(null)} size="xl">
                <ModalOverlay />
                <ModalContent maxW="900px">
                    <ModalHeader>{selectedArticle?.title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedArticle?.imageUrl && (
                            <Image
                                src={selectedArticle.imageUrl}
                                alt={selectedArticle.title}
                                maxH="400px"
                                w="100%"
                                objectFit="cover"
                                mb={4}
                            />
                        )}
                        <Text fontSize="lg" mb={4}>{selectedArticle?.description}</Text>
                        <Text>{selectedArticle?.content}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Link href={selectedArticle?.url} isExternal mr={3}>
                            Read Original Article <ExternalLinkIcon mx="2px" />
                        </Link>
                        <Button colorScheme="blue" onClick={() => setSelectedArticle(null)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default SavedArticles;