import React from 'react';
import { Box, Image, Text, VStack, Link, Badge, Heading, Flex, useColorModeValue } from "@chakra-ui/react";

function ArticleDetail({ article }) {
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.100');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <VStack spacing={6} align="stretch">
                {article.imageUrl && (
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        borderRadius="md"
                        objectFit="cover"
                        maxH="400px"
                        w="100%"
                    />
                )}

                <Heading as="h1" size="xl" color={textColor}>
                    {article.title}
                </Heading>

                <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
                    <Badge colorScheme="blue" fontSize="md" px={2} py={1}>
                        {article.category}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                        Published on: {new Date(article.publishedAt).toLocaleDateString()}
                    </Text>
                </Flex>

                <Text fontSize="lg" color={textColor}>
                    {article.description}
                </Text>

                {article.content && (
                    <Text fontSize="md" color={textColor}>
                        {article.content}
                    </Text>
                )}

                <Box>
                    <Text fontWeight="bold" color={textColor}>Source: </Text>
                    <Text color={textColor}>{article.source?.name || article.source}</Text>
                </Box>

                {article.author && (
                    <Box>
                        <Text fontWeight="bold" color={textColor}>Author: </Text>
                        <Text color={textColor}>{article.author}</Text>
                    </Box>
                )}

                <Link href={article.url} isExternal color="blue.500" fontWeight="bold">
                    Read full article on original source
                </Link>
            </VStack>
        </Box>
    );
}

export default ArticleDetail;