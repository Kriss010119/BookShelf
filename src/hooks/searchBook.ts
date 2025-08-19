export const searchBook = async (searchQuery: string) => {
    try {
        const response = await fetch(`https://gutendex.com/books?search=${searchQuery}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results[0];
        } else {
            throw new Error('No books found');
        }
    } catch (error) {
        console.error('Error fetching book:', error);
        throw error;
    }
};