import React, { memo } from 'react';
import { SimpleGrid, Container, VStack, Text, Spinner, Center } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';

const ArticleGrid = memo(({ articles, onSave, onUnsave, onRead, loading, showUnsaveButton }) => {
    console.log('ArticleGrid rendered with', articles.length, 'articles');

    if (loading && articles.length === 0) {
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
                    {articles.map(article => (
                        <ArticleCard
                            key={article._id}
                            article={article}
                            onSave={onSave}
                            onUnsave={onUnsave}
                            onRead={onRead}
                            showUnsaveButton={showUnsaveButton}
                        />
                    ))}
                </SimpleGrid>
            </VStack>
        </Container>
    );
}, (prevProps, nextProps) => {
    return prevProps.loading === nextProps.loading &&
        prevProps.articles.length === nextProps.articles.length &&
        prevProps.articles.every((article, index) => article._id === nextProps.articles[index]._id) &&
        prevProps.showUnsaveButton === nextProps.showUnsaveButton;
});

ArticleGrid.displayName = 'ArticleGrid';

export default ArticleGrid;