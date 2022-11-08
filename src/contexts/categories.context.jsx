import { createContext, useState, useEffect } from 'react';
import { gql, useQuery } from "@apollo/client";

export const CategoriesContext = createContext({
  categoriesMap: {},
});

const COLLECTIONS = gql`
    query {
      collections {
          id
          title
          items {
              id
              name
              price
              imageUrl
          }
      }
    }
`;

export const CategoriesProvider = ({ children }) => {
  const { loading, data } = useQuery(COLLECTIONS);
  const [categoriesMap, setCategoriesMap] = useState({});

  useEffect(() => {
    if (data) {
        const { collections } = data;
        const categoriesMap = collections.reduce((acc, collection) => {
            const { title, items } = collection;
            acc[title.toLowerCase()] = items;
            return acc;
        }, {});
        setCategoriesMap(categoriesMap);
    }
  }, [data]);

  const value = { categoriesMap, loading };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
