import { useState, useEffect } from 'react';
import quotesService from '@/services/api/quotesService';

export function useQuotes(filters = {}) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quotesService.getAll(filters);
      setQuotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [filters.searchTerm, filters.status]);

  const createQuote = async (quoteData) => {
    const newQuote = await quotesService.create(quoteData);
    if (newQuote) {
      await fetchQuotes();
    }
    return newQuote;
  };

  const updateQuote = async (quoteId, quoteData) => {
    const updatedQuote = await quotesService.update(quoteId, quoteData);
    if (updatedQuote) {
      await fetchQuotes();
    }
    return updatedQuote;
  };

  const deleteQuote = async (quoteId) => {
    const success = await quotesService.delete(quoteId);
    if (success) {
      await fetchQuotes();
    }
    return success;
  };

  const refreshQuotes = () => {
    fetchQuotes();
  };

  return {
    quotes,
    loading,
    error,
    createQuote,
    updateQuote,
    deleteQuote,
    refreshQuotes
  };
}