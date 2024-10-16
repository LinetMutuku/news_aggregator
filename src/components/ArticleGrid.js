import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SimpleGrid, Container, VStack, Text, Spinner, Center } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';
import { fetchArticles, fetchSavedArticles } from '../redux/actions/articleActions';

const ArticleGrid = memo(({ onSave, onUnsave, onDelete, onRead, isSavedPage }) => {
    const dispatch = useDispatch();
    const { articles, savedArticles, loading } = useSelector(state => state.articles);

    useEffect(() => {
        if (isSavedPage) {
            dispatch(fetchSavedArticles());
        } else {
            dispatch(fetchArticles());
        }
    }, [dispatch, isSavedPage]);

    const displayedArticles = isSavedPage ? savedArticles : articles;
    console.log(`ArticleGrid rendered with ${displayedArticles.length} ${isSavedPage ? 'saved' : ''} articles`);

    const limitedArticles = displayedArticles.slice(0, 20); // Ensure only 20 articles are displayed

    if (loading && limitedArticles.length === 0) {
        return (
            <Center height="200px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!limitedArticles || limitedArticles.length === 0) {
        return (
            <Container maxW="container.xl" py={16}>
                <Text textAlign="center" fontSize="xl">
                    {isSavedPage
                        ? "You haven't saved any articles yet. Start saving articles to see them here!"
                        : "No articles found. Check back later for updates!"}
                </Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={8}>
                    {limitedArticles.map(article => (
                        <ArticleCard
                            key={article._id}
                            article={article}
                            onSave={isSavedPage ? null : onSave}
                            onUnsave={isSavedPage ? onUnsave : null}
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