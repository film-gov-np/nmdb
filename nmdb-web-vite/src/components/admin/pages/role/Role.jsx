import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosInstance from "@/helpers/axiosSetup";
import { Badge } from "lucide-react";
import { useEffect } from "react";

const Role = () => {
  useEffect(() => {
    axiosInstance
      .post("api/film/role", postData)
      .then((resp) => {
        if (resp) {
          const {
            created,
            email,
            firstName,
            idx,
            isVerified,
            jwtToken,
            lastName,
            updated,
          } = resp.data.data;
          //set token to cookie or localStorage
          localStorage.setItem("token", jwtToken);
          setIsAuthorized(true);
          navigate("/admin/dashboard");
        }
      })
      .catch((error) => { });

  }, []);

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Roles</CardTitle>
        <CardDescription>Film Roles</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead className="hidden sm:table-cell">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-accent">
              <TableCell>
                <div className="font-medium">Writer</div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">Subtitle in English</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Fulfilled
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Role;
