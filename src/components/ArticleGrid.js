import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    SimpleGrid,
    Container,
    VStack,
    Text,
    Spinner,
    Center,
    Alert,
    AlertIcon,
    Box,
    useColorModeValue
} from "@chakra-ui/react";
import ArticleCard from './ArticleCard';
import { fetchArticles, fetchSavedArticles } from '../redux/actions/articleActions';

const LoadingState = () => (
    <Center height="40vh">
        <VStack spacing={3}>
            <Spinner
                size="md"
                thickness="3px"
                speed="0.65s"
                color="blue.500"
            />
            <Text color="gray.500" fontSize="sm">
                Loading articles...
            </Text>
        </VStack>
    </Center>
);

const EmptyState = ({ message }) => (
    <Center height="40vh">
        <VStack
            spacing={3}
            p={6}
            borderRadius="lg"
            bg={useColorModeValue('gray.50', 'gray.800')}
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            maxW="sm"
            textAlign="center"
        >
            <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.300')}>
                {message}
            </Text>
        </VStack>
    </Center>
);

const ArticleGrid = memo(({
                              onSave,
                              onUnsave,
                              onDelete,
                              onRead,
                              isSavedPage,
                              currentPage,
                              onPageChange
                          }) => {
    const dispatch = useDispatch();
    const { articles, savedArticles, loading, error } = useSelector(state => state.articles);
    const bgColor = useColorModeValue('gray.50', 'gray.900');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isSavedPage) {
                    await dispatch(fetchSavedArticles());
                } else {
                    await dispatch(fetchArticles(currentPage));
                }
            } catch (err) {
                console.error('Error fetching articles:', err);
            }
        };

        fetchData();
    }, [dispatch, isSavedPage, currentPage]);

    const displayedArticles = isSavedPage ? savedArticles : articles;

    if (error) {
        return (
            <Container maxW="7xl" py={4}>
                <Alert status="error" borderRadius="md" size="sm">
                    <AlertIcon />
                    {error}
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return <LoadingState />;
    }

    if (!displayedArticles?.length) {
        const message = isSavedPage
            ? "No saved articles yet. Start exploring and save articles you like!"
            : "No articles available at the moment. Check back soon!";
        return <EmptyState message={message} />;
    }

    return (
        <Box bg={bgColor} minH="100vh" py={4}>
            <Container maxW="7xl" px={{ base: 4, md: 6 }}>
                <VStack spacing={4} align="stretch">
                    <SimpleGrid
                        columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
                        spacing={4}
                        autoRows="1fr"
                    >
                        {displayedArticles.map(article => (
                            <ArticleCard
                                key={article._id}
                                article={article}
                                onSave={!isSavedPage ? onSave : null}
                                onUnsave={isSavedPage ? onUnsave : null}
                                onDelete={onDelete}
                                onRead={onRead}
                                isSavedPage={isSavedPage}
                            />
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
});

ArticleGrid.displayName = 'ArticleGrid';

export default ArticleGrid;