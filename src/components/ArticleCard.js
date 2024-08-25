import React from 'react';
import { Box, Image, Badge, Text, Heading, Flex, Button, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ArticleCard = ({ article, onSave, onDelete, onRead, showDeleteButton, deleteButtonColor }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.100');
    const descriptionColor = useColorModeValue('gray.600', 'gray.300');

    const handleAction = (e) => {
        e.stopPropagation();
        if (showDeleteButton) {
            onDelete(article);
        } else if (onSave) {
            onSave(article);
        }
    };

    const imageUrl = article.urlToImage || article.imageUrl;
    const sourceName = article.source?.name || article.source;

    return (
        <MotionBox
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            bg={bgColor}
            whileHover={{ y: -5, boxShadow: "xl" }}
            transition={{ duration: 0.3 }}
            onClick={() => onRead(article)}
            cursor="pointer"
            height="100%"
            display="flex"
            flexDirection="column"
        >
            <Image
                src={imageUrl}
                alt={article.title}
                objectFit="cover"
                height="200px"
                width="100%"
            />

            <Box p={5} flex="1" display="flex" flexDirection="column">
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                        {article.category}
                    </Badge>
                    {(onSave || showDeleteButton) && (
                        <Button
                            size="sm"
                            colorScheme={showDeleteButton ? "red" : "blue"}
                            onClick={handleAction}
                            variant="outline"
                        >
                            {showDeleteButton ? "Unsave" : (article.isSaved ? "Saved" : "Save")}
                        </Button>
                    )}
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
                    {article.title}
                </Heading>

                <Text
                    color={descriptionColor}
                    fontSize="sm"
                    noOfLines={3}
                    mb={4}
                    flex="1"
                >
                    {article.description}
                </Text>

                <Flex justifyContent="space-between" alignItems="center" fontSize="xs" mt="auto">
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
    );
};

export default ArticleCard;