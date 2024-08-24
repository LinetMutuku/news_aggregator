import React from 'react';
import { SimpleGrid, Container, VStack, Text } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';

const ArticleGrid = ({ articles, onSave, onDelete, showDeleteButton }) => {
    if (!articles || articles.length === 0) {
        return (
            <Container maxW="container.xl" py={16}>
                <Text textAlign="center">No articles found.</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={16}>
            <VStack spacing={16} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={12}>
                    {articles.map(article => (
                        <ArticleCard
                            key={article._id || article.id}
                            article={article}
                            onSave={onSave}
                            onDelete={onDelete}
                            showDeleteButton={showDeleteButton}
                        />
                    ))}
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default ArticleGrid;