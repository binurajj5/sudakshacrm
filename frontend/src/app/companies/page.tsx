'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { companyService } from '@/services/company.service';
import { Company, CompanyType, CompanyStatus } from '@/types/company';
import { Building2, Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { CreateCompanyDialog } from '@/components/companies/create-company-dialog';
import { AppHeader } from '@/components/layout/app-header';
import { ProtectedRoute } from '@/components/auth/protected-route';

function CompaniesPageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAll();
      setCompanies(response.data);
      setFilteredCompanies(response.data);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to fetch companies',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchTerm, companies]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return;

    try {
      await companyService.delete(id);
      toast({
        title: 'Success',
        description: 'Company deleted successfully',
      });
      fetchCompanies();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to delete company',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: CompanyStatus) => {
    const colors = {
      ACTIVE: 'bg-green-500',
      INACTIVE: 'bg-gray-500',
      PROSPECT: 'bg-blue-500',
      CHURNED: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getTypeColor = (type: CompanyType) => {
    const colors = {
      INSTITUTIONAL: 'bg-purple-500',
      CORPORATE: 'bg-blue-500',
      GOVERNMENT: 'bg-green-500',
      NGO: 'bg-orange-500',
      STARTUP: 'bg-pink-500',
      SME: 'bg-yellow-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading companies...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Companies
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your B2B accounts and institutional clients
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Companies</CardDescription>
            <CardTitle className="text-3xl">{companies.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">
              {companies.filter((c) => c.status === CompanyStatus.ACTIVE).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Prospects</CardDescription>
            <CardTitle className="text-3xl">
              {companies.filter((c) => c.status === CompanyStatus.PROSPECT).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Institutional</CardDescription>
            <CardTitle className="text-3xl">
              {companies.filter((c) => c.type === CompanyType.INSTITUTIONAL).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by company name, email, or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Companies Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contacts</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      {searchTerm
                        ? 'No companies found matching your search'
                        : 'No companies yet. Add your first company to get started.'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{company.name}</div>
                        {company.email && (
                          <div className="text-sm text-muted-foreground">{company.email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(company.type)}>{company.type}</Badge>
                    </TableCell>
                    <TableCell>{company.industry || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(company.status)}>{company.status}</Badge>
                    </TableCell>
                    <TableCell>{company._count?.contacts || 0}</TableCell>
                    <TableCell>
                      {company.owner
                        ? `${company.owner.firstName} ${company.owner.lastName}`
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/companies/${company.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(company.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateCompanyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchCompanies}
      />
      </div>
    </>
  );
}

export default function CompaniesPage() {
  return (
    <ProtectedRoute>
      <CompaniesPageContent />
    </ProtectedRoute>
  );
}
