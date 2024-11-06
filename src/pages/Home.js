import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, VStack, Heading, Container, Text, Image,
    Alert, AlertIcon, AlertTitle, AlertDescription,
    Flex, Button, useToast, useColorModeValue,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
    AlertDialogContent, AlertDialogOverlay,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Link
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { fetchArticles, searchArticlesAction, saveArticleAction, unsaveArticleAction, deleteArticleAction } from '../redux/actions/articleActions';
import Search from '../components/Search';
import ArticleGrid from '../components/ArticleGrid';
import ErrorBoundary from '../components/ErrorBoundary';

function Home() {
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const textColor = useColorModeValue("gray.800", "gray.100");
    const headingColor = useColorModeValue("blue.600", "blue.300");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();
    const { articles, error, totalPages, loading, currentPage } = useSelector(state => state.articles);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const cancelRef = useRef();

    const loadArticles = useCallback((page) => {
        console.log('loadArticles called with page:', page);
        dispatch(fetchArticles(page));
    }, [dispatch]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Home useEffect - token:', token ? 'exists' : 'missing');
        if (!token) {
            navigate('/login');
        } else {
            console.log('Calling loadArticles with currentPage:', currentPage);
            loadArticles(currentPage);
        }
    }, [loadArticles, navigate, currentPage]);

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

    const handleUnsaveArticle = useCallback((article) => {
        dispatch(unsaveArticleAction(article)).then((result) => {
            if (result.success) {
                toast({
                    title: "Article unsaved",
                    description: result.message,
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            }
        }).catch((error) => {
            toast({
                title: "Error unsaving article",
                description: error.message || "An unexpected error occurred.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        });
    }, [dispatch, toast]);

    const handleDeleteArticle = useCallback((article) => {
        setArticleToDelete(article);
        setIsDeleteDialogOpen(true);
    }, []);

    const confirmDelete = () => {
        if (articleToDelete) {
            dispatch(deleteArticleAction(articleToDelete._id)).then((result) => {
                if (result.success) {
                    toast({
                        title: "Article deleted",
                        description: result.message,
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                    });
                }
            }).catch((error) => {
                toast({
                    title: "Error deleting article",
                    description: error.message || "An unexpected error occurred.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            });
        }
        setIsDeleteDialogOpen(false);
        setArticleToDelete(null);
    };

    const cancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setArticleToDelete(null);
    };

    const handleReadArticle = useCallback((article) => {
        setSelectedArticle(article);
        setIsReadModalOpen(true);
    }, []);

    const handleCloseReadModal = () => {
        setIsReadModalOpen(false);
        setSelectedArticle(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            loadArticles(newPage);
        }
    };

    return (
        <ErrorBoundary>
            <Box minHeight="100vh" bg={bgColor} color={textColor}>
                <Container maxW="container.xl" py={8}>
                    <VStack spacing={8} align="stretch">
                        <Heading textAlign="center" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} color={headingColor}>
                            Discover Today's Top Stories
                        </Heading>
                        <Text textAlign="center" fontSize={{ base: "md", md: "lg" }}>
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
                            articles={articles}
                            onSave={handleSaveArticle}
                            onUnsave={handleUnsaveArticle}
                            onDelete={handleDeleteArticle}
                            onRead={handleReadArticle}
                            loading={loading}
                            isSavedPage={false}
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

                <AlertDialog
                    isOpen={isDeleteDialogOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={cancelDelete}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Delete Article
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure you want to delete this article? This action cannot be undone.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={cancelDelete}>
                                    Cancel
                                </Button>
                                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>

                <Modal isOpen={isReadModalOpen} onClose={handleCloseReadModal} size="xl">
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
                            <Button colorScheme="blue" onClick={handleCloseReadModal}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </ErrorBoundary>
    );
}

export default Home;