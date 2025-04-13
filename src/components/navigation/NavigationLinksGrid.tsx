
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import NavigationLinkCard from './NavigationLinkCard';
import { NavigationLink } from '@/types/navigation';
import { toast } from 'sonner';

const NavigationLinksGrid: React.FC = () => {
  const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNavigationLinks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('navigation_link')
          .select('*')
          .order('position', { ascending: true });
        
        if (error) throw error;
        
        setNavigationLinks(data || []);
      } catch (err) {
        console.error('Error fetching navigation links:', err);
        setError('Failed to load navigation links');
        toast.error('Failed to load navigation links');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNavigationLinks();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading navigation links...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (navigationLinks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No navigation links found</h3>
        <p className="text-gray-500">Navigation links will appear here once added to the database</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {navigationLinks.map((link, index) => (
        <NavigationLinkCard
          key={index}
          title={link.link_text || 'Untitled Link'}
          url={link.url || '#'}
          position={link.position || undefined}
        />
      ))}
    </div>
  );
};

export default NavigationLinksGrid;
