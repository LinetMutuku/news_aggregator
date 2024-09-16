import React from 'react';
import { SimpleGrid, Container, VStack, Text, Spinner, Center } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';

const ArticleGrid = React.memo(({ articles, onSave, onRead, loading }) => {
    console.log('ArticleGrid received articles:', articles);

    if (loading) {
        return (
            <Center height="200px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!articles || articles.length === 0) {
        console.log('No articles to display');
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
                            key={article._id || article.id || article.articleId}
                            article={article}
                            onSave={onSave}
                            onRead={onRead}
                        />
                    ))}
                </SimpleGrid>
            </VStack>
        </Container>
    );
}, (prevProps, nextProps) => {
    return prevProps.loading === nextProps.loading &&
        prevProps.articles === nextProps.articles &&
        prevProps.onSave === nextProps.onSave &&
        prevProps.onRead === nextProps.onRead;
});

export default ArticleGrid;