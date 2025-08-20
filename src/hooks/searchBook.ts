export const searchBook = async (searchQuery: string) => {
  try {
    const response = await fetch(`https://gutendex.com/books?search=${searchQuery}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};
