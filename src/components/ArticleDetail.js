import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Heading, Text, Spinner } from "@chakra-ui/react";

const ArticleDetail = ({ articleId }) => {
    const [article, setArticle] = useState(null);
    const articles = useSelector(state => state.articles.articles);
    const savedArticles = useSelector(state => state.articles.savedArticles);

    useEffect(() => {
        const foundArticle = articles.find(a => a._id === articleId) || savedArticles.find(a => a._id === articleId);
        setArticle(foundArticle);
    }, [articleId, articles, savedArticles]);

    if (!article) {
        return <Spinner />;
    }

    return (
        <Box p={5}>
            <Heading as="h2" size="xl" mb={4}>{article.title}</Heading>
            <Text mb={4}>{article.description}</Text>
            <Text>Source: {article.source}</Text>
            <Text>Published: {new Date(article.publishedAt).toLocaleString()}</Text>
        </Box>
    );
};

export default ArticleDetail;