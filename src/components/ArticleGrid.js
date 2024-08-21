import React from 'react';
import { SimpleGrid } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';

function ArticleGrid({ articles, onSave }) {
    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {articles.map(article => (
                <ArticleCard
                    key={article.id}
                    article={article}
                    onSave={onSave}
                />
            ))}
        </SimpleGrid>
    );
}

export default ArticleGrid;