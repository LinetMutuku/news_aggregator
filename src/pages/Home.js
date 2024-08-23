import React, { useState, useEffect, useCallback } from 'react';
import { Box, VStack, Heading, Spinner, useToast } from "@chakra-ui/react";
import ArticleGrid from '../components/ArticleGrid';
import { getRecommendedArticles, saveArticle } from '../utils/api';
import { useInView } from 'react-intersection-observer';

function Home() {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const loadArticles = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const newArticles = await getRecommendedArticles(page);
            if (Array.isArray(newArticles) && newArticles.length > 0) {
                setArticles(prevArticles => [...prevArticles, ...newArticles]);
                setPage(prevPage => prevPage + 1);
                setHasMore(newArticles.length === 20); // Assuming 20 is the limit
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
            toast({
                title: "Error fetching articles",
                description: error.message || "An unexpected error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, toast]);

    useEffect(() => {
        if (inView) {
            loadArticles();
        }
    }, [inView, loadArticles]);

    const handleSaveArticle = async (article) => {
        try {
            console.log('Saving article:', article);
            const savedArticle = await saveArticle({
                articleId: article.id,
                title: article.title,
                description: article.description,
                imageUrl: article.urlToImage,
                publishedAt: article.publishedAt,
                source: article.source.name,
                category: article.category || 'Uncategorized'
            });
            console.log('Article saved successfully:', savedArticle);
            toast({
                title: "Article saved",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            setArticles(prevArticles =>
                prevArticles.map(a =>
                    a.id === article.id ? { ...a, isSaved: true } : a
                )
            );
        } catch (error) {
            console.error('Error saving article:', error);
            toast({
                title: "Error saving article",
                description: error.message || "An unexpected error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box w="full">
            <VStack spacing={8} align="stretch">
                <Heading textAlign="center">Latest News</Heading>
                <ArticleGrid
                    articles={articles}
                    onSave={handleSaveArticle}
                    showDeleteButton={false}
                />
                {loading && (
                    <Box textAlign="center">
                        <Spinner size="xl" />
                    </Box>
                )}
                <Box ref={ref} h="20px" />
            </VStack>
        </Box>
    );
}

export default Home;