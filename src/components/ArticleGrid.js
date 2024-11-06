import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SimpleGrid, Container, VStack, Text, Spinner, Center, Button, Flex } from "@chakra-ui/react";
import ArticleCard from './ArticleCard';
import { fetchArticles, fetchSavedArticles } from '../redux/actions/articleActions';

const ArticleGrid = memo(({
                              onSave,
                              onUnsave,
                              onDelete,
                              onRead,
                              isSavedPage,
                              currentPage,
                              onPageChange
                          }) => {
    const dispatch = useDispatch();
    const { articles, savedArticles, loading, totalPages } = useSelector(state => state.articles);

    useEffect(() => {
        if (isSavedPage) {
            dispatch(fetchSavedArticles());
        } else {
            dispatch(fetchArticles(currentPage));
        }
    }, [dispatch, isSavedPage, currentPage]);

    const displayedArticles = isSavedPage ? savedArticles : articles;
    console.log(`ArticleGrid rendered with ${displayedArticles?.length || 0} ${isSavedPage ? 'saved' : ''} articles`);

    if (loading) {
        return (
            <Center height="200px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!displayedArticles?.length) {
        return (
            <Container maxW="container.xl" py={16}>
                <Text textAlign="center" fontSize="xl">
                    {isSavedPage
                        ? "You haven't saved any articles yet. Start saving articles to see them here!"
                        : "No articles found. Check back later for updates!"}
                </Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {displayedArticles.map(article => (
                        <ArticleCard
                            key={article._id}
                            article={article}
                            onSave={!isSavedPage ? onSave : null}
                            onUnsave={isSavedPage ? onUnsave : null}
                            onDelete={onDelete}
                            onRead={onRead}
                            isSavedPage={isSavedPage}
                        />
                    ))}
                </SimpleGrid>

                {totalPages > 1 && (
                    <Flex justifyContent="center" mt={4}>
                        <Button
                            onClick={() => onPageChange(currentPage - 1)}
                            isDisabled={currentPage === 1}
                            mr={2}
                        >
                            Previous
                        </Button>
                        <Text alignSelf="center" mx={2}>
                            Page {currentPage} of {totalPages}
                        </Text>
                        <Button
                            onClick={() => onPageChange(currentPage + 1)}
                            isDisabled={currentPage === totalPages}
                            ml={2}
                        >
                            Next
                        </Button>
                    </Flex>
                )}
            </VStack>
        </Container>
    );
});

ArticleGrid.displayName = 'ArticleGrid';

export default ArticleGrid;