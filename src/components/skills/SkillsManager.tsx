
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { skillsApi, type Skill, type UserSkill } from '@/lib/api/skills';

const SkillsManager = () => {
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [proficiencyLevel, setProficiencyLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [skills, userSkillsData] = await Promise.all([
        skillsApi.getSkills(),
        skillsApi.getUserSkills()
      ]);
      
      setAvailableSkills(skills);
      setUserSkills(userSkillsData);
    } catch (error) {
      console.error('Error loading skills data:', error);
      toast.error('Failed to load skills data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkillId) {
      toast.error('Please select a skill');
      return;
    }

    try {
      const newUserSkill = await skillsApi.addUserSkill({
        skill_id: selectedSkillId,
        proficiency_level: proficiencyLevel,
        years_of_experience: yearsOfExperience,
        verified: false
      });

      setUserSkills(prev => [...prev, newUserSkill]);
      setSelectedSkillId('');
      setProficiencyLevel('beginner');
      setYearsOfExperience(0);
      
      toast.success('Skill added successfully');
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (userSkillId: string) => {
    try {
      await skillsApi.removeUserSkill(userSkillId);
      setUserSkills(prev => prev.filter(skill => skill.id !== userSkillId));
      toast.success('Skill removed successfully');
    } catch (error) {
      console.error('Error removing skill:', error);
      toast.error('Failed to remove skill');
    }
  };

  const availableSkillsToAdd = availableSkills.filter(skill => 
    !userSkills.some(userSkill => userSkill.skill_id === skill.id)
  );

  if (loading) {
    return <div className="flex justify-center p-8">Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
          <CardDescription>Add a new skill to your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="skill-select">Select Skill</Label>
            <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a skill..." />
              </SelectTrigger>
              <SelectContent>
                {availableSkillsToAdd.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name} {skill.category && `(${skill.category})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="proficiency-select">Proficiency Level</Label>
            <Select value={proficiencyLevel} onValueChange={(value: any) => setProficiencyLevel(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="years-input">Years of Experience</Label>
            <Input
              id="years-input"
              type="number"
              min="0"
              max="50"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(parseInt(e.target.value) || 0)}
            />
          </div>

          <Button onClick={handleAddSkill} disabled={!selectedSkillId}>
            Add Skill
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Skills</CardTitle>
          <CardDescription>Skills you have added to your profile</CardDescription>
        </CardHeader>
        <CardContent>
          {userSkills.length === 0 ? (
            <p className="text-muted-foreground">No skills added yet. Add your first skill above!</p>
          ) : (
            <div className="space-y-4">
              {userSkills.map((userSkill) => (
                <div key={userSkill.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{userSkill.skill?.name}</h3>
                      {userSkill.skill?.category && (
                        <Badge variant="secondary">{userSkill.skill.category}</Badge>
                      )}
                      {userSkill.verified && (
                        <Badge variant="default">Verified</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="capitalize">{userSkill.proficiency_level}</span>
                      {userSkill.years_of_experience > 0 && (
                        <span> • {userSkill.years_of_experience} years experience</span>
                      )}
                    </div>
                    {userSkill.skill?.description && (
                      <p className="text-sm text-muted-foreground">{userSkill.skill.description}</p>
                    )}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveSkill(userSkill.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsManager;
