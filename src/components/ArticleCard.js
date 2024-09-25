import React from 'react';
import { Box, Image, Badge, Text, Heading, Flex, Button, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ArticleCard = ({ article, onSave, onUnsave, onRead, isSavedPage }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.100');
    const descriptionColor = useColorModeValue('gray.600', 'gray.300');
    const sourceColor = useColorModeValue('gray.500', 'gray.400');

    const handleSave = (e) => {
        e.stopPropagation();
        onSave(article);
    };

    const handleUnsave = (e) => {
        e.stopPropagation();
        onUnsave(article);
    };

    const handleRead = () => {
        if (onRead) {
            onRead(article);
        }
    };

    const imageUrl = article.urlToImage || article.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
    const sourceName = article.source?.name || article.source || 'Unknown Source';
    const publishDate = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Date unknown';

    return (
        <MotionBox
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            bg={bgColor}
            whileHover={{ y: -5, boxShadow: "xl" }}
            transition={{ duration: 0.3 }}
            onClick={handleRead}
            cursor="pointer"
            height="100%"
            display="flex"
            flexDirection="column"
        >
            <Image
                src={imageUrl}
                alt={article.title || 'Article image'}
                objectFit="cover"
                height="200px"
                width="100%"
            />

            <Box p={5} flex="1" display="flex" flexDirection="column">
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                        {article.category || 'Uncategorized'}
                    </Badge>
                    <Flex>
                        {!isSavedPage && (
                            <>
                                <Button
                                    size="sm"
                                    colorScheme="blue"
                                    onClick={handleSave}
                                    variant="outline"
                                    mr={2}
                                >
                                    Save
                                </Button>
                                <Button
                                    size="sm"
                                    colorScheme="red"
                                    onClick={handleUnsave}
                                    variant="outline"
                                >
                                    Unsave
                                </Button>
                            </>
                        )}
                        {isSavedPage && (
                            <Button
                                size="sm"
                                colorScheme="red"
                                onClick={handleUnsave}
                                variant="outline"
                            >
                                Unsave
                            </Button>
                        )}
                    </Flex>
                </Flex>

                <Heading
                    as="h3"
                    fontSize="xl"
                    fontWeight="semibold"
                    lineHeight="tight"
                    noOfLines={2}
                    color={textColor}
                    mb={2}
                >
                    {article.title || 'Untitled Article'}
                </Heading>

                <Text
                    color={descriptionColor}
                    fontSize="sm"
                    noOfLines={3}
                    mb={4}
                    flex="1"
                >
                    {article.description || 'No description available'}
                </Text>

                <Flex justifyContent="space-between" alignItems="center" fontSize="xs" mt="auto">
                    <Text color={sourceColor} fontWeight="medium">
                        {sourceName}
                    </Text>
                    <Text color={sourceColor}>
                        {publishDate}
                    </Text>
                </Flex>
            </Box>
        </MotionBox>
    );
};

export default ArticleCard;