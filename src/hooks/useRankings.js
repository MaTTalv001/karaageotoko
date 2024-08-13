import { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';

const useRankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('time', { ascending: true });

      if (error) throw error;

      setRankings(data);
      console.log('Fetched rankings:', data);
    } catch (error) {
      setError('Failed to fetch rankings');
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  return { rankings, loading, error, fetchRankings };
};

export default useRankings;