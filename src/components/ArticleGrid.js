import React, { useCallback } from 'react';
import { SimpleGrid, Container, VStack, Text, Spinner, Center, useToast } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';

const ArticleGrid = React.memo(({ articles, onSave, onRead, onUnsave, loading, showUnsaveButton }) => {
    console.log('ArticleGrid received articles:', articles);
    const toast = useToast();

    const handleUnsave = useCallback((article) => {
        if (article && (article._id || article.articleId)) {
            onUnsave(article);
        } else {
            console.error('Attempted to unsave an article with missing or invalid ID:', article);
            toast({
                title: "Error",
                description: "Unable to unsave this article due to a missing or invalid ID.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [onUnsave, toast]);

    const handleSave = useCallback((article) => {
        if (article && (article._id || article.articleId)) {
            onSave(article);
        } else {
            console.error('Attempted to save an article with missing or invalid ID:', article);
            toast({
                title: "Error",
                description: "Unable to save this article due to a missing or invalid ID.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [onSave, toast]);

    const handleRead = useCallback((article) => {
        if (article && (article._id || article.articleId)) {
            onRead(article);
        } else {
            console.error('Attempted to read an article with missing or invalid ID:', article);
            toast({
                title: "Error",
                description: "Unable to read this article due to a missing or invalid ID.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [onRead, toast]);

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
                            key={article._id || article.articleId}
                            article={article}
                            onSave={() => handleSave(article)}
                            onRead={() => handleRead(article)}
                            onDelete={() => handleUnsave(article)}
                            showDeleteButton={showUnsaveButton}
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
        prevProps.onRead === nextProps.onRead &&
        prevProps.onUnsave === nextProps.onUnsave &&
        prevProps.showUnsaveButton === nextProps.showUnsaveButton;
});

export default ArticleGrid;