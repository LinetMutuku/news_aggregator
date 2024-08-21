import React from 'react';
import { Box, Image, Badge, Text, Heading, Flex, Button, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function ArticleCard({ article, onSave }) {
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'gray.100');
    const descriptionColor = useColorModeValue('gray.600', 'gray.300');

    return (
        <MotionBox
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg={bgColor}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Image
                src={article.imageUrl}
                alt={article.title}
                h="250px"
                w="100%"
                objectFit="cover"
            />

            <Box p="6">
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                        {article.category}
                    </Badge>
                    <Button
                        size="sm"
                        colorScheme={article.isSaved ? "green" : "blue"}
                        onClick={() => onSave(article.id)}
                    >
                        {article.isSaved ? "Saved" : "Save"}
                    </Button>
                </Flex>

                <Heading
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
                    fontSize="md"
                    noOfLines={3}
                    mb={4}
                >
                    {article.description}
                </Text>

                <Flex justifyContent="space-between" alignItems="center">
                    <Text
                        color={useColorModeValue('gray.500', 'gray.400')}
                        fontWeight="medium"
                        fontSize="sm"
                    >
                        {article.source}
                    </Text>
                    <Text
                        color={useColorModeValue('gray.500', 'gray.400')}
                        fontSize="sm"
                    >
                        {new Date(article.publishedAt).toLocaleDateString()}
                    </Text>
                </Flex>
            </Box>
        </MotionBox>
    );
}

export default ArticleCard;