import { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';

const useRankings = () => {
  const [stageRecords, setStageRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStageRecords();
  }, []);

  const fetchStageRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rankings')
        .select('stage, name, time')
        .order('time', { ascending: true });

      if (error) throw error;

      const records = data.reduce((acc, record) => {
        if (!acc[record.stage] || record.time < acc[record.stage].time) {
          acc[record.stage] = { name: record.name, time: record.time };
        }
        return acc;
      }, {});

      setStageRecords(records);
      console.log('Fetched stage records:', records);
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
      await fetchStageRecords(); // 新しいランキングを追加した後、記録を再取得
    } catch (error) {
      console.error('Error adding ranking:', error);
    }
  };

  return { stageRecords, loading, error, addRanking };
};

export default useRankings;