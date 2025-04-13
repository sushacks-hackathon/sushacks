
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Define the database response type without an id
interface SupabaseInternshipResponse {
  apply: string | null;
  company: string | null;
  company_industry: string | null;
  company_size: string | null;
  created_at: string | null;
  date: string | null;
  graduate_time: string | null;
  hire_time: string | null;
  location: string | null;
  qualifications: string | null;
  salary: string | null;
  title: string | null;
  work_model: string | null;
}

// Define our app's internship type with an id
interface InternshipRaw extends SupabaseInternshipResponse {
  id: string; // We'll always ensure this exists in our app
}

const InternshipsList = () => {
  const [internships, setInternships] = useState<InternshipRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { savedInternships, saveInternship, unsaveInternship } = useData();
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [workModel, setWorkModel] = useState('all');
  const [location, setLocation] = useState('all');
  
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('internships_raw')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Ensure each record has an id by generating one if it doesn't exist
        const internshipsWithId = (data || []).map((item: SupabaseInternshipResponse) => ({
          ...item,
          id: `internship-${Math.random().toString(36).substring(2, 9)}`
        }));
        
        setInternships(internshipsWithId);
      } catch (err) {
        console.error('Error fetching internships:', err);
        setError('Failed to load internships');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInternships();
  }, []);
  
  // Extract unique locations and work models for filters
  const uniqueLocations = React.useMemo(() => {
    const locations = new Set(internships
      .map(intern => intern.location)
      .filter(Boolean) as string[]);
    return Array.from(locations);
  }, [internships]);
  
  const uniqueWorkModels = React.useMemo(() => {
    const models = new Set(internships
      .map(intern => intern.work_model)
      .filter(Boolean) as string[]);
    return Array.from(models);
  }, [internships]);
  
  // Filter internships based on criteria
  const filteredInternships = React.useMemo(() => {
    return internships.filter(internship => {
      const matchesSearch = !searchQuery || 
        (internship.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         internship.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         internship.location?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesWorkModel = workModel === 'all' || internship.work_model === workModel;
      const matchesLocation = location === 'all' || internship.location === location;
      
      return matchesSearch && matchesWorkModel && matchesLocation;
    });
  }, [internships, searchQuery, workModel, location]);
  
  // Handle save/unsave
  const handleSaveToggle = (id: string) => {
    if (savedInternships.includes(id)) {
      unsaveInternship(id);
      toast.success('Internship removed from saved items');
    } else {
      saveInternship(id);
      toast.success('Internship saved successfully');
    }
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setWorkModel('all');
    setLocation('all');
  };
  
  if (loading) return <div className="text-center py-12">Loading internships...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by title, company, or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="workModel">Work Model</Label>
            <Select value={workModel} onValueChange={setWorkModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select Work Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Work Models</SelectItem>
                {uniqueWorkModels.map(model => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
        </div>
      </div>
      
      {/* Results count */}
      <div className="mb-4">
        <h2 className="text-xl font-medium">
          {filteredInternships.length} {filteredInternships.length === 1 ? 'result' : 'results'} found
        </h2>
      </div>
      
      {/* Internships grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map(internship => (
          <Card key={internship.id} className="h-full hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{internship.title || 'Untitled Internship'}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSaveToggle(internship.id)}
                  className={cn(savedInternships.includes(internship.id) && "text-ipblue-600")}
                >
                  <Bookmark className={cn("h-5 w-5", savedInternships.includes(internship.id) ? "fill-current" : "")} />
                </Button>
              </div>
              <div className="text-sm font-semibold text-ipblue-700">{internship.company || 'Unknown Company'}</div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {internship.work_model && (
                  <Badge variant={internship.work_model.toLowerCase().includes('remote') ? 'outline' : 'default'}>
                    {internship.work_model}
                  </Badge>
                )}
                {internship.location && (
                  <Badge variant="secondary">{internship.location}</Badge>
                )}
                {internship.salary && (
                  <Badge variant="outline" className="text-green-600">
                    {internship.salary}
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                asChild 
                className="w-full bg-ipblue-600 hover:bg-ipblue-700 gap-2"
              >
                <a href={internship.apply || '#'} target="_blank" rel="noopener noreferrer">
                  Apply Now <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredInternships.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No internships match your filters</h3>
          <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default InternshipsList;
