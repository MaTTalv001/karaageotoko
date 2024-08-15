import { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';

const useRankings = () => {
  const [topRecords, setTopRecords] = useState({});
  const [detailedRankings, setDetailedRankings] = useState({});
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
        .select('stage, name, time')
        .order('time', { ascending: true });

      if (error) throw error;

      const top = {};
      const detailed = {};

      data.forEach(record => {
        const { stage, name, time } = record;
        
        // Update top records
        if (!top[stage] || time < top[stage].time) {
          top[stage] = { name, time };
        }

        // Update detailed rankings
        if (!detailed[stage]) {
          detailed[stage] = [];
        }
        if (detailed[stage].length < 5) {
          detailed[stage].push({ name, time });
        }
      });

      setTopRecords(top);
      setDetailedRankings(detailed);
      console.log('Fetched rankings:', { top, detailed });
    } catch (error) {
      setError('Failed to fetch rankings');
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRanking = async (name, stage, time) => {
    try {
      const { data, error } = await supabase
        .from('rankings')
        .insert([{ name, stage, time }]);

      if (error) throw error;

      console.log('Ranking added:', data);
      await fetchRankings(); // Refetch all rankings after adding a new one
    } catch (error) {
      console.error('Error adding ranking:', error);
    }
  };

  return { topRecords, detailedRankings, loading, error, addRanking };
};

export default useRankings;