import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SimpleGrid, Container, VStack, Text, Spinner, Center } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';
import { fetchArticles } from '../redux/actions/articleActions';

const ArticleGrid = memo(({ onSave, onUnsave, onDelete, onRead, isSavedPage }) => {
    const dispatch = useDispatch();
    const { articles, loading } = useSelector(state => state.articles);

    useEffect(() => {
        dispatch(fetchArticles());
    }, [dispatch]);

    console.log('ArticleGrid rendered with', articles.length, 'articles');

    const displayedArticles = articles.slice(0, 20); // Ensure only 20 articles are displayed

    if (loading && displayedArticles.length === 0) {
        return (
            <Center height="200px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!displayedArticles || displayedArticles.length === 0) {
        return (
            <Container maxW="container.xl" py={16}>
                <Text textAlign="center" fontSize="xl">No articles found. Check back later for updates!</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={8}>
                    {displayedArticles.map(article => (
                        <ArticleCard
                            key={article._id}
                            article={article}
                            onSave={onSave}
                            onUnsave={onUnsave}
                            onDelete={onDelete}
                            onRead={onRead}
                            isSavedPage={isSavedPage}
                        />
                    ))}
                </SimpleGrid>
            </VStack>
        </Container>
    );
});

ArticleGrid.displayName = 'ArticleGrid';

export default ArticleGrid;