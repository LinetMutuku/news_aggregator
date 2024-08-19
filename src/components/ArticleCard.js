import React from 'react';
import { Box, Image, Badge, Text, Heading, Stack, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function ArticleCard({ article }) {
    return (
        <MotionBox
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            bg={useColorModeValue('white', 'gray.800')}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
        >
            <Image src={article.imageUrl} alt={article.title} h="200px" w="100%" objectFit="cover" />

            <Box p="6">
                <Stack direction="row" align="baseline">
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                        {article.category}
                    </Badge>
                    <Text
                        color={useColorModeValue('gray.500', 'gray.400')}
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                    >
                        {article.source} &bull; {new Date(article.publishedAt).toLocaleDateString()}
                    </Text>
                </Stack>

                <Heading
                    mt={2}
                    fontSize="xl"
                    fontWeight="semibold"
                    lineHeight="short"
                    isTruncated
                >
                    {article.title}
                </Heading>

                <Text mt={2} color={useColorModeValue('gray.600', 'gray.300')} fontSize="sm">
                    {article.description}
                </Text>
            </Box>
        </MotionBox>
    );
}

export default ArticleCard;