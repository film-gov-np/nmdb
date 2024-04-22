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

const QrCodeGenerator = ({ url }) => {
  const qrBlockRef = useRef(null);
  const downloadQRCode = () => {
    toJpeg(qrBlockRef.current)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "rajesh_hamal.jpeg";
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating QR code:", error);
      });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">QR card</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>
        <div className="my-2 overflow-hidden" ref={qrBlockRef}>
          <div className="rounded-lg border border-input p-6">
            <div className="grid grid-flow-row  gap-2 ">
              {url && (
                <div className="m-2 h-auto max-w-xs rounded-lg bg-white p-6">
                  <QRCode
                    value={url}
                    size={256}
                    className="aspect-square h-auto w-full max-w-full"
                    viewBox={`0 0 256 256`}
                  />
                </div>
              )}
              <Separator className="my-8" />
              <div className="flex  items-center gap-4">
                <Avatar className="flex h-12 w-12">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>RH</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-xl font-medium leading-none">
                    Rajesh Hamal
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Actor Producer
                  </p>
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
