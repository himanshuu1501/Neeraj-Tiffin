import { getCustomerStats } from "@/lib/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { AdminCustomerSearch } from "./customer-search";

export const metadata = { title: "Customers" };

interface AdminCustomersPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function AdminCustomersPage({ searchParams }: AdminCustomersPageProps) {
  const params = await searchParams;
  let customers = await getCustomerStats();

  if (params.search) {
    const search = params.search.toLowerCase();
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone?.includes(search)
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customer Management</h1>
      <AdminCustomerSearch initialSearch={params.search} />

      <div className="grid gap-4 mt-6">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <Card key={customer.id}>
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                  {customer.phone && (
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  )}
                </div>
                <div className="flex gap-8 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Orders</p>
                    <p className="text-xl font-bold">{customer.totalOrders}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(customer.totalRevenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No customers found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
