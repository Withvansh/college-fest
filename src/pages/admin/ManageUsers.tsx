import React, { useState, useEffect } from 'react';
import { Search, Users, UserCheck, UserX, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { userAPI, User, CreateUserData, UpdateUserData } from '@/lib/api/user';
import UserModal from '@/components/admin/UserModal';
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog';

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userStats, setUserStats] = useState({
    total: 0,
    jobseekers: 0,
    recruiters: 0,
    freelancers: 0,
    clients: 0,
    colleges: 0,
    students: 0,
    admins: 0,
    superadmins: 0,
    startups: 0,
  });

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, [currentPage]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers(currentPage, pageSize);
      setUsers(response.users || []);
      setTotalUsers(response.total || 0);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await userAPI.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      setIsSubmitting(true);
      await userAPI.createUser(userData);
      toast.success('User created successfully');
      setCurrentPage(1);
      await loadUsers();
      await loadUserStats();
      setIsUserModalOpen(false);
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (userData: UpdateUserData) => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);
      await userAPI.updateUser(selectedUser.id, userData);
      toast.success('User updated successfully');
      await loadUsers();
      await loadUserStats();
      setIsUserModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Failed to update user');
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsSubmitting(true);
      await userAPI.deleteUser(userToDelete.id);
      toast.success('User deleted successfully');

      // If this was the last user on the current page and we're not on page 1, go to previous page
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      await loadUsers();
      await loadUserStats();
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const closeModals = () => {
    setIsUserModalOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    setUserToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalUsers / pageSize);

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'super_admin':
      case 'hr_admin':
        return 'destructive';
      case 'recruiter':
        return 'default';
      case 'jobseeker':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        <div className="animate-pulse">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <div className="space-y-2">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="h-9 sm:h-10 bg-gray-200 rounded w-32"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-9 sm:h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
            {/* Mobile card skeleton */}
            <div className="block sm:hidden space-y-3">
              {[...Array(pageSize)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="flex gap-2">
                        <div className="h-5 bg-gray-300 rounded w-16"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-8 h-8 bg-gray-300 rounded"></div>
                      <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table skeleton */}
            <div className="hidden sm:block space-y-3">
              {[...Array(pageSize)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
            {/* Pagination skeleton */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userCardData = [
    {
      title: 'Total Users',
      value: userStats.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Job Seekers',
      value: userStats.jobseekers,
      icon: UserCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Colleges',
      value: userStats.colleges,
      icon: UserCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'StartUps',
      value: userStats.startups,
      icon: UserCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Recruiters',
      value: userStats.recruiters,
      icon: UserX,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Admins',
      value: userStats.admins,
      icon: null, // Custom admin icon
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const renderUserStatsCards = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {userCardData.map((card, index) => (
        <Card key={index} className="p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">{card.title}</p>
                <p className={`text-xl sm:text-2xl md:text-3xl font-bold mt-1 ${card.color}`}>
                  {card.value}
                </p>
              </div>
              <div className="flex-shrink-0 ml-3">
                {card.icon ? (
                  <card.icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${card.color}`} />
                ) : (
                  // Custom admin icon
                  <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold text-red-600">A</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage and monitor all user accounts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentPage(1);
              loadUsers();
            }}
            disabled={loading}
            size="sm"
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsUserModalOpen(true)} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {renderUserStatsCards()}

      {/* Search */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  if (currentPage !== 1) setCurrentPage(1);
                }}
                className="pl-10 h-10 sm:h-11"
              />
            </div>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  if (currentPage !== 1) setCurrentPage(1);
                }}
                size="sm"
                className="w-full sm:w-auto"
              >
                Clear Search
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Users Directory</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Showing {filteredUsers.length} of {totalUsers} users (Page {currentPage} of {totalPages}
            )
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <Users className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {users.length === 0 ? 'No users yet' : 'No users match your search'}
              </h3>
              <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                {users.length === 0
                  ? 'Users will appear here once they register on the platform.'
                  : 'Try adjusting your search criteria or clear the search to see all users.'}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    if (currentPage !== 1) setCurrentPage(1);
                  }}
                  size="sm"
                  className="w-full sm:w-auto sm:size-default"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden">
                <div className="space-y-3">
                  {filteredUsers.map(user => (
                    <Card key={user.id} className="p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.full_name || user.email}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-bold">
                              {(user.full_name || user.email).charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm truncate">
                                {user.full_name || 'No name'}
                              </p>
                              <p className="text-xs text-gray-500 truncate mb-1">{user.email}</p>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                                  {user.role || 'No role'}
                                </Badge>
                                {user.phone && (
                                  <span className="text-xs text-gray-500 truncate">
                                    📞 {user.phone}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                Joined {new Date(user.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditModal(user)}
                                disabled={isSubmitting}
                                className="h-8 w-8 p-0 touch-manipulation"
                                title="Edit User"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(user)}
                                disabled={isSubmitting}
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 touch-manipulation"
                                title="Delete User"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto -mx-2 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">User</TableHead>
                        <TableHead className="whitespace-nowrap">Role</TableHead>
                        <TableHead className="whitespace-nowrap hidden sm:table-cell">
                          Contact
                        </TableHead>
                        <TableHead className="whitespace-nowrap hidden md:table-cell">
                          Joined
                        </TableHead>
                        <TableHead className="whitespace-nowrap">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map(user => (
                        <TableRow key={user.id} className="hover:bg-gray-50/50">
                          <TableCell className="min-w-[200px]">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                {user.avatar_url ? (
                                  <img
                                    src={user.avatar_url}
                                    alt={user.full_name || user.email}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <span className="text-xs sm:text-sm font-bold">
                                    {(user.full_name || user.email).charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm sm:text-base truncate">
                                  {user.full_name || 'No name'}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                              {user.role || 'No role'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <div className="text-gray-600">{user.phone || 'No phone'}</div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 sm:gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditModal(user)}
                                disabled={isSubmitting}
                                className="h-8 w-8 p-0"
                                title="Edit User"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(user)}
                                disabled={isSubmitting}
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                title="Delete User"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                <span className="sm:hidden">
                  {currentPage} / {totalPages}
                </span>
                <span className="hidden sm:inline">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                  title="Go to previous page"
                >
                  <span className="sm:hidden">‹</span>
                  <span className="hidden sm:inline">Prev</span>
                </Button>

                <div className="flex items-center gap-1">
                  {/* Mobile: Show current page and total */}
                  <div className="sm:hidden flex items-center gap-1">
                    <span className="text-xs text-gray-600 px-2">
                      {currentPage} of {totalPages}
                    </span>
                  </div>

                  {/* Desktop: Show page numbers */}
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          disabled={loading}
                          className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                          title={`Go to page ${pageNumber}`}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                  title="Go to next page"
                >
                  <span className="sm:hidden">›</span>
                  <span className="hidden sm:inline">Next</span>
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* User Modal */}
      <UserModal
        open={isUserModalOpen}
        onClose={closeModals}
        onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
        user={selectedUser}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onClose={closeModals}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.full_name || userToDelete?.email}? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ManageUsers;
