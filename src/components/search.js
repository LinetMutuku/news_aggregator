import React, { useState, useEffect } from 'react';
import {
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Flex
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';
import useDebounce from '../hooks/useDebounce'; // Adjust the path as needed

function Search({ onSearch, inputBgColor }) {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        if (debouncedSearchQuery) {
            onSearch(debouncedSearchQuery);
        }
    }, [debouncedSearchQuery, onSearch]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        onSearch('');
    };

    return (
        <Flex>
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                    placeholder="Search articles"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    bg={inputBgColor}
                />
            </InputGroup>
            {searchQuery && (
                <Button onClick={handleClearSearch} ml={2}>
                    Clear
                </Button>
            )}
        </Flex>
    );
}

export default Search;