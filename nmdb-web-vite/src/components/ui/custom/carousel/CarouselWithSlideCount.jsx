<div className="flex justify-between p-1">
  <div className="flex gap-2">
    <CarouselPrevious className="relative left-0 " />
    <CarouselNext className="relative right-0 " />
  </div>
  <div className="text-center text-muted-foreground">
    {current} / {count}
  </div>
</div>;
