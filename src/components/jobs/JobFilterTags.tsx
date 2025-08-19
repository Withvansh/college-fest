import { Badge } from '@/components/ui/badge';

const filterTags = [
  'Sales', 'Fulltime', 'Remote', 'Product designer', 'Marketing', 
  'Engineering', 'Contract', 'Senior Level', 'Junior', 'Mid-level'
];

interface JobFilterTagsProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const JobFilterTags = ({ selectedTags, onTagToggle }: JobFilterTagsProps) => {
  return (
    <div className="bg-job-bg py-4 px-6 border-b">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          {filterTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "secondary"}
              className={`
                cursor-pointer whitespace-nowrap px-3 py-1 text-xs font-medium rounded-full
                ${selectedTags.includes(tag) 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-job-tag-bg text-job-text-secondary hover:bg-job-tag-bg/80'
                }
              `}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobFilterTags;