import React from 'react';
import { Box, Image, Badge, Text, Heading, Flex, Button, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ArticleCard = ({ article, onSave, onUnsave, onDelete, onRead, isSavedPage }) => {
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

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(article);
    };

    const handleRead = () => {
        onRead(article);
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
            height="100%"
            display="flex"
            flexDirection="column"
        >
            <Box onClick={handleRead} cursor="pointer">
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

                    <Flex justifyContent="space-between" alignItems="center" fontSize="xs">
                        <Text color={sourceColor} fontWeight="medium">
                            {sourceName}
                        </Text>
                        <Text color={sourceColor}>
                            {publishDate}
                        </Text>
                    </Flex>
                </Box>
            </Box>

            {/* Action Buttons */}
            <Flex justifyContent="flex-end" p={4} borderTop="1px" borderColor="gray.200">
                {!isSavedPage && onSave && (
                    <>
                        <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={handleSave}
                            mr={2}
                        >
                            Save
                        </Button>
                        <Button
                            size="sm"
                            colorScheme="red"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </>
                )}
                {isSavedPage && onUnsave && (
                    <Button
                        size="sm"
                        colorScheme="red"
                        onClick={handleUnsave}
                    >
                        Unsave
                    </Button>
                )}
            </Flex>
        </MotionBox>
    );
};

export default ArticleCard;