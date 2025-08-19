
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Building, 
  User, 
  Crown,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface OrgNode {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  avatar?: string;
  manager_id?: string;
  subordinates: OrgNode[];
  level: number;
}

const OrganizationChart = () => {
  const [orgData, setOrgData] = useState<OrgNode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedEmployee, setSelectedEmployee] = useState<OrgNode | null>(null);

  // Sample organization data - replace with real data from Supabase
  useEffect(() => {
    const sampleData: OrgNode[] = [
      {
        id: "1",
        name: "John CEO",
        title: "Chief Executive Officer",
        department: "Executive",
        email: "john.ceo@company.com",
        phone: "+1-555-0101",
        level: 0,
        subordinates: [
          {
            id: "2",
            name: "Sarah CTO",
            title: "Chief Technology Officer",
            department: "Technology",
            email: "sarah.cto@company.com",
            phone: "+1-555-0102",
            manager_id: "1",
            level: 1,
            subordinates: [
              {
                id: "3",
                name: "Mike Lead",
                title: "Lead Developer",
                department: "Engineering",
                email: "mike.lead@company.com",
                phone: "+1-555-0103",
                manager_id: "2",
                level: 2,
                subordinates: [
                  {
                    id: "4",
                    name: "Anna Dev",
                    title: "Senior Developer",
                    department: "Engineering",
                    email: "anna.dev@company.com",
                    phone: "+1-555-0104",
                    manager_id: "3",
                    level: 3,
                    subordinates: []
                  },
                  {
                    id: "5",
                    name: "Bob Dev",
                    title: "Junior Developer",
                    department: "Engineering",
                    email: "bob.dev@company.com",
                    phone: "+1-555-0105",
                    manager_id: "3",
                    level: 3,
                    subordinates: []
                  }
                ]
              }
            ]
          },
          {
            id: "6",
            name: "Lisa HR",
            title: "HR Director",
            department: "Human Resources",
            email: "lisa.hr@company.com",
            phone: "+1-555-0106",
            manager_id: "1",
            level: 1,
            subordinates: [
              {
                id: "7",
                name: "Tom Recruiter",
                title: "Senior Recruiter",
                department: "Human Resources",
                email: "tom.recruiter@company.com",
                phone: "+1-555-0107",
                manager_id: "6",
                level: 2,
                subordinates: []
              }
            ]
          },
          {
            id: "8",
            name: "David Sales",
            title: "Sales Director",
            department: "Sales",
            email: "david.sales@company.com",
            phone: "+1-555-0108",
            manager_id: "1",
            level: 1,
            subordinates: [
              {
                id: "9",
                name: "Emma Sales",
                title: "Sales Manager",
                department: "Sales",
                email: "emma.sales@company.com",
                phone: "+1-555-0109",
                manager_id: "8",
                level: 2,
                subordinates: []
              }
            ]
          }
        ]
      }
    ];
    setOrgData(sampleData);
    // Expand CEO node by default
    setExpandedNodes(new Set(["1"]));
  }, []);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderOrgNode = (node: OrgNode) => {
    const hasSubordinates = node.subordinates.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const levelColors = [
      'bg-purple-100 border-purple-300 text-purple-800',
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-green-100 border-green-300 text-green-800',
      'bg-yellow-100 border-yellow-300 text-yellow-800',
    ];
    const colorClass = levelColors[node.level] || 'bg-gray-100 border-gray-300 text-gray-800';

    return (
      <div key={node.id} className="relative">
        {/* Node Card */}
        <div 
          className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${colorClass}`}
          style={{ marginLeft: `${node.level * 40}px` }}
        >
          {/* Connector Lines */}
          {node.level > 0 && (
            <>
              <div 
                className="absolute w-8 h-px bg-gray-300 top-1/2 -left-8"
                style={{ left: `-${32}px` }}
              />
              <div 
                className="absolute w-px h-8 bg-gray-300 -left-8 top-1/2 -translate-y-full"
                style={{ left: `-${32}px` }}
              />
            </>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* Expand/Collapse Button */}
              {hasSubordinates && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleNode(node.id)}
                  className="p-1 h-6 w-6"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* Avatar */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {node.level === 0 ? (
                  <Crown className="h-6 w-6 text-yellow-600" />
                ) : (
                  <User className="h-6 w-6 text-gray-600" />
                )}
              </div>

              {/* Employee Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{node.name}</h3>
                <p className="text-xs opacity-80">{node.title}</p>
                <Badge variant="outline" className="text-xs mt-1 bg-white/50">
                  {node.department}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedEmployee(node)}
                    className="h-8 w-8 p-0"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Employee Details
                    </DialogTitle>
                  </DialogHeader>
                  {selectedEmployee && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          {selectedEmployee.level === 0 ? (
                            <Crown className="h-8 w-8 text-yellow-600" />
                          ) : (
                            <User className="h-8 w-8 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                          <p className="text-gray-600">{selectedEmployee.title}</p>
                          <Badge className="mt-1">{selectedEmployee.department}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedEmployee.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedEmployee.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedEmployee.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {selectedEmployee.subordinates.length} Direct Reports
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {hasSubordinates && (
                <Badge variant="outline" className="text-xs bg-white/50">
                  {node.subordinates.length}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Subordinates */}
        {hasSubordinates && isExpanded && (
          <div className="mt-4 space-y-4">
            {node.subordinates.map(subordinate => renderOrgNode(subordinate))}
          </div>
        )}
      </div>
    );
  };

  const flattenOrgData = (nodes: OrgNode[]): OrgNode[] => {
    let result: OrgNode[] = [];
    nodes.forEach(node => {
      result.push(node);
      if (node.subordinates.length > 0) {
        result = result.concat(flattenOrgData(node.subordinates));
      }
    });
    return result;
  };

  const filteredData = searchTerm 
    ? flattenOrgData(orgData).filter(node => 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : orgData;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Chart</h1>
          <p className="text-gray-600">Visualize your company's organizational structure</p>
        </div>
        <Button className="w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search employees, titles, or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Users className="h-3 w-3 mr-1" />
            {flattenOrgData(orgData).length} Employees
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Building className="h-3 w-3 mr-1" />
            4 Departments
          </Badge>
        </div>
      </div>

      {/* Organization Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {searchTerm ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Search Results:</h3>
              {filteredData.map(node => (
                <div key={node.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {node.level === 0 ? (
                        <Crown className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <User className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{node.name}</h4>
                      <p className="text-sm text-gray-600">{node.title}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {node.department}
                      </Badge>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      Level {node.level + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {orgData.map(node => renderOrgNode(node))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Executive", "Technology", "Human Resources", "Sales"].map((dept, index) => {
          const deptEmployees = flattenOrgData(orgData).filter(emp => emp.department === dept);
          const colors = ["purple", "blue", "green", "yellow"];
          const color = colors[index];
          
          return (
            <Card key={dept} className={`border-l-4 border-l-${color}-500`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Building className={`h-8 w-8 text-${color}-600`} />
                  <div>
                    <h3 className="font-semibold">{dept}</h3>
                    <p className="text-sm text-gray-600">{deptEmployees.length} employees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OrganizationChart;
