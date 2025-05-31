import React, { useEffect, useState } from "react";

const AppDebouncedSearch = ({onSearch}: {onSearch: (searchTerms: string) => void}) => {
      const [searchTerm, setSearchTerm] = useState("");

      useEffect(() => {
            const handler = setTimeout(() => {
                  if (searchTerm) {
                        onSearch(searchTerm);
                  }
            }, 500);

            return () => {
                  clearTimeout(handler);
            };
      }, [searchTerm, onSearch]);


      return (
            <>
                  {/* <p data-testid="search-term">{searchTerm}</p> */}
                  <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        data-testid="search-input"
                  />
            </>
      );
};

export default AppDebouncedSearch;
