import React from 'react';
import { SimpleGrid } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';

function ArticleGrid({ articles }) {
    return (
        <SimpleGrid columns={[1, null, 3]} spacing="40px">
            {articles.map(article => (
                <ArticleCard key={article._id} article={article} />
            ))}
        </SimpleGrid>
    );
}

export default ArticleGrid;