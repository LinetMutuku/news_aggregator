import React from 'react';
import { SimpleGrid, Container, VStack } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';

const ArticleGrid = ({ articles, onSave }) => {
    return (
        <Container maxW="container.xl" py={16}>
            <VStack spacing={16} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={12}>
                    {articles.map(article => (
                        <ArticleCard
                            key={article._id || article.id}
                            article={article}
                            onSave={onSave}
                        />
                    ))}
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default ArticleGrid;