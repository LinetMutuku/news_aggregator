import React, { useState, useEffect, useCallback } from 'react';
import { Box, Heading, VStack, Spinner, useToast } from "@chakra-ui/react";
import ArticleGrid from '../components/ArticleGrid';
import { getRecommendedArticles } from '../utils/api';
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

    return (
        <Box w="full">
            <VStack spacing={8} align="stretch">
                <Heading textAlign="center">Latest News</Heading>
                <ArticleGrid articles={articles} />
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