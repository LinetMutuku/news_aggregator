import React from 'react';
import { Box, Image, Badge, Text, Heading, Flex, Button, useColorModeValue, AspectRatio } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ArticleCard = ({ article, onSave, onDelete, showDeleteButton }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.100');
    const descriptionColor = useColorModeValue('gray.600', 'gray.300');

    const handleAction = () => {
        if (showDeleteButton) {
            onDelete(article);
        } else {
            onSave(article);
        }
    };

    // Use the correct image URL field based on the article structure
    const imageUrl = article.urlToImage || article.imageUrl;
    const sourceName = article.source?.name || article.source;

    return (
        <AspectRatio ratio={1}>
            <MotionBox
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="xl"
                bg={bgColor}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                display="flex"
                flexDirection="column"
            >
                <Image
                    src={imageUrl}
                    alt={article.title}
                    objectFit="cover"
                    flex="1"
                />

                <Box p={4} flex="1" display="flex" flexDirection="column">
                    <Flex justifyContent="space-between" alignItems="center" mb={2}>
                        <Badge borderRadius="full" px="2" colorScheme="teal">
                            {article.category}
                        </Badge>
                        <Button
                            size="sm"
                            colorScheme={showDeleteButton ? "red" : (article.isSaved ? "green" : "blue")}
                            onClick={handleAction}
                        >
                            {showDeleteButton ? "Unsave" : (article.isSaved ? "Saved" : "Save")}
                        </Button>
                    </Flex>

                    <Heading
                        as="h3"
                        fontSize="md"
                        fontWeight="semibold"
                        lineHeight="tight"
                        noOfLines={2}
                        color={textColor}
                        mb={2}
                    >
                        {article.title}
                    </Heading>

                    <Text
                        color={descriptionColor}
                        fontSize="xs"
                        noOfLines={2}
                        mb={2}
                        flex="1"
                    >
                        {article.description}
                    </Text>

                    <Flex justifyContent="space-between" alignItems="center" fontSize="2xs">
                        <Text
                            color={useColorModeValue('gray.500', 'gray.400')}
                            fontWeight="medium"
                        >
                            {sourceName}
                        </Text>
                        <Text
                            color={useColorModeValue('gray.500', 'gray.400')}
                        >
                            {new Date(article.publishedAt).toLocaleDateString()}
                        </Text>
                    </Flex>
                </Box>
            </MotionBox>
        </AspectRatio>
    );
};

export default ArticleCard;