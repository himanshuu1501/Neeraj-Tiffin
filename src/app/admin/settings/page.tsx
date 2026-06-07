import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Business Name:</span> TiffinHub</p>
            <p><span className="text-muted-foreground">Phone:</span> +91 98765 43210</p>
            <p><span className="text-muted-foreground">Email:</span> hello@tiffinhub.com</p>
            <p><span className="text-muted-foreground">Location:</span> Dehradun, Uttarakhand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Setup</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>To promote a user to admin, run this SQL in Supabase:</p>
            <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs">
{`UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin@email.com';`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
