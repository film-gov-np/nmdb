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

const CelebQrCard = ({ url, details }) => {
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="max-h-[14rem] w-[7.5rem] rounded-lg bg-white p-1.5">
          <QRCode
            value={url}
            size={128}
            className="aspect-square h-auto w-full max-w-full"
            viewBox={`0 0 256 256`}
          />
        </div>
      </DialogTrigger>
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
              {/* <Separator className="my-8" />
              <div className="flex  items-start gap-4">
                <Avatar className="flex h-36 w-28 rounded-lg">
                  <AvatarImage src={details.profilePhotoUrl} alt="Avatar" />
                  <AvatarFallback>RH</AvatarFallback>
                </Avatar>
                <div className="grid gap-4">
                  <div className="grid gap-1">
                    <p className="text-xl font-medium leading-none">
                      {details.name}
                    </p>
                    {details.designations?.map((genre, index) => (
                      <li
                        key={"celeb-designations-" + index}
                        className="flex flex-row items-center space-x-2"
                      >
                        <p className="text-sm text-muted-foreground">
                          {genre.roleName}
                        </p>
                      </li>
                    ))}
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm text-muted-foreground">
                      {details.email}
                    </p>
                  </div>
                </div>
              </div> */}
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

export default CelebQrCard;
