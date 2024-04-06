import { Menu, Package2 } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import Sidenav from "../admin/Sidenav"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { useState } from "react"

const MobileSideBar = () => {
    const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 md:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="flex flex-col">
      <a
        href="#"
        className="mx-[-0.65rem] flex items-center gap-2 ps-2 text-lg font-semibold"
      >
        <Package2 className="h-6 w-6" />
        <span className="sr-only">NMDB Dashboard</span>
      </a>
      <Sidenav
        className="gap-2 text-lg font-medium"
        isMobileSidebar={true}
        setOpen={setOpen}
      />

      <div className="mt-auto">
        <Card>
          <CardHeader>
            <CardTitle> Film Development Board</CardTitle>
            <CardDescription>
              @{new Date().getFullYear()} All Rights Reserved
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </SheetContent>
  </Sheet>
  )
}

export default MobileSideBar