import React, { useCallback, useMemo } from 'react';
import { SimpleGrid, Container, VStack, Text, Spinner, Center, useToast } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';

const ArticleGrid = React.memo(({ articles, onSave, onRead, onUnsave, loading, showUnsaveButton }) => {
    console.log('ArticleGrid rendered with', articles.length, 'articles');
    const toast = useToast();

    const handleAction = useCallback((action, article) => {
        if (article && (article._id || article.articleId)) {
            action(article);
        } else {
            console.error(`Attempted to perform action on an article with missing or invalid ID:`, article);
            toast({
                title: "Error",
                description: `Unable to perform this action due to a missing or invalid article ID.`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [toast]);

    const memoizedArticles = useMemo(() => articles.map(article => ({
        ...article,
        onSave: () => handleAction(onSave, article),
        onRead: () => handleAction(onRead, article),
        onDelete: () => handleAction(onUnsave, article)
    })), [articles, handleAction, onSave, onRead, onUnsave]);

    if (loading) {
        return (
            <Center height="200px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!articles || articles.length === 0) {
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
                    {memoizedArticles.map(article => (
                        <ArticleCard
                            key={article._id || article.articleId}
                            article={article}
                            onSave={article.onSave}
                            onRead={article.onRead}
                            onDelete={article.onDelete}
                            showDeleteButton={showUnsaveButton}
                        />
                    ))}
                </SimpleGrid>
            </VStack>
        </Container>
    );
}, (prevProps, nextProps) => {
    return prevProps.loading === nextProps.loading &&
        prevProps.articles.length === nextProps.articles.length &&
        prevProps.showUnsaveButton === nextProps.showUnsaveButton &&
        prevProps.articles.every((article, index) =>
            article._id === nextProps.articles[index]._id &&
            article.isSaved === nextProps.articles[index].isSaved
        );
});

ArticleGrid.displayName = 'ArticleGrid';

export default ArticleGrid;