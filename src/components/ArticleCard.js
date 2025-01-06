import React from 'react';
import {
    Box,
    Image,
    Badge,
    Text,
    Heading,
    Flex,
    Button,
    useColorModeValue,
    VStack,
    HStack,
    AspectRatio,
    IconButton
} from "@chakra-ui/react";
import { DeleteIcon, StarIcon } from '@chakra-ui/icons';

const ArticleCard = ({ article, onSave, onUnsave, onDelete, onRead, isSavedPage }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.900', 'white');
    const descriptionColor = useColorModeValue('gray.600', 'gray.300');
    const sourceColor = useColorModeValue('gray.500', 'gray.400');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const buttonBg = useColorModeValue('blue.50', 'blue.900');
    const buttonColor = useColorModeValue('blue.600', 'blue.200');
    const buttonHoverBg = useColorModeValue('blue.100', 'blue.800');
    const deleteButtonBg = useColorModeValue('red.50', 'red.900');
    const deleteButtonColor = useColorModeValue('red.600', 'red.200');
    const deleteButtonHoverBg = useColorModeValue('red.100', 'red.800');

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

    const imageUrl = article.urlToImage || article.imageUrl || '/api/placeholder/400/320';
    const sourceName = article.source?.name || article.source || 'Unknown Source';
    const publishDate = article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString()
        : 'Date unknown';

    return (
        <Box
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            overflow="hidden"
            bg={bgColor}
            height="full"
            maxW="sm"
            transition="all 0.2s"
            _hover={{
                transform: 'translateY(-2px)',
                shadow: 'md',
            }}
            role="group"
        >
            <VStack spacing={0} height="full">
                <Box onClick={handleRead} cursor="pointer" width="full" flex="1">
                    <AspectRatio ratio={16/9} maxH="160px">
                        <Image
                            src={imageUrl}
                            alt={article.title || 'Article image'}
                            objectFit="cover"
                            transition="0.2s transform"
                            _groupHover={{ transform: 'scale(1.03)' }}
                        />
                    </AspectRatio>

                    <VStack p={4} align="stretch" spacing={3} flex="1">
                        <HStack justify="space-between">
                            <Badge
                                colorScheme="blue"
                                px={2}
                                py={0.5}
                                borderRadius="full"
                                textTransform="none"
                                fontSize="xs"
                            >
                                {article.category || 'Uncategorized'}
                            </Badge>
                        </HStack>

                        <Heading
                            size="sm"
                            color={textColor}
                            noOfLines={2}
                            lineHeight="tight"
                        >
                            {article.title || 'Untitled Article'}
                        </Heading>

                        <Text
                            color={descriptionColor}
                            fontSize="xs"
                            noOfLines={2}
                            flex="1"
                        >
                            {article.description || 'No description available'}
                        </Text>

                        <HStack justify="space-between" fontSize="xs">
                            <Text color={sourceColor} fontWeight="medium">
                                {sourceName}
                            </Text>
                            <Text color={sourceColor}>
                                {publishDate}
                            </Text>
                        </HStack>
                    </VStack>
                </Box>

                <Flex
                    justify="flex-end"
                    p={2}
                    borderTop="1px"
                    borderColor={borderColor}
                    width="full"
                    gap={2}
                >
                    {!isSavedPage && onSave && (
                        <>
                            <Button
                                size="xs"
                                bg={buttonBg}
                                color={buttonColor}
                                border="1px"
                                borderColor={buttonColor}
                                onClick={handleSave}
                                _hover={{ bg: buttonHoverBg }}
                                leftIcon={<StarIcon />}
                            >
                                Save
                            </Button>
                            <IconButton
                                size="xs"
                                icon={<DeleteIcon />}
                                bg={deleteButtonBg}
                                color={deleteButtonColor}
                                border="1px"
                                borderColor={deleteButtonColor}
                                onClick={handleDelete}
                                _hover={{ bg: deleteButtonHoverBg }}
                                aria-label="Delete article"
                            />
                        </>
                    )}
                    {isSavedPage && onUnsave && (
                        <Button
                            size="xs"
                            bg={deleteButtonBg}
                            color={deleteButtonColor}
                            border="1px"
                            borderColor={deleteButtonColor}
                            onClick={handleUnsave}
                            _hover={{ bg: deleteButtonHoverBg }}
                            leftIcon={<DeleteIcon />}
                        >
                            Unsave
                        </Button>
                    )}
                </Flex>
            </VStack>
        </Box>
    );
};

export default ArticleCard;