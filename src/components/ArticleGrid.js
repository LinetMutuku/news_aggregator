import React from 'react';
import { SimpleGrid, Container, VStack, Text } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';

const ArticleGrid = ({ articles, onSave, onDelete, onRead, showDeleteButton, deleteButtonColor }) => {
    console.log('ArticleGrid received articles:', articles);

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
                    {articles.map(article => {
                        console.log('Rendering article:', article);
                        return (
                            <ArticleCard
                                key={article._id || article.id || article.articleId}
                                article={article}
                                onSave={onSave}
                                onDelete={onDelete}
                                onRead={onRead}
                                showDeleteButton={showDeleteButton}
                                deleteButtonColor={deleteButtonColor}
                            />
                        );
                    })}
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default ArticleGrid;