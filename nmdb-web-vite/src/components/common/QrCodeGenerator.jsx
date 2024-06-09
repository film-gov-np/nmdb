import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import QRCode from "react-qr-code";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toJpeg } from "html-to-image";
import { QrCode } from "lucide-react";
import { ApiPaths } from "@/constants/apiPaths";
import axiosInstance from "@/helpers/axiosSetup";
import { useQuery } from "@tanstack/react-query";

const QrCodeGenerator = ({ celebrity, showTrigger = true, ...props }) => {


  const qrBlockRef = useRef(null);
  const downloadQRCode = () => {
    toJpeg(qrBlockRef.current)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = details.name + ".jpeg";
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating QR code:", error);
      });
  };

  const url = "http://localhost:5173/celebrities/" + celebrity.id;
  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="p-2">
            <QrCode className="h-6 w-6 rounded-lg" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>
        <div className="my-2 overflow-hidden">
          <div className=" border border-input p-6" ref={qrBlockRef}>
            <div className="grid grid-flow-row items-center justify-center  gap-2 ">
              {url && (
                <div className="mx-auto max-h-[18rem] max-w-[18rem] rounded-lg bg-white p-6">
                  <QRCode
                    value={url}
                    size={256}
                    className="aspect-square h-auto w-full max-w-full"
                    viewBox={`0 0 256 256`}
                  />
                </div>
              )}
              <Separator className="my-8" />
              <div className="flex  items-start gap-4">
                <Avatar className="flex h-36 w-28 rounded-lg">
                  <AvatarImage src={celebrity.profileImageUrl} alt="Avatar" />
                  <AvatarFallback>RH</AvatarFallback>
                </Avatar>
                <div className="grid gap-4">
                  <div className="grid gap-1">
                    <p className="text-xl font-medium leading-none">
                      {celebrity.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {/* {celebrity.known_for_department} */}
                    </p>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-md font-medium leading-none">
                      Address
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {celebrity.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={downloadQRCode}>Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeGenerator;
