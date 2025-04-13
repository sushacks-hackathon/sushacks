
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { supabase } from '@/integrations/supabase/client';
import { NavigationLink } from '@/types/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const Resources: React.FC = () => {
  const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNavigationLinks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('navigation_link')
          .select('*')
          .order('position', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setNavigationLinks(data || []);
      } catch (err) {
        console.error('Error fetching navigation links:', err);
        toast.error('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNavigationLinks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600 mt-1">Access helpful resources and links for your professional journey</p>
        </div>
        
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading resources...</p>
            </div>
          ) : navigationLinks.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-500">Resources will appear here once added to the database</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {navigationLinks.map((link, index) => (
                <Card key={index} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{link.link_text || 'Untitled Resource'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {link.position && (
                      <p className="text-sm text-gray-500 mb-2">Category: {link.position}</p>
                    )}
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-4">
                    <Button 
                      asChild 
                      className="w-full bg-ipblue-600 hover:bg-ipblue-700 gap-2"
                    >
                      <a href={link.url || '#'} target="_blank" rel="noopener noreferrer">
                        Visit Resource <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Resources;
