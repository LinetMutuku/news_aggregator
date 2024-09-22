import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Heading, Text, Image, Link, VStack, HStack, Badge } from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';

const ArticleDetail = () => {
    const selectedArticle = useSelector(state => state.articles.selectedArticle);
    const articles = useSelector(state => state.articles.articles);
    const savedArticles = useSelector(state => state.articles.savedArticles);

    const article = selectedArticle ?
        (articles.find(a => a._id === selectedArticle) || savedArticles.find(a => a._id === selectedArticle))
        : null;

    if (!article) {
        return null;
    }

    const imageUrl = article.urlToImage || article.imageUrl;

    console.log('Article data:', article); // For debugging

    return (
        <Box p={4} bg="white" borderRadius="lg" boxShadow="xl" maxW="800px" mx="auto">
            <VStack spacing={4} align="stretch">
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={article.title}
                        borderRadius="md"
                        objectFit="cover"
                        maxH="400px"
                        w="100%"
                    />
                )}
                <Heading as="h2" size="xl" color="blue.600">{article.title}</Heading>
                <HStack spacing={4}>
                    <Badge colorScheme="teal">{article.source}</Badge>
                    <Text fontSize="sm" color="gray.500">
                        Published: {new Date(article.publishedAt).toLocaleString()}
                    </Text>
                </HStack>
                <Text fontSize="lg" fontWeight="bold">{article.description}</Text>
                <Text fontSize="md">{article.content}</Text>
                <Link
                    href={article.url}
                    isExternal
                    color="blue.500"
                    fontWeight="semibold"
                    _hover={{ textDecoration: 'underline' }}
                >
                    Read full article from source <ExternalLinkIcon mx="2px" />
                </Link>
            </VStack>
        </Box>
    );
};

export default ArticleDetail;